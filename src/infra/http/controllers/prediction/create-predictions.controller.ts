import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { ApiTags } from '@nestjs/swagger'
import { CreatePredictionDto } from './dto/create-prediction-dto'
import { CreatePredictionUseCase } from '@/domain/project/application/use-cases/create-prediction'
import { CurrentUser } from '@/infra/auth/currrent-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

const createPredictionBodySchema = z.object({
  matchId: z.string(),
  predictionHome: z.number().refine((value) => value >= 0, {
    message: 'O palpite deve ser maior ou igual a 0.',
  }),
  predictionAway: z.number().refine((value) => value >= 0, {
    message: 'O palpite deve ser maior ou igual a 0.',
  }),
  playerId: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(createPredictionBodySchema)

@ApiTags('prediction')
@Controller('/predictions')
export class CreatePredictionController {
  constructor(private createPrediction: CreatePredictionUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(bodyValidationPipe) body: CreatePredictionDto,
    @CurrentUser() user: UserPayload,
  ) {
    const { matchId, predictionAway, predictionHome, playerId } = body
    const resultPredictionScore = await this.createPrediction.execute({
      predictionAway,
      predictionHome,
      matchId,
      userId: user.sub,
      predictionType: 'SCORE',
    })

    if (resultPredictionScore.isLeft()) {
      const error = resultPredictionScore.value
      switch (error.constructor) {
        default:
          throw new BadRequestException(error.message)
      }
    }

    const resultPredictionPlayer = await this.createPrediction.execute({
      playerId,
      matchId,
      userId: user.sub,
      predictionType: 'PLAYER',
    })

    if (resultPredictionPlayer.isLeft()) {
      const error = resultPredictionPlayer.value
      switch (error.constructor) {
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { prediction: predictionScore } = resultPredictionScore.value
    const { prediction: predictionPlayer } = resultPredictionPlayer.value

    return {
      predictionScoreId: predictionScore.id.toString(),
      predictionPlayerId: predictionPlayer.id.toString(),
    }
  }
}
