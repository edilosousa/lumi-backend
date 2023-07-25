// fatura/fatura.controller.ts

import { Controller, Get } from '@nestjs/common';
import { FaturaService } from './fatura.service';
import { Fatura } from './fatura.entity';

@Controller('faturas')
export class FaturaController {
  constructor(private faturaService: FaturaService) {}

  @Get()
  async findAll(): Promise<Fatura[]> {
    return this.faturaService.findAll();
  }
}
