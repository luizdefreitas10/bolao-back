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
import { UserModificatedPasswordTodayError } from '@/domain/project/application/use-cases/errors/user-moficated-password-today-error'
import { ResetPasswordDto } from './dto/reset-password-dto'
import { VerificationCodeResetPasswordUseCase } from '@/domain/project/application/use-cases/validation-verification-code-reset-password'
import { CodeExpiredError } from '@/domain/project/application/use-cases/errors/code-expired-error'
import { CodeNotRegistredError } from '@/domain/project/application/use-cases/errors/code-not-found-error'

const verificationCodeBodySchema = z.object({
  code: z.string(),
  newPassword: z.string(),
  userId: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(verificationCodeBodySchema)

@ApiTags('reset-password')
@Controller('/reset-password')
@Public()
export class ResetPasswordController {
  constructor(private resetPassword: VerificationCodeResetPasswordUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(@Body(bodyValidationPipe) body: ResetPasswordDto) {
    const { code, newPassword, userId } = body

    const result = await this.resetPassword.execute({
      code,
      newPassword,
      userId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case UserModificatedPasswordTodayError:
          throw new UnauthorizedException(error.message)
        case CodeExpiredError:
          throw new UnauthorizedException(error.message)
        case CodeNotRegistredError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
