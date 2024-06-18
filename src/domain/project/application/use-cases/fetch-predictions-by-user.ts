import { Either, left, right } from '@/core/either'
import { Injectable, UnprocessableEntityException } from '@nestjs/common'
import { PredictionRepository } from '../repositories/prediction-repository'
import { MatchStatus } from '@prisma/client'

export type PredictionResponse = {
  round?: {
    id?: string
    name?: string
  }
  match?: {
    teamHome?: string
    teamAway?: string
    scoreHome?: number
    scoreAway?: number
    date?: Date
    status?: MatchStatus | null
    lastPlayer?: { name?: string | null } | null
  }
  predictionScore?: {
    predictionHome?: number | null
    predictionAway?: number | null
    status?: 'HIT' | 'MISS' | null
  }
  predictionPlayer?: {
    player?: string
    team?: string
    status?: 'HIT' | 'MISS' | null
  }
}
interface FetchPredicitonByUserUseCaseRequest {
  userId: string
}

type FetchPredicitonByUserUseCaseResponse = Either<
  UnprocessableEntityException,
  {
    predictions: PredictionResponse[]
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
      const predictionsResponse: PredictionResponse[] = []

      for (const item of predictions) {
        const matchAndRound = {
          round: {
            id: item.match?.roundId,
            name: item.match?.round.name,
          },
          match: {
            date: item.match?.date,
            scoreHome: item.match?.scoreHome,
            scoreAway: item.match?.scoreAway,
            teamAway: item.match?.teamAway.name,
            teamHome: item.match?.teamHome.name,
            status: item.match?.status,
            lastPlayer: {
              name: item.match?.lastPlayer?.name,
            },
          },
        }
        const existRound = predictionsResponse.filter(
          (prediction) => prediction.round?.id === item.match?.roundId,
        )
        let statusPredictionScore
        let statusPredictionPlayer
        switch (item.predictionType) {
          case 'SCORE':
            if (
              item.match?.status === 'DONE' &&
              item.match.scoreHome === item.predictionHome &&
              item.match.scoreAway === item.predictionAway
            ) {
              statusPredictionScore = 'HIT'
            } else if (
              item.match?.status === 'DONE' &&
              (item.match.scoreHome !== item.predictionHome ||
                item.match.scoreAway !== item.predictionAway)
            ) {
              statusPredictionScore = 'MISS'
            }
            existRound.length > 0
              ? (existRound[0].predictionScore = {
                  predictionAway: item.predictionAway,
                  predictionHome: item.predictionHome,
                  status: statusPredictionScore,
                })
              : predictionsResponse.push({
                  ...matchAndRound,
                  predictionScore: {
                    predictionAway: item.predictionAway,
                    predictionHome: item.predictionHome,
                    status: statusPredictionScore,
                  },
                })
            break
          case 'PLAYER':
            if (
              item.match?.status === 'DONE' &&
              item.lastPlayerId?.toString() === item.match.lastPlayerId
            ) {
              statusPredictionPlayer = 'HIT'
            } else if (
              item.match?.status === 'DONE' &&
              item.lastPlayerId?.toString() !== item.match.lastPlayerId
            ) {
              statusPredictionPlayer = 'MISS'
            }
            console.log(item.lastPlayer)
            existRound.length > 0
              ? (existRound[0].predictionPlayer = {
                  player: item.lastPlayer?.name,
                  team: item.lastPlayer?.team.name,
                  status: statusPredictionPlayer,
                })
              : predictionsResponse.push({
                  ...matchAndRound,
                  predictionPlayer: {
                    player: item.lastPlayer?.name,
                    team: item.lastPlayer?.team.name,
                    status: statusPredictionPlayer,
                  },
                })
            break
        }
      }

      return right({
        predictions: predictionsResponse,
      })
    } catch (error) {
      return left(new UnprocessableEntityException())
    }
  }
}
