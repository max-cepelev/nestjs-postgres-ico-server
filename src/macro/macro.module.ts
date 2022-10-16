import { Module } from '@nestjs/common';
import { FetchModule } from 'src/fetch/fetch.module';
import { MacroController } from './macro.controller';
import { MacroService } from './macro.service';

@Module({
  controllers: [MacroController],
  providers: [MacroService],
  imports: [FetchModule],
})
export class MacroModule {}
