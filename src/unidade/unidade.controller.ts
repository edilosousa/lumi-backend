// fatura/fatura.controller.ts

import { Controller, Get } from '@nestjs/common';
import { UnidadeService } from './unidade.service';
import { Unidade } from './unidade.entity';

@Controller('unidades')
export class UnidadeController {
  constructor(private unidadeService: UnidadeService) {}

  @Get()
  async findAll(): Promise<Unidade[]> {
    return this.unidadeService.findAll();
  }
}
