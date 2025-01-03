import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { InfluxdbService } from './influxdb/influxdb.service';
import { CreateLogDto } from './dto/insert.dto';
import { dateFormat } from './utils';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService, private readonly influxdb: InfluxdbService) {}
  async createLogday(message: CreateLogDto) {
    console.log('Received message:', message);
    message.createAt = dateFormat(new Date());
    message.updateAt = dateFormat(new Date());
    const log = await this.prisma.logDays.create({ data: message });
    const fields = {
      temp: log.tempDisplay,
      humidity: log.humidityDisplay,
      plug: log.plug,
      door1: log.door1,
      door2: log.door2,
      door3: log.door3,
      internet: log.internet,
      battery: log.battery,
      tempInternal: log.tempInternal,
      extMemory: log.extMemory
    };
    const tags = { sn: log.serial, probe: log.probe };
    await this.influxdb.writeData("logdays", fields, tags, new Date(message.sendTime));
  }
}
