import { Either, left, right } from '@/core/either'
import { Injectable, UnprocessableEntityException } from '@nestjs/common'
import { Prediction } from '../../enterprise/entities/prediction'
import { PredictionRepository } from '../repositories/prediction-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { PredictionExistForThisUserAndMatch } from './errors/prediction-exist-for-this-user-and-match'
import { PredictionType } from '@prisma/client'
import { IncompatiblePrediction } from './errors/incompatible-prediction-error'

// matchId: z.string(),
// predictionHome: z
//   .number()
//   .refine((value) => value >= 0, {
//     message: 'O palpite deve ser maior ou igual a 0.',
//   })
//   .optional(),
// predictionAway: z
//   .number()
//   .refine((value) => value >= 0, {
//     message: 'O palpite deve ser maior ou igual a 0.',
//   })
//   .optional(),
// predictionType: PredictionTypeEnum,
// playerId: z.string().optional(),

interface CreatePredictionUseCaseRequest {
  predictionHome?: number
  predictionAway?: number
  userId: string
  matchId: string
  predictionType: PredictionType
  playerId?: string
}

type CreatePredictionUseCaseResponse = Either<
  PredictionExistForThisUserAndMatch | IncompatiblePrediction,
  {
    prediction: Prediction
  }
>

@Injectable()
export class CreatePredictionUseCase {
  constructor(private predictionRepository: PredictionRepository) {}

  async execute({
    predictionAway,
    predictionHome,
    matchId,
    userId,
    predictionType,
    playerId,
  }: CreatePredictionUseCaseRequest): Promise<CreatePredictionUseCaseResponse> {
    const predictionAlreadyExist =
      await this.predictionRepository.findByUserAndMatchAndType(
        userId,
        matchId,
        predictionType,
      )

    if (predictionAway !== undefined && predictionType === 'PLAYER') {
      return left(new IncompatiblePrediction())
    }

    if (playerId && predictionType === 'SCORE') {
      return left(new IncompatiblePrediction())
    }

    if (predictionAlreadyExist) {
      if (predictionType === 'PLAYER' && playerId) {
        const newPrediction = await this.predictionRepository.updatePlayer(
          predictionAlreadyExist?.id.toString(),
          playerId,
        )
        if (!newPrediction) {
          return left(new UnprocessableEntityException())
        }
        return right({
          prediction: newPrediction,
        })
      } else if (
        predictionType === 'SCORE' &&
        predictionAway &&
        predictionHome
      ) {
        const newPrediction = await this.predictionRepository.updateScore(
          predictionAlreadyExist.id.toString(),
          predictionHome,
          predictionAway,
        )
        if (!newPrediction) {
          return left(new UnprocessableEntityException())
        }
        return right({
          prediction: newPrediction,
        })
      }
    }

    const prediction = Prediction.create({
      predictionAway,
      predictionHome,
      matchId: new UniqueEntityID(matchId),
      userId: new UniqueEntityID(userId),
      predictionType,
      lastPlayerId: playerId ? new UniqueEntityID(playerId) : null,
    })

    const predictionCreated = await this.predictionRepository.create(prediction)

    return right({
      prediction: predictionCreated,
    })
  }
}
