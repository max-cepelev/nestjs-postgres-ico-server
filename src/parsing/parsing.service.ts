import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { ComplexesService } from 'src/complexes/complexes.service';
// import { getNumArray } from 'src/helpers/numberArrayGenerator';
import { IApiData } from './entities/domclick-complex-api.entity';
// import { IParsingData } from './entities/parsing.entity';
import { CreateOfferDto } from 'src/offers/dto/create-offer-dto';
import { OffersService } from 'src/offers/offers.service';

@Injectable()
export class ParsingService {
  constructor(
    private complexesService: ComplexesService,
    private offersService: OffersService,
  ) {}

  async getDomclickData(complexId: number) {
    const url = `https://complex-api.domclick.ru/v4/layouts/?complex_id=${complexId}&limit=1000`;
    const browser = await puppeteer.use(StealthPlugin()).launch({
      headless: false,
    });
    const page = await browser.newPage();
    await page.waitForTimeout(1000);
    await page.goto(url, { waitUntil: 'load' });
    await page.content();
    const data: IApiData = await page.evaluate(() => {
      return JSON.parse(document.querySelector('body').innerText);
    });
    browser.close();
    const items: CreateOfferDto[] = [];
    if (data) {
      for (const layout of data.items) {
        const data = layout.offers.reduce((all, offer) => {
          offer &&
            all.push({
              id: offer.id,
              floor: offer.object_info.floor,
              floors: layout.building.floors,
              price: offer.price_info.square_price,
              address: layout.address.name,
              buildingId: layout.building.id,
              building: layout.building.name,
              developer: layout.building.developers[0].name,
              developerId: layout.building.developers[0].id,
              complex: layout.complex.name,
              complexId: layout.complex_id,
              area: layout.object_info.area,
              rooms: layout.object_info.rooms,
              image: `https://img.dmclk.ru${layout.photo[0]}`,
            });
          return all;
        }, []);
        data.length > 0 && items.push(...data);
      }
    }
    return items;
  }

  async startScrapping() {
    const complexes = await this.complexesService.findAll();
    for (const complex of complexes) {
      if (complex.domClickId) {
        const data = await this.getDomclickData(complex.domClickId);
        await this.offersService.bulkCreate(data);
      }
    }
    return { message: 'Процесс запущен' };
  }

  // async scrapComplexes() {
  //   const url =
  //     'https://perm.domclick.ru/search?deal_type=sale&category=living&offer_type=complex&with_domclick_offers=1&aids=42884&from_developer=1&offset=0';
  //   const browser = await puppeteer.use(StealthPlugin()).launch({
  //     headless: true,
  //   });
  //   const page = await browser.newPage();
  //   await page.goto(url, { waitUntil: 'load' });
  //   await page.waitForSelector('[data-test="offers-list__item"]');
  //   const lastPageNum = await page.evaluate(() => {
  //     const page = document.querySelector('[data-test=pagination-last-page]');
  //     return page ? +page.textContent : 1;
  //   });
  //   const allComplexes = [];
  //   const pages = getNumArray(1, lastPageNum - 1, 1);
  //   let offset = 10;
  //   for (const pageNum of pages) {
  //     await page.waitForSelector('.complexSnippet_layout_link');
  //     const complexes = await page.evaluate(() => {
  //       const complexes = [];
  //       const elements = document.querySelectorAll(
  //         '.complexSnippet_layout_link',
  //       );
  //       for (const element of elements) {
  //         const link = element.querySelector('a').getAttribute('href');
  //         const id = parseInt(link.slice(link.indexOf('__') + 2));
  //         const title = element.querySelector('.complexSnippet_complexName');
  //         const address = element.querySelector('.complexSnippet_address_cont');
  //         const comissioningDate = element.querySelector(
  //           '[data-test-id="plannedText"]',
  //         );

  //         complexes.push({
  //           id,
  //           name: title ? title.innerHTML : '',
  //           address: address ? address.innerHTML : '',
  //           comissioningDate: comissioningDate
  //             ? comissioningDate.innerHTML
  //             : 'не задано',
  //         });
  //       }
  //       return complexes;
  //     });
  //     await page.goto(
  //       `https://perm.domclick.ru/search?deal_type=sale&category=living&offer_type=complex&with_domclick_offers=1&sw=57.755155%2C54.911066&ne=58.288525%2C57.547784&aids=42884&from_developer=1&offset=${offset}`,
  //       { waitUntil: 'domcontentloaded' },
  //     );
  //     offset = offset + 10;
  //     allComplexes.push(...complexes);
  //   }
  //   console.log(allComplexes);
  //   browser.close();
  //   return { message: 'ok' };
  // }

  // async startScrap() {
  //   // const complexes = await this.complexesService.findAll();
  //   // return complexes;
  //   const parsingData = [];
  //   const url =
  //     'https://perm.domclick.ru/search?deal_type=sale&category=living&offset=0&complex_ids=114157&from_developer=1';
  //   const browser = await puppeteer.use(StealthPlugin()).launch({
  //     headless: false,
  //   });
  //   const page = await browser.newPage();
  //   await page.goto(url, { waitUntil: 'load' });
  //   await page.waitForSelector('[data-test="offers-list__item"]');
  //   const lastPageNum = await page.evaluate(() => {
  //     const page = document.querySelector('[data-test=pagination-last-page]');
  //     return page ? +page.textContent : 1;
  //   });
  //   const pageData = await page.evaluate(() => {
  //     const data = window['__data'];
  //     return data.search.itemsClean as IParsingData[];
  //   });
  //   const convertData = pageData.map((item) => ({
  //     id: item.id,
  //     floors: item.house.floors,
  //     address: item.address.short_display_name,
  //     price: item.price_info.square_price,
  //     layoutUrl: `https://perm.domclick.ru/complexes/${item.complex.slug}/layouts/${item.layout_id}`,
  //     buildingId: item.complex.building.id,
  //     building: item.complex.building.name,
  //     developer: item.developer.name,
  //     developerId: item.developer.id,
  //     complex: item.complex.name,
  //     complexId: item.complex.id,
  //     area: item.object_info.area,
  //     minFloor: item.object_info.min_floor,
  //     maxFloor: item.object_info.max_floor,
  //     rooms: item.object_info.rooms,
  //     complexUrl: 'https://perm.domclick.ru/complexes/' + item.slug,
  //   }));
  //   browser.close();
  //   return convertData;
  // }
}
