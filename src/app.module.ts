import { Module } from '@nestjs/common';
import { ApplicationModule } from './application/application.module';
import { AdaptersModule } from './adapters/adapters.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { FilterExceptionGlobal } from './system/filtros/filter-exception-global';
import { PostgresConfigService } from './system/config/postgres.config.service';

@Module({
  imports: [
    ApplicationModule,
    AdaptersModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: PostgresConfigService,
      inject: [PostgresConfigService],
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: FilterExceptionGlobal,
    },
  ],
})
export class AppModule {}
