import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PrismaService } from './prisma/prisma.service';
import { InfluxdbService } from './influxdb/influxdb.service';
import { CreateLogDto } from './dto/insert.dto';
import { dateFormat } from './utils';

@Injectable()
export class AppService {
  constructor(
    @Inject('RABBITMQ_SERVICE') private readonly log: ClientProxy,
    private readonly prisma: PrismaService, 
    private readonly influxdb: InfluxdbService
  ) {}
  async createLogday(message: CreateLogDto) {
    message.createAt = dateFormat(new Date());
    message.updateAt = dateFormat(new Date());
    const log = await this.prisma.logDays.create({ data: message, include: { device: true } });
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
    const tags = { static: log.device.staticName, sn: log.serial, probe: log.probe };
    await this.influxdb.writeData("logdays", fields, tags, new Date(message.sendTime));
    this.log.emit('logday-backup', {
      serial: log.serial,
      staticName: log.device.staticName,
      temp: log.temp,
      tempDisplay: log.tempDisplay,
      humidity: log.humidity,
      humidityDisplay: log.humidityDisplay,
      sendTime: log.sendTime,
      plug: log.plug,
      door1: log.door1,
      door2: log.door2,
      door3: log.door3,
      internet: log.internet,
      probe: log.probe,
      battery: log.battery,
      tempInternal: log.tempInternal,
      extMemory: log.extMemory,
      createAt: log.createAt,
      updateAt: log.updateAt
    });
  }
}
