// fatura/fatura.entity.ts

import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Cliente } from '../cliente/cliente.entity';

@Entity({ name: 'tblfatura' })
export class Fatura {
  @PrimaryGeneratedColumn({ name: 'idfatura', type: 'int4' })
  idfatura: number;

  @Column({ name: 'uccliente', type: 'bigint' })
  uccliente: number;

  @Column({ name: 'mesfatura', type: 'varchar' })
  mesfatura: string;

  @Column({ name: 'datavencimentofatura', type: 'date' })
  datavencimentofatura: Date;
  
  @Column({ name: 'valorenergiaeletricafatura', type: 'decimal' })
  valorenergiaeletricafatura: number;

  @Column({ name: 'qtdkwhenergiaeletricafatura', type: 'int4' })
  qtdkwhenergiaeletricafatura: number;

  @Column({ name: 'precounitenergiaeletricafatura', type: 'decimal' })
  precounitenergiaeletricafatura: number;

  @Column({ name: 'valorenergiainjetadafatura', type: 'decimal' })
  valorenergiainjetadafatura: number;

  @Column({ name: 'qtdkwhenergiainjetadafatura', type: 'int4' })
  qtdkwhenergiainjetadafatura: number;

  @Column({ name: 'precounitenergiainjetadafatura', type: 'decimal' })
  precounitenergiainjetadafatura: number;

  @Column({ name: 'valorenergiacompensadafatura', type: 'decimal' })
  valorenergiacompensadafatura: number;

  @Column({ name: 'qtdkwhenergiacompensadafatura', type: 'int4' })
  qtdkwhenergiacompensadafatura: number;

  @Column({ name: 'precounitenergiacompensadafatura', type: 'decimal' })
  precounitenergiacompensadafatura: number;

  @Column({ name: 'valoriluminacaopublicafatura', type: 'decimal' })
  valoriluminacaopublicafatura: number;

  @Column({ name: 'valortotalfatura', type: 'decimal' })
  valortotalfatura: number;

  valorenergiaeletricafaturaFormatado: string;
  valorenergiainjetadafaturaFormatado: string;
  valorenergiacompensadafaturaFormatado: string;
  valoriluminacaopublicafaturaFormatado: string;
  valortotalfaturaFormatado: string;
  precoenergiaeletricafaturaFormatado: string;
  precoenergiainjetadafaturaFormatado: string;
  precoenergiacompensadafaturaFormatado: string;

  // @ManyToOne(() => Cliente, (cliente) => cliente.idcliente)
  // @JoinColumn({ name: 'fkidcliente' })
  // cliente: Cliente;
}
