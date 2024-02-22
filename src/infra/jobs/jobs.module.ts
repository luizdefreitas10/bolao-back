import { MiddlewareBuilder } from '@nestjs/core'
import { Module } from '@nestjs/common'
import { BullModule, InjectQueue } from '@nestjs/bull'

import { SendSmsProducer } from './sms/send-sms-producer'
import { SendSmsConsumer } from './sms/send-sms-consumer'
import { EnvModule } from '../env/env.module'
import { Queue } from 'bull'
import { createBullBoard } from 'bull-board'
import { BullAdapter } from 'bull-board/bullAdapter'
import { EnvService } from '../env/env.service'
import { SendSmsUseCase } from '@/domain/project/application/use-cases/send-sms'

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [EnvModule],
      inject: [EnvService],
      useFactory: (env: EnvService) => ({
        redis: {
          host: env.get('DATABASE_REDIS_URL'),
          port: env.get('DATABASE_REDIS_PORT'),
          username: env.get('DATABASE_REDIS_USERNAME'),
          password: env.get('DATABASE_REDIS_PASSWORD'),
        },
      }),
    }),
    BullModule.registerQueue({
      name: 'send-sms-queue',
    }),
    EnvModule,
  ],
  providers: [SendSmsProducer, SendSmsConsumer, SendSmsUseCase],
  exports: [SendSmsProducer],
})
export class JobsModule {
  constructor(@InjectQueue('send-sms-queue') private smsQueue: Queue) {}

  configure(consumer: MiddlewareBuilder) {
    const { router } = createBullBoard([new BullAdapter(this.smsQueue)])
    consumer.apply(router).forRoutes('/admin/queues')
  }
}
