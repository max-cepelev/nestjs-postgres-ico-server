import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from 'nestjs-http-promise';
import transformMacroData from 'src/helpers/transformMacroData';
import { IMacroData } from './entities/macro.data';

const baseUrl = 'https://api.macroserver.ru/estate/export/web/';

@Injectable()
export class MacroService {
  constructor(private httpService: HttpService) {}
  async getGavan() {
    try {
      const response = await this.httpService.get<IMacroData[]>(
        `${baseUrl}zdVc0JVaSr1gKxpbtG7AmVbxgLZHBr5Pg_iPhDrnhK0LHDW2uiK3qruU7cxOFuJ6b46vT-P-RWhbzaAbxAvztbgL8dAaYSLpUK44At3rIB5tvLYr9KKPWUqVCjsLh2SmuY8_cpp8MTYzNDU1MTAxMnw5MGE3OQ/334-web.json?feed_id=1131`,
      );
      return transformMacroData(response.data);
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
      const response = await this.httpService.get(
        `${baseUrl}zdVc0JVaSr1gKxpbtG7AmVbxgLZHBr5Pg_iPhDrnhK0LHDW2uiK3qruU7cxOFuJ6b46vT-P-RWhbzaAbxAvztbgL8dAaYSLpUK44At3rIB5tvLYr9KKPWUidCjsLh2SmuY8_cpp8MTYzNTU4OTI3MXxmMzU0Mg/334-web.json?feed_id=1174`,
      );
      return transformMacroData(response.data);
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
      const response = await this.httpService.get(
        `${baseUrl}zdVc0JVaSr1gKxpbtG7AmVbxgLZHBr5Pg_iPhDrnhK0LHDW2uiK3qruU7cxOFuJ6b46vT-P-RWhbzaAbxAvztbgL8dAaYSLpUK44At3rIB5tvLYr9KKPWUqZCjsKh2SmuY8_cpp8MTYzNjgzMzIwN3w2OGIzMw/334-web.json?feed_id=1207`,
      );
      return transformMacroData(response.data);
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
        { params },
      );
      return transformMacroData(response.data);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Произошла ошибка при получении данных',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
