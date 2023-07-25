import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tblcliente' })
export class Cliente {
  @PrimaryGeneratedColumn({ name: 'idcliente', type: 'int4' })
  idcliente: number;

  @Column({ name: 'numerocliente', type: 'int8' })
  numerocliente: number;

  @Column({ name: 'nomecliente', type: 'varchar' })
  nomecliente: string;

  @Column({ name: 'statuscliente', type: 'int4' })
  statuscliente: number;
}
