import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { WrongCredentialsError } from '@/domain/project/application/use-cases/errors/wrong-credentials-error'
import { Public } from '@/infra/auth/public'
import { ApiTags } from '@nestjs/swagger'
import { ResendVerificationCodeUseCase } from '@/domain/project/application/use-cases/resend-verification-code'
import { ResendVerificationCodeDto } from './dto/resend-verification-code-dto'
import { FileResendNotAllowedInTimeError } from '@/domain/project/application/use-cases/errors/code-limit-error'
import { UserAlreadyVerifiedError } from '@/domain/project/application/use-cases/errors/user-already-verified-error'
import { SendSmsProducer } from '@/infra/jobs/sms/send-sms-producer'

const verificationCodeBodySchema = z.object({
  userId: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(verificationCodeBodySchema)

@ApiTags('verification-code')
@Controller('/resend-code')
@Public()
export class ResendVerificationCodeController {
  constructor(
    private resendCode: ResendVerificationCodeUseCase,
    private sendSms: SendSmsProducer,
  ) {}

  @Post()
  @HttpCode(201)
  async handle(@Body(bodyValidationPipe) body: ResendVerificationCodeDto) {
    const { userId } = body

    const result = await this.resendCode.execute({ userId })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case FileResendNotAllowedInTimeError:
          throw new UnauthorizedException(error.message)
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message)
        case UserAlreadyVerifiedError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
    const { code, phone } = result.value
    if (code && userId) {
      // await this.sendSmsUsecase.execute({
      //   url: this.envService.get('DISPARO_PRO_URL'),
      //   token: this.envService.get('DISPARO_PRO_TOKEN'),
      //   code,
      //   phone,
      // })
      await this.sendSms.sendSmsConfirmation(code, phone)
    }
  }
}
