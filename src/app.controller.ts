import { Controller, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { CreateLogDto } from './dto/insert.dto';
import { CreateHistoryDto } from './dto/history.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }
  private readonly logger = new Logger(AppController.name);

  @EventPattern('logday')
  async handleMessage(@Payload() data: CreateLogDto, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    try {
      await this.appService.createLogday(data);
      channel.ack(message);
    } catch (error) {
      this.logger.error(error);
      channel.nack(message, false, false);
    }
  }

  @EventPattern('history')
  async handleHistory(@Payload() data: CreateHistoryDto, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    try {
      await this.appService.createHistory(data);
      channel.ack(message);
    } catch (error) {
      this.logger.error(error);
      channel.nack(message, false, false);
    }
  }
}
