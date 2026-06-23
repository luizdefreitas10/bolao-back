import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Put,
  ConflictException,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { ApiTags } from '@nestjs/swagger'
import { UpdateScoreDto } from './dto/update-score-dto'
import { Roles } from '@/infra/auth/roles.decorator'
import { UpdateScoreUseCase } from '@/domain/project/application/use-cases/update-score-match'
import { MatchNotFoundError } from '@/domain/project/application/use-cases/errors/match-not-found-error'
import { MatchNotInProgressError } from '@/domain/project/application/use-cases/errors/match-not-in-progress-error'

const updateScoreBodySchema = z.object({
  matchId: z.string(),
  scoreHome: z.number().refine((value) => value >= 0, {
    message: 'O placar deve ser maior ou igual a 0.',
  }),
  scoreAway: z.number().refine((value) => value >= 0, {
    message: 'O placar deve ser maior ou igual a 0.',
  }),
  lastPlayerId: z.string().optional(),
})

const bodyValidationPipe = new ZodValidationPipe(updateScoreBodySchema)

@ApiTags('match')
@Controller('/match')
export class UpdateScoreController {
  constructor(private updateScore: UpdateScoreUseCase) {}

  @Put()
  @HttpCode(201)
  @Roles(['ADMIN'])
  async handle(@Body(bodyValidationPipe) body: UpdateScoreDto) {
    const { matchId, scoreAway, scoreHome, lastPlayerId } = body

    const result = await this.updateScore.execute({
      matchId,
      scoreHome,
      scoreAway,
      lastPlayerId,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case MatchNotFoundError:
          throw new BadRequestException(error.message)
        case MatchNotInProgressError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
