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
import { Public } from '@/infra/auth/public'
import { ApiTags } from '@nestjs/swagger'
import { FileResendNotAllowedInTimeError } from '@/domain/project/application/use-cases/errors/code-limit-error'
import { SendSmsProducer } from '@/infra/jobs/sms/send-sms-producer'
import { SendVerificationCodeResetPasswordUseCase } from '@/domain/project/application/use-cases/send-verification-code-reset-password'
import { SendVerificationResetPasswordCodeDto } from './dto/send-code-reset-password-dto'
import { UserModificatedPasswordTodayError } from '@/domain/project/application/use-cases/errors/user-moficated-password-today-error'
import { UserNotFoundError } from '@/domain/project/application/use-cases/errors/user-not-found-error'

const verificationCodeBodySchema = z.object({
  phone: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(verificationCodeBodySchema)

@ApiTags('reset-password')
@Controller('/send-code-reset-password')
@Public()
export class SendCodeResetPasswordController {
  constructor(
    private sendCode: SendVerificationCodeResetPasswordUseCase,
    private sendSms: SendSmsProducer,
  ) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(bodyValidationPipe) body: SendVerificationResetPasswordCodeDto,
  ) {
    const { phone } = body

    const result = await this.sendCode.execute({ phone })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case FileResendNotAllowedInTimeError:
          throw new UnauthorizedException(error.message)
        case UserModificatedPasswordTodayError:
          throw new UnauthorizedException(error.message)
        case UserNotFoundError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
    const { code, userId } = result.value
    if (code) {
      await this.sendSms.sendSmsConfirmation(code, phone)
    }
    return { userId }
  }
}
