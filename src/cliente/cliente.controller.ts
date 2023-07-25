import { Controller, Get } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { Cliente } from './cliente.entity';

@Controller('clientes')
export class ClienteController {
  constructor(private clienteService: ClienteService) {}

  @Get()
  async findAll(): Promise<Cliente[]> {
    return this.clienteService.findAll();
  }
}
