import { Injectable } from '@nestjs/common'

@Injectable()
export class NoOpSendSmsProducer {
  async sendSmsConfirmation(_code: string, _to: string) {
    return
  }
}
