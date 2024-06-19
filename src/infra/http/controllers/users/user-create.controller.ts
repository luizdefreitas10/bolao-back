import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'

import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { RegisterUserUseCase } from '@/domain/project/application/use-cases/register-user'
import { UserAlreadyExistsError } from '@/domain/project/application/use-cases/errors/user-already-exists-error'
import { Public } from '@/infra/auth/public'
import { createAccountBodySchema } from './schemaCreateAccount'
import { SendSmsProducer } from '@/infra/jobs/sms/send-sms-producer'
import { UserPhoneAlreadyExistsError } from '@/domain/project/application/use-cases/errors/user-phone-already-exists-error'
import { ApiTags, ApiResponse } from '@nestjs/swagger'
import { CreateUserDto } from './dto/user-create-dto'
import { CreateUserSuccessResponseDto } from './dto/user-create-success-response-dto'
import { SendSmsUseCase } from '@/domain/project/application/use-cases/send-sms'
import { EnvService } from '@/infra/env/env.service'
import { FormatUsernameNotValidError } from '@/domain/project/application/use-cases/errors/format-username-not-valid'

@ApiTags('accounts')
@Controller('/accounts')
@Public()
export class CreateAccountController {
  constructor(
    private registerUser: RegisterUserUseCase,
    private sendSms: SendSmsProducer,
  ) {}

  @ApiResponse({
    status: 201,
    type: CreateUserSuccessResponseDto,
  })
  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateUserDto) {
    const { fullName, birthdate, phone, password, email } = body

    const result = await this.registerUser.execute({
      fullName,
      birthdate,
      phone,
      password,
      email,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case UserAlreadyExistsError:
          throw new ConflictException(error.message)
        case FormatUsernameNotValidError:
          throw new BadRequestException(error.message)
        case UserPhoneAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { user, verificationCode } = result.value
    if (verificationCode && user.phone) {
      await this.sendSms.sendSmsConfirmation(verificationCode, user.phone)
      // await this.sendSmsUsecase.execute({
      //   url: this.envService.get('DISPARO_PRO_URL'),
      //   token: this.envService.get('DISPARO_PRO_TOKEN'),
      //   code: verificationCode,
      //   phone: user.phone,
      // })
    }
    return { userId: user.id.toString() }
  }
}
