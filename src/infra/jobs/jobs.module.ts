import { DynamicModule, Module, Optional } from '@nestjs/common'
import { MiddlewareBuilder } from '@nestjs/core'
import { BullModule, InjectQueue } from '@nestjs/bull'

import { SendSmsProducer } from './sms/send-sms-producer'
import { NoOpSendSmsProducer } from './sms/no-op-send-sms-producer'
import { SendSmsConsumer } from './sms/send-sms-consumer'
import { EnvModule } from '../env/env.module'
import { Queue } from 'bull'
import { createBullBoard } from 'bull-board'
import { BullAdapter } from 'bull-board/bullAdapter'
import { EnvService } from '../env/env.service'
import { SendSmsUseCase } from '@/domain/project/application/use-cases/send-sms'

@Module({})
export class JobsModule {
  static register(): DynamicModule {
    const smsEnabled = process.env.SMS_ENABLED === 'true'

    if (!smsEnabled) {
      return {
        module: JobsModule,
        imports: [EnvModule],
        providers: [
          {
            provide: SendSmsProducer,
            useClass: NoOpSendSmsProducer,
          },
        ],
        exports: [SendSmsProducer],
      }
    }

    return {
      module: JobsModule,
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
    }
  }

  constructor(@Optional() @InjectQueue('send-sms-queue') private smsQueue?: Queue) {}

  configure(consumer: MiddlewareBuilder) {
    if (!this.smsQueue) {
      return
    }

    const { router } = createBullBoard([new BullAdapter(this.smsQueue)])
    consumer.apply(router).forRoutes('/admin/queues')
  }
}
