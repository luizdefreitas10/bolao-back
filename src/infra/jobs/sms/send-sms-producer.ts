import { InjectQueue } from '@nestjs/bull'
import { Injectable } from '@nestjs/common'
import { Queue } from 'bull'

@Injectable()
class SendSmsProducer {
  constructor(@InjectQueue('send-sms-queue') private smsQueue: Queue) {}

  async sendSmsConfirmation(code: string, to: string) {
    this.smsQueue.add('send-sms-confirmation-job', {
      code,
      to,
    })
  }
}

export { SendSmsProducer }
