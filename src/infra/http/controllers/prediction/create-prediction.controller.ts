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

const PredictionTypeEnum = z.enum(['SCORE', 'PLAYER'])

const createPredictionBodySchema = z.object({
  matchId: z.string(),
  predictionHome: z
    .number()
    .refine((value) => value >= 0, {
      message: 'O palpite deve ser maior ou igual a 0.',
    })
    .optional(),
  predictionAway: z
    .number()
    .refine((value) => value >= 0, {
      message: 'O palpite deve ser maior ou igual a 0.',
    })
    .optional(),
  predictionType: PredictionTypeEnum,
  playerId: z.string().optional(),
})

const bodyValidationPipe = new ZodValidationPipe(createPredictionBodySchema)

@ApiTags('prediction')
@Controller('/prediction')
export class CreatePredictionController {
  constructor(private createPrediction: CreatePredictionUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(bodyValidationPipe) body: CreatePredictionDto,
    @CurrentUser() user: UserPayload,
  ) {
    const {
      matchId,
      predictionAway,
      predictionHome,
      predictionType,
      playerId,
    } = body
    console.log(user.sub)
    const result = await this.createPrediction.execute({
      predictionAway,
      predictionHome,
      matchId,
      userId: user.sub,
      predictionType,
      playerId,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { prediction } = result.value

    return { predictionId: prediction.id.toString() }
  }
}
