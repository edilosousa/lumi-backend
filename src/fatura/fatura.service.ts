// fatura/fatura.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Fatura } from './fatura.entity';

@Injectable()
export class FaturaService {
  constructor(
    @InjectRepository(Fatura)
    private faturaRepository: Repository<Fatura>,
  ) {}

  private formatarValorEnergia(valor: number): string {
    return (valor / 100).toFixed(2).replace('.', ',');
  }

  private formatarValorEnergia2(valor: number): string {
    return (valor / 100).toFixed(10).replace('.', ',');
  }

  private formatarPrecoEnergia(valor: number): string {
    return (valor / 100000000).toFixed(8).replace('.', ',');
  }

  async findAll(): Promise<Fatura[]> {
    const faturas = await this.faturaRepository.find({ 
      // relations: ['cliente'],
      select: [
        'idfatura',
        'uccliente',
        'mesfatura',
        'datavencimentofatura',
        'valorenergiaeletricafatura',
        'qtdkwhenergiaeletricafatura',
        'precounitenergiaeletricafatura',
        'valorenergiainjetadafatura',
        'qtdkwhenergiainjetadafatura',
        'precounitenergiainjetadafatura',
        'valorenergiacompensadafatura',
        'qtdkwhenergiacompensadafatura',
        'precounitenergiacompensadafatura',
        'valoriluminacaopublicafatura',
        'valortotalfatura'
      ],
    });
    // Formatando os valores de energia elétrica
    faturas.forEach((fatura) => {
      fatura.valorenergiaeletricafaturaFormatado  = this.formatarValorEnergia(fatura.valorenergiaeletricafatura);
      fatura.valorenergiainjetadafaturaFormatado= this.formatarValorEnergia2(fatura.valorenergiainjetadafatura);
      // fatura.valorenergiacompensadafaturaFormatado = this.formatarValorEnergia(fatura.valorenergiacompensadafatura);
      // fatura.valoriluminacaopublicafaturaFormatado = this.formatarValorEnergia(fatura.valoriluminacaopublicafatura);
      // fatura.valortotalfaturaFormatado = this.formatarValorEnergia(fatura.valortotalfatura);
      // fatura.precoenergiaeletricafaturaFormatado = this.formatarPrecoEnergia(fatura.precounitenergiaeletricafatura);
      // fatura.precoenergiainjetadafaturaFormatado = this.formatarPrecoEnergia(fatura.precounitenergiainjetadafatura);
      // fatura.precoenergiacompensadafaturaFormatado = this.formatarPrecoEnergia(fatura.precounitenergiacompensadafatura);
    });

    return faturas;
  }

  async create(fatura: Fatura): Promise<Fatura> {
    return this.faturaRepository.save(fatura);
  }
}
