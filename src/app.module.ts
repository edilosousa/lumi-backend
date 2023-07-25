import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Cliente } from './cliente/cliente.entity'
import { ClienteService} from './cliente/cliente.service'
import { ClienteController } from './cliente/cliente.controller'
import { Fatura } from './fatura/fatura.entity'
import { FaturaService } from './fatura/fatura.service'
import { FaturaController } from './fatura/fatura.controller'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true, // Carrega automaticamente as entidades (modelos) do TypeORM
      synchronize: false, // Sincroniza automaticamente o esquema do banco de dados com as entidades (somente para desenvolvimento)
      entities: [Cliente, Fatura],
      logging: true,
      schema: 'dblumi',
    }),
    TypeOrmModule.forFeature([Cliente, Fatura])
  ],
  controllers: [ClienteController, FaturaController],
  providers: [ClienteService, FaturaService],
})
export class AppModule {}

