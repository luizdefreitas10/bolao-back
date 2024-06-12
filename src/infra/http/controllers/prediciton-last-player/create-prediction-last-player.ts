import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  ConflictException,
  UnprocessableEntityException,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { ApiTags } from '@nestjs/swagger'
import { CreatePlayerUseCase } from '@/domain/project/application/use-cases/create-player'
import { PlayerAlreadyExistsError } from '@/domain/project/application/use-cases/errors/player-already-exist-error'
import { CurrentUser } from '@/infra/auth/currrent-user.decorator'
import { CreatePredictionLastPlayerDto } from './dto/create-prediction-last-player-dto'
import { CreatePredictionLastPlayerUseCase } from '@/domain/project/application/use-cases/create-prediction-last-player'
import { UserPayload } from '@/infra/auth/jwt.strategy'

const createTeamBodySchema = z.object({
  playerId: z.string(),
  roundId: z.string(),
  teamId: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(createTeamBodySchema)

@ApiTags('prediction-last-player')
@Controller('/prediction-last-player')
export class CreatePredictionLastPlayerController {
  constructor(
    private createPredictionLastPlayerUseCase: CreatePredictionLastPlayerUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(bodyValidationPipe) body: CreatePredictionLastPlayerDto,
    @CurrentUser() user: UserPayload,
  ) {
    const { playerId, roundId, teamId } = body

    const result = await this.createPredictionLastPlayerUseCase.execute({
      playerId,
      teamId,
      roundId,
      userId: user.sub,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case UnprocessableEntityException:
          throw new UnprocessableEntityException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { prediction } = result.value

    return { prediction: prediction.id.toString() }
  }
}
