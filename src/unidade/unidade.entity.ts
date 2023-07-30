import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Cliente } from '../cliente/cliente.entity';

@Entity({ name: 'tblunidade' })
export class Unidade {
  @PrimaryGeneratedColumn({ name: 'idunidade', type: 'int4' })
  idunidade: number;

  @Column({ name: 'fkidcliente', type: 'int4' })
  fkidcliente: number;

  @Column({ name: 'numerounidade', type: 'int8' })
  numerounidade: number;

  @Column({ name: 'statusunidade', type: 'int2' })
  statusunidade: number;

  @ManyToOne(() => Cliente, (cliente) => cliente.idcliente)
  @JoinColumn({ name: 'fkidcliente' })
  cliente: Cliente;
}
