import { Controller, Get } from '@nestjs/common';
import { MacroService } from './macro.service';

@Controller('macro')
export class MacroController {
  constructor(private readonly macroService: MacroService) {}

  @Get('gavan')
  getGavan() {
    return this.macroService.getGavan();
  }

  @Get('tango')
  getTango() {
    return this.macroService.getTango();
  }

  @Get('skvortsy')
  getSkvortsy() {
    return this.macroService.getSkvortsy();
  }

  @Get('put')
  getPut() {
    return this.macroService.getPut();
  }
  
  @Get('family')
  getfamily() {
    return this.macroService.getFamily();
  }
  
  @Get('vse-svoi')
  getfamily() {
    return this.macroService.getVseSvoi();
  }
}
