import { SendSmsUseCase } from '@/domain/project/application/use-cases/send-sms'
import { EnvService } from '@/infra/env/env.service'
import { Process, Processor } from '@nestjs/bull'
import { Job } from 'bull'

@Processor('send-sms-queue')
class SendSmsConsumer {
  constructor(
    private config: EnvService,
    private sendSmsUsecase: SendSmsUseCase,
  ) {}

  @Process('send-sms-confirmation-job')
  async sendSmsConfirmationJob(job: Job<{ code: string; to: string }>) {
    const { data } = job

    await this.sendSmsUsecase.execute({
      url: this.config.get('DISPARO_PRO_URL'),
      token: this.config.get('DISPARO_PRO_TOKEN'),
      code: data.code,
      phone: data.to,
    })
  }
}

export { SendSmsConsumer }
