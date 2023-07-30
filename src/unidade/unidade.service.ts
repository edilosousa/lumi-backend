// fatura/fatura.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Unidade } from './unidade.entity';

@Injectable()
export class UnidadeService {
  constructor(
    @InjectRepository(Unidade)
    private unidadeRepository: Repository<Unidade>,
  ) {}

  async findAll(): Promise<Unidade[]> {
    return await this.unidadeRepository.find({ 
      relations: ['cliente'],
      select: [
        'idunidade',
        'fkidcliente',
        'numerounidade',
        'statusunidade'
      ],
    });
  }
}
