import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { Fatura } from './src/fatura/fatura.entity';
import { $npmConfigName1690821363833 } from './migrations/1690821363833-$npm_config_name'
 
config();
 
const configService = new ConfigService();
 
export default new DataSource({
  type: 'postgres',
  url: configService.get('DB_URL'),
  entities: [Fatura],
  migrations: [$npmConfigName1690821363833]
});