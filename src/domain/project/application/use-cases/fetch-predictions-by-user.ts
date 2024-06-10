import { Either, left, right } from '@/core/either'
import { Injectable, UnprocessableEntityException } from '@nestjs/common'
import { PredictionRepository } from '../repositories/prediction-repository'
import { Prediction } from '../../enterprise/entities/prediction'

interface FetchPredicitonByUserUseCaseRequest {
  userId: string
}

type FetchPredicitonByUserUseCaseResponse = Either<
  UnprocessableEntityException,
  {
    predictions: Prediction[]
  }
>

@Injectable()
export class FetchPredicitonByUserUseCase {
  constructor(private predictionRepository: PredictionRepository) {}

  async execute({
    userId,
  }: FetchPredicitonByUserUseCaseRequest): Promise<FetchPredicitonByUserUseCaseResponse> {
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
