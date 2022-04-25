import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer-extra';
// import { InjectBrowser } from 'nest-puppeteer';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

@Injectable()
export class ParsingService {
  async startScrapping() {
    const offers = [];
    const developers = [];
    const complexes = [];
    const fullData = [];
    const preintedIDs = [];
    const complexesURLs = [];
    const searchURL =
      'https://perm.domclick.ru/search?category=living&deal_type=sale&from=topline2020&from_developer=1&ne=58.523862%2C57.285486&offer_type=layout&offset=0&sw=57.708508%2C53.066736';

    // Функция сохранения элемента
    const saveOneItem = async (inX: any) => {
      const row = JSON.parse(JSON.stringify(inX));
      row.offers = null;

      const index = complexes.findIndex(
        (item) => item.complex_id == row.complex_id,
      );
      const ourItem = {
        id: row.id,
        image: null,
        developer: index !== -1 ? complexes[index].developer_name : null,
        developerId: index !== -1 ? complexes[index].developer_id : null,
        complex: row.complex.name,
        complexId: row.complex_id,
        address: row.address.display_name,
        commissioningDate:
          index !== -1
            ? complexes[index].end_build_quarter +
              ' кв. ' +
              complexes[index].end_build_year +
              ' г.'
            : null,
        price: row.price_info.price,
        totalArea: row.object_info.area,
        floor: row.object_info.floor,
        floorsAmount: row.max_floor,
        roomsAmount: row.object_info.rooms,
        complexUrl: 'https://perm.domclick.ru/complexes/' + row.slug,
      };

      if (row.photo && row.photo.length > 0) {
        ourItem.image = 'https://img.dmclk.ru' + row.photo[0];
      }

      if (preintedIDs[ourItem.id] !== 1) {
        offers.push(ourItem);
        fullData.push(row);
        preintedIDs[ourItem.id] = 1;
      }

      // console.log("SAVED : " + ourItem.id);
    };

    // Функция сохранения
    const saveItems = async (items: any[], page: any) => {
      if (items.length === 0) {
        console.log('saveItems empty...');
        process.exit(0);
      }

      for (const i of items) {
        const item = items[i];
        if (item.id === undefined) {
          continue;
        }

        if (
          item.offers !== undefined &&
          item.offers !== null &&
          item.offers.length >= 1
        ) {
          const offersLength = item.offers.length;

          console.log(item.id + ' offers ' + offersLength + ' pcs ');

          for (const n of offersLength) {
            const item2 = JSON.parse(JSON.stringify(item));
            try {
              const offer = item.offers[n];
              console.log(
                ' ---- ' +
                  offer.id +
                  ' FLOOR: ' +
                  offer.object_info.floor +
                  ' PRICE: ' +
                  offer.price_info.price +
                  ' AREA: ' +
                  item.object_info.area +
                  ' COMPLEX: ' +
                  item.complex.name +
                  ' ADDRESS: ' +
                  item.address.display_name,
              );
              item2.id = offer.id;
              item2.object_info.floor = JSON.parse(
                JSON.stringify(offer.object_info.floor),
              );
              item2.object_info.flat_number = JSON.parse(
                JSON.stringify(offer.object_info.flat_number),
              );
              item2.price_info = JSON.parse(JSON.stringify(offer.price_info));
            } catch (e) {
              console.log(item2);
              console.log('stopSTOPstop');
              console.log(e);
              process.exit(0);
            }
            await saveOneItem(item2);
          }
        } else {
          console.log(item);
          console.log(' item.offers IS NULL ' + page.url());
          console.log('\n');
          process.exit(0);
        }
      }
    };

    // Функция парсинга
    const parsing = async (itemsClean: any[]) => {
      if (!itemsClean) {
        console.log('itemsClean undefined');
        return;
      }

      for (const i of itemsClean) {
        const row: any = itemsClean[i];

        // Значит реклама
        if (row.developer === undefined || row.complex === null) {
          continue;
        }

        const item = {
          complex_url: 'https://perm.domclick.ru/complexes/' + row.slug,
        };

        complexesURLs[item.complex_url] = 1;

        // Helper
        row.complex.developer_name = row.developer.name;
        complexes.push(row.complex);
        developers.push(row.developer);
      }

      // Backup write...
      // fs.writeFileSync(
      //   FILEPATH_COMPLEXES,
      //   JSON.stringify(COMPLEXES_FOR_SAVE, null, 2),
      // );
      console.log({ complexes, developers });
    };

    // Overview Rooms https://complex-api.domclick.ru/v4/complexes/115993/layouts?page_size=10
    // Each Rooms https://complex-api.domclick.ru/v4/layouts/?rooms=1&complex_id=115993&limit=10&offset=10
    const overviewComplex = async (complexId: number, page: any) => {
      console.log('\n');

      // Overview
      const url =
        'https://complex-api.domclick.ru/v4/complexes/' +
        complexId +
        '/layouts?page_size=10';
      await page.goto(url, { waitUntil: 'load' });

      const overviewContent = await page.evaluate(() => {
        return JSON.parse(document.querySelector('pre').innerText);
      });

      const rooms = [];
      for (const i of overviewContent.items) {
        rooms.push(overviewContent.items[i].rooms);
      }
      console.log('Rooms: ' + JSON.stringify(rooms));

      for (const i of rooms) {
        const room = rooms[i];

        let offset = 0;

        while (1) {
          const url =
            'https://complex-api.domclick.ru/v4/layouts/?rooms=' +
            room +
            '&complex_id=' +
            complexId +
            '&limit=10&offset=' +
            offset;
          console.log(url);
          await page.goto(url, { waitUntil: 'load' });
          const json = await page.evaluate(() => {
            return JSON.parse(document.querySelector('pre').innerText);
          });
          await page.waitForTimeout(1000);
          console.log(
            'Loaded: ' +
              json.items.length +
              ' pcs ||| ' +
              JSON.stringify(json.pagination),
          );

          if (json.pagination.total > 0 && json.items.length > 0) {
            await saveItems(json.items, page);

            // End
            if (json.items.length < 10) {
              break;
            }

            offset += 10;
          } else {
            break;
          }
        }
      }
    };

    puppeteer
      .use(StealthPlugin())
      .launch({
        headless: true,
        executablePath:
          process.env.CHROMIUM_PATH ||
          './node_modules/puppeteer/.local-chromium/win64-706915/chrome-win/chrome.exe',
      })
      .then(async (browser) => {
        console.log('Running tests..');
        const page = await browser.newPage();

        await page.goto(searchURL, { waitUntil: 'load' });
        await page.waitForSelector('[data-test="offers-list__item"]');

        const title = await page.evaluate(() => {
          return document.title;
        });
        console.log('Title: ' + title);

        const lastPageNum = await page.evaluate(() => {
          const page = document.querySelector(
            '[data-test=pagination-last-page]',
          );
          return page ? page.textContent : 1;
        });

        console.log('lastPageNum: ' + lastPageNum);

        page.on('response', async (response) => {
          if (
            response
              .url()
              .indexOf(
                'offers-service.domclick.ru/research/v4/offers/?address=',
              ) > 0
          ) {
            let items = await response.json();
            items = items.result.items;
            await parsing(items);
          }
        });

        let whileNum = 0;

        while (1) {
          whileNum++;

          console.log(page.url());
          console.log('Current DATA_FOR_SAVE: ' + offers.length + ' pcs');

          // TODO TEMP
          //COMPLEXES_URLS["https://perm.domclick.ru/complexes/pogoda-teplye-kvartaly__116495"] = 1;

          // console.log("waitForSelector: offers-list__item");
          await page.waitForSelector('[data-test="offers-list__item"]');
          await page.waitForTimeout(3000);

          if (whileNum === 1) {
            // const itemsClean = await page.evaluate(() => {
            //   return window.__data.search.itemsClean;
            // });

            // await parsing(itemsClean);
            await page.waitForTimeout(3000);
          }

          /*
           * Next Page
           */
          const hasNextPage = await page.evaluate(() => {
            const page = document.querySelector(
              '[data-test=pagination-last-page]',
            );
            console.log(page);
            if (page) {
              const elem = page.parentNode.querySelector('.ANF7W').nextSibling;
              if (elem) {
                console.log(elem);
                // elem.click();
                return true;
              }
            }
            return null;
          });

          if (hasNextPage === null) {
            // console.log(FILEPATH_FOR_SAVE);
            // fs.writeFileSync(
            //   FILEPATH_FOR_SAVE,
            //   JSON.stringify(DATA_FOR_SAVE, null, 2),
            // );
            // fs.writeFileSync(FILEPATH_FULL, JSON.stringify(DATA_FULL, null, 2));
            console.log({ offers, fullData });

            console.log('No more Pages...');

            console.log('Parsing complexes runs in 3 sec...');
            await page.waitForTimeout(1000);

            console.log(
              'Loaded complexes: ' + Object.keys(complexesURLs).length + ' pcs',
            );

            const complexUrls = Object.keys(complexesURLs);
            for (const i of complexUrls) {
              const complexId = complexUrls[i].split('__');
              if (complexId.length === 2) {
                complexId[0] = complexId[1];
                const complex_next_url =
                  'https://perm.domclick.ru/search?deal_type=sale&category=living&offset=0&complex_ids=' +
                  complexId;

                console.log('complex_next_url: ' + complex_next_url);
                await page.waitForTimeout(1000);

                await overviewComplex(complexId, page);
              }
            }

            console.log('Writing in files...');

            // fs.writeFileSync(
            //   FILEPATH_FOR_SAVE,
            //   JSON.stringify(DATA_FOR_SAVE, null, 2),
            // );
            // fs.writeFileSync(FILEPATH_FULL, JSON.stringify(DATA_FULL, null, 2));

            console.log({ offers, fullData });

            // End
            console.log('End...');

            // let json222 = fs.readFileSync(FILEPATH_FULL, 'UTF-8');
            // json222 = JSON.parse(json222);
            // console.log('FILEPATH_FULL length: ' + json222.length);

            break;
          }
        }
      });

    return { message: 'Ok' };
  }
}
