import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  ConflictException,
  Delete,
  ForbiddenException,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { ApiTags } from '@nestjs/swagger'
import { Roles } from '@/infra/auth/roles.decorator'
import { RemoveRoundDto } from './dto/remove-round-dto'
import { RoundNotFoundError } from '@/domain/project/application/use-cases/errors/round-not-found-error'
import { RemoveRoundUseCase } from '@/domain/project/application/use-cases/remove-round'
import { RoundForbiddenRemoveError } from '@/domain/project/application/use-cases/errors/round-forbidden-remove'

const removeRoundNameBodySchema = z.object({
  roundId: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(removeRoundNameBodySchema)

@ApiTags('round')
@Controller('/round')
export class RemoveRoundController {
  constructor(private removeRound: RemoveRoundUseCase) {}

  @Delete()
  @HttpCode(204)
  @Roles(['ADMIN'])
  async handle(@Body(bodyValidationPipe) body: RemoveRoundDto) {
    const { roundId } = body

    const result = await this.removeRound.execute({
      roundId,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case RoundNotFoundError:
          throw new ConflictException(error.message)
        case RoundForbiddenRemoveError:
          throw new ForbiddenException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
