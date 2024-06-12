import { Either, left, right } from '@/core/either'
import { Injectable, UnprocessableEntityException } from '@nestjs/common'
import { PredictionLastPlayerRepository } from '../repositories/prediction-last-player-repository'
import { PredictionLastPlayer } from '../../enterprise/entities/prediction-last-player'

interface FetchPredictionLastPlayerByUserUseCaseRequest {
  userId: string
}

type FetchPredictionLastPlayerByUserUseCaseResponse = Either<
  UnprocessableEntityException,
  {
    predictions: PredictionLastPlayer[]
  }
>

@Injectable()
export class FetchPredictionLastPlayerByUserUseCase {
  constructor(private predictionRepository: PredictionLastPlayerRepository) {}

  async execute({
    userId,
  }: FetchPredictionLastPlayerByUserUseCaseRequest): Promise<FetchPredictionLastPlayerByUserUseCaseResponse> {
    try {
      const predictions = await this.predictionRepository.findByUser(userId)

      return right({
        predictions,
      })
    } catch (error) {
      return left(new UnprocessableEntityException())
    }
  }
}
