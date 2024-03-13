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
import { RemoveMatchDto } from './dto/remove-Match-dto'
import { MatchNotFoundError } from '@/domain/project/application/use-cases/errors/match-not-found-error'
import { RemoveMatchUseCase } from '@/domain/project/application/use-cases/remove-match'
import { MatchForbiddenRemoveError } from '@/domain/project/application/use-cases/errors/match-forbidden-error'

const removeMatchBodySchema = z.object({
  matchId: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(removeMatchBodySchema)

@ApiTags('match')
@Controller('/match')
export class RemoveMatchController {
  constructor(private removeMatch: RemoveMatchUseCase) {}

  @Delete()
  @HttpCode(204)
  @Roles(['ADMIN'])
  async handle(@Body(bodyValidationPipe) body: RemoveMatchDto) {
    const { matchId } = body

    const result = await this.removeMatch.execute({
      matchId,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case MatchNotFoundError:
          throw new ConflictException(error.message)
        case MatchForbiddenRemoveError:
          throw new ForbiddenException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
