import { TypeOrmModuleOptions, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const getDatabaseConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get('DB_HOST', 'localhost'),
  port: configService.get('DB_PORT', 5432),
  username: configService.get('DB_USERNAME', 'postgres'),
  password: configService.get('DB_PASSWORD', 'postgres'),
  database: configService.get('DB_NAME', 'ecommerce'),
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: configService.get('NODE_ENV') !== 'production',
});

export const databaseAsyncConfig: TypeOrmModuleAsyncOptions = {
  useFactory: async (configService: ConfigService): Promise<TypeOrmModuleOptions> => 
    getDatabaseConfig(configService),
  inject: [ConfigService],
};