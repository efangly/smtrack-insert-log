import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { CreateLogDto } from './dto/insert.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @MessagePattern() // Routing key
    async handleMessage(@Payload() message: any, @Ctx() context: RmqContext) {
      await this.appService.createLogday(message as CreateLogDto);
      const channel = context.getChannelRef();
      const originalMsg = context.getMessage();
      channel.ack(originalMsg);
    }
}
