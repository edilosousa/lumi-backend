import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from './cliente.entity';

@Injectable()
export class ClienteService {
  private readonly logger = new Logger(ClienteService.name);

  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
  ) {}

  async findAll(): Promise<Cliente[]> {
    const clientes = await this.clienteRepository.find({
      select: ['idcliente', 'nomecliente', 'numerocliente', 'statuscliente'],
    });

    if (!clientes || clientes.length === 0) {
      this.logger.warn('Nenhum cliente encontrado.');
    }

    return clientes;
  }

  
}
