
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from 'nestjs-http-promise';
import { getMacroDataV1, getMacroDataV2 } from 'src/helpers/transformMacroData';
import { IMacroData } from './entities/macro.data';

const baseUrl = 'https://api.macroserver.ru/estate/export/web/';

@Injectable()
export class MacroService {
  constructor(private httpService: HttpService) {}
  async getGavan() {
    try {
      const params = {
        feed_id: 1131,
      };
      const response = await this.httpService.get<IMacroData[]>(
        `${baseUrl}zdVc0JVaSr1gKxpbtG7AmVbxgLZHBr5Pg_iPhDrnhK0LHDW2uiK3qruU7cxOFuJ6b46vT-P-RWhbzaAbxAvztbgL8dAaYSLpUK44At3rIB5tvLYr9KKPWUqVCjsLh2SmuY8_cpp8MTYzNDU1MTAxMnw5MGE3OQ/334-web.json`,
        { params, timeout: 3000 },
      );
      return getMacroDataV1(response.data);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Произошла ошибка при получении данных',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getTango() {
    try {
      const params = {
        feed_id: 1174,
      };
      const response = await this.httpService.get(
        `${baseUrl}zdVc0JVaSr1gKxpbtG7AmVbxgLZHBr5Pg_iPhDrnhK0LHDW2uiK3qruU7cxOFuJ6b46vT-P-RWhbzaAbxAvztbgL8dAaYSLpUK44At3rIB5tvLYr9KKPWUidCjsLh2SmuY8_cpp8MTYzNTU4OTI3MXxmMzU0Mg/334-web.json`,
        { params },
      );
      return getMacroDataV1(response.data);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Произошла ошибка при получении данных',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getSkvortsy() {
    try {
      const params = {
        feed_id: 1207,
      };
      const response = await this.httpService.get(
        `${baseUrl}zdVc0JVaSr1gKxpbtG7AmVbxgLZHBr5Pg_iPhDrnhK0LHDW2uiK3qruU7cxOFuJ6b46vT-P-RWhbzaAbxAvztbgL8dAaYSLpUK44At3rIB5tvLYr9KKPWUqZCjsKh2SmuY8_cpp8MTYzNjgzMzIwN3w2OGIzMw/334-web.json`,
        { params, timeout: 3000 },
      );
      return getMacroDataV1(response.data);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Произошла ошибка при получении данных',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getPut() {
    try {
      const params = {
        feed_id: 1310,
      };
      const response = await this.httpService.get(
        `${baseUrl}zdVc0JVaSr1gKxpbtG7AmVbxgLZHBr5Pg_iPhDrnhK0LHDW2uiK3qruU7cxOFuJ6b46vT-P-RWhbzaAbxAvztbgL8dAaYSLpUK44At3rIB5tvLYr9KKPWUqcCjoKh2SmuYw_cpp8MTY0MTkwNTkzMXwwMjFiZQ/334-web.json`,
        { params, timeout: 3000 },
      );
      return getMacroDataV1(response.data);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Произошла ошибка при получении данных',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getFamily() {
    try {
      const params = {
        feed_id: 1579,
      };
      const response = await this.httpService.get(
        `https://api.macroserver.ru/estate/export/sdb/H7Whb0yfEyUOMbVk9darbXsfKHjUBwCZe-U0rGZXzBDskXF5bu-sECRBYqaXyKtgZgilcpqgaXiiQVPx9U5I6Hsbq_O30Djw1AKCSdAo9ApwlPx-31ATO2BER2DNp-40qJ-8pUF8MTY1MTIxMjQ4M3w0NTE4MA/507-sdb.json`,
        { params, timeout: 3000 },
      );
      return getMacroDataV2(response.data.records);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Произошла ошибка при получении данных',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
    
    async getVseSvoi() {
    try {
      const params = {
        feed_id: 1664,
      };
      const response = await this.httpService.get(
        `https://api.macroserver.ru/estate/export/web/zdVc0JVaSr1gKxpbtG7AmVbxgLZHBr5Pg_6MhzrnhK0LHDW2uiK3qruU7cxOFuJ6b46vT-P-RWhbzaAbxAvztbgL8dAaYSLpUK44At3rIB5tvLYr9KKPWUmdCjoOh2SmuYw_cpp8MTY1MzAzMzcxM3wzMzdjNg/507-web.json`,
        { params, timeout: 3000 },
      );
      return getMacroDataV2(response.data.records);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Произошла ошибка при получении данных',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
