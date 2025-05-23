import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { HealthModule } from './health/health.module';

async function bootstrap() {
  const app = await NestFactory.create(HealthModule);
  const microservice = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ],
      queue: 'log_queue',
      queueOptions: { durable: true },
      noAck: false,
      prefetchCount: 1
    },
  });
  await microservice.listen();
  await app.listen(3000);
}
bootstrap();