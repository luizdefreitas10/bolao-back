import { Either, left, right } from '@/core/either'
import { Injectable, UnprocessableEntityException } from '@nestjs/common'
import { PredictionRepository } from '../repositories/prediction-repository'
import { MatchStatus } from '@prisma/client'

export type PredictionResponse = {
  matchId?: string
  round?: {
    id?: string
    name?: string
  }
  match?: {
    teamHome?: { name?: string; logoUrl?: string | null }
    teamAway?: { name?: string; logoUrl?: string | null }
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
    photoUrl?: string | null
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
        const matchId = item.matchId.toString()

        const matchAndRound = {
          matchId,
          round: {
            id: item.match?.roundId,
            name: item.match?.round.name,
          },
          match: {
            date: item.match?.date,
            scoreHome: item.match?.scoreHome,
            scoreAway: item.match?.scoreAway,
            teamAway: {
              name: item.match?.teamAway.name,
              logoUrl: item.match?.teamAway.logoUrl,
            },
            teamHome: {
              name: item.match?.teamHome.name,
              logoUrl: item.match?.teamHome.logoUrl,
            },
            status: item.match?.status,
            lastPlayer: {
              name: item.match?.lastPlayer?.name,
            },
          },
        }

        // Group by matchId (not roundId) so every match gets its own entry
        const existMatch = predictionsResponse.find(
          (p) => p.matchId === matchId,
        )

        let statusPredictionScore: 'HIT' | 'MISS' | undefined
        let statusPredictionPlayer: 'HIT' | 'MISS' | undefined

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

            if (existMatch) {
              existMatch.predictionScore = {
                predictionAway: item.predictionAway,
                predictionHome: item.predictionHome,
                status: statusPredictionScore ?? null,
              }
            } else {
              predictionsResponse.push({
                ...matchAndRound,
                predictionScore: {
                  predictionAway: item.predictionAway,
                  predictionHome: item.predictionHome,
                  status: statusPredictionScore ?? null,
                },
              })
            }
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

            if (existMatch) {
              existMatch.predictionPlayer = {
                player: item.lastPlayer?.name,
                team: item.lastPlayer?.team.name,
                photoUrl: item.lastPlayer?.photoUrl,
                status: statusPredictionPlayer ?? null,
              }
            } else {
              predictionsResponse.push({
                ...matchAndRound,
                predictionPlayer: {
                  player: item.lastPlayer?.name,
                  team: item.lastPlayer?.team.name,
                  photoUrl: item.lastPlayer?.photoUrl,
                  status: statusPredictionPlayer ?? null,
                },
              })
            }
            break
        }
      }

      // Sort by match date descending (most recent first)
      predictionsResponse.sort((a, b) => {
        const dateA = a.match?.date ? new Date(a.match.date).getTime() : 0
        const dateB = b.match?.date ? new Date(b.match.date).getTime() : 0
        return dateB - dateA
      })

      return right({ predictions: predictionsResponse })
    } catch (error) {
      return left(new UnprocessableEntityException())
    }
  }
}
