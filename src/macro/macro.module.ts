import { Module } from '@nestjs/common';
import { HttpModule } from 'nestjs-http-promise';
import { MacroController } from './macro.controller';
import { MacroService } from './macro.service';

@Module({
  controllers: [MacroController],
  providers: [MacroService],
  imports: [
    HttpModule.register({
      timeout: 1000,
      retries: 5,
    }),
  ],
})
export class MacroModule {}
