import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FilesService {
  async createFile(file: any): Promise<string> {
    try {
      const fileExt = path.extname(file.originalname);
      const fileName = uuidv4() + fileExt;
      const filePath = path.resolve(__dirname, '..', 'static');
      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
      }
      fs.writeFileSync(path.join(filePath, fileName), file.buffer);
      return fileName;
    } catch (error) {
      throw new HttpException(
        'Произошла ошибка при записи файла',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async createFiles(files: any[]): Promise<string[]> {
    try {
      const fileNames = [];
      files.forEach((file) => {
        const fileExt = path.extname(file.originalname);
        const fileName = uuidv4() + fileExt;
        const filePath = path.resolve(__dirname, '..', 'static');
        if (!fs.existsSync(filePath)) {
          fs.mkdirSync(filePath, { recursive: true });
        }
        fs.writeFileSync(path.join(filePath, fileName), file.buffer);
        fileNames.push(fileName);
      });
      return fileNames;
    } catch (error) {
      throw new HttpException(
        'Произошла ошибка при записи файлов',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
