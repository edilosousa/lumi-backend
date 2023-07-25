import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tblcliente' })
export class Cliente {
  @PrimaryGeneratedColumn()
  idcliente: number;

  @Column()
  numerocliente: number;

  @Column()
  nomecliente: string;

  @Column()
  statuscliente: number;
}
