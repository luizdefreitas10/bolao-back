import { VerificationCodeSuccessResponseDto } from './dto/verification-code-success-response'
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { Public } from '@/infra/auth/public'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { VerificationCodeDto } from './dto/verification-code-dto'
import { VerificationCodeUseCase } from '@/domain/project/application/use-cases/validate-verification-code'
import { CodeExpiredError } from '@/domain/project/application/use-cases/errors/code-expired-error'
import { CodeNotRegistredError } from '@/domain/project/application/use-cases/errors/code-not-found-error'
import { UserAlreadyVerifiedError } from '@/domain/project/application/use-cases/errors/user-already-verified-error'

const verificationCodeBodySchema = z.object({
  userId: z.string(),
  code: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(verificationCodeBodySchema)

@ApiTags('verification-code')
@Controller('/validate-code')
@Public()
export class VerificationCodeController {
  constructor(private verificationCode: VerificationCodeUseCase) {}
  @ApiResponse({
    status: 201,
    type: VerificationCodeSuccessResponseDto,
  })
  @Post()
  async handle(@Body(bodyValidationPipe) body: VerificationCodeDto) {
    const { userId, code } = body

    const result = await this.verificationCode.execute({ code, userId })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case UserAlreadyVerifiedError:
          throw new UnauthorizedException(error.message)
        case CodeExpiredError:
          throw new UnauthorizedException(error.message)
        case CodeNotRegistredError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { accessToken } = result.value

    return {
      access_token: accessToken,
    }
  }
}
