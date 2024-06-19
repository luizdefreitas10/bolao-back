import { AuthSuccessResponseDto } from './dto/auth-success-response-dto'
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { AuthenticateUserUseCase } from '@/domain/project/application/use-cases/authenticate-user'
import { WrongCredentialsError } from '@/domain/project/application/use-cases/errors/wrong-credentials-error'
import { Public } from '@/infra/auth/public'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { AuthDto } from './dto/auth-dto'

const authenticateBodySchema = z.object({
  phone: z.string(),
  password: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(authenticateBodySchema)

@ApiTags('sessions')
@Controller('/sessions')
@Public()
export class AuthenticateController {
  constructor(private authenticateUser: AuthenticateUserUseCase) {}
  @ApiResponse({
    status: 201,
    type: AuthSuccessResponseDto,
  })
  @Post()
  async handle(@Body(bodyValidationPipe) body: AuthDto) {
    const { phone, password } = body

    const result = await this.authenticateUser.execute({
      phone,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { accessToken, phone: phoneUser, userId } = result.value
    if (accessToken) {
      return {
        access_token: accessToken,
      }
    } else if (phone && userId) {
      return {
        userId,
        phone: phoneUser,
      }
    }
  }
}
