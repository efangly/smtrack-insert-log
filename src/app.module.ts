import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { InfluxdbModule } from './influxdb/influxdb.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    HealthModule,
    InfluxdbModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
