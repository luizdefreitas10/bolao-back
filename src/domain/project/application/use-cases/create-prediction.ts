import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { Prediction } from '../../enterprise/entities/prediction'
import { PredictionRepository } from '../repositories/prediction-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { PredictionExistForThisUserAndMatch } from './errors/prediction-exist-for-this-user-and-match'

interface CreatePredictionUseCaseRequest {
  predictionHome: number
  predictionAway: number
  userId: string
  matchId: string
}

type CreatePredictionUseCaseResponse = Either<
  PredictionExistForThisUserAndMatch,
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
  }: CreatePredictionUseCaseRequest): Promise<CreatePredictionUseCaseResponse> {
    const predictionAlreadyExist =
      await this.predictionRepository.findByUserAndMatch(userId, matchId)

    if (predictionAlreadyExist) {
      return left(new PredictionExistForThisUserAndMatch())
    }

    const prediction = Prediction.create({
      predictionAway,
      predictionHome,
      matchId: new UniqueEntityID(matchId),
      userId: new UniqueEntityID(userId),
    })

    const predictionCreated = await this.predictionRepository.create(prediction)

    return right({
      prediction: predictionCreated,
    })
  }
}
