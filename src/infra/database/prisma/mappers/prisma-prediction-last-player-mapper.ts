import {
  PredictionLastPlayer as PrismaPredictionLastPlayer,
  Prisma,
} from '@prisma/client'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  PredictionLastPlayer,
  TeamPlayerPredictionProps,
} from '@/domain/project/enterprise/entities/prediction-last-player'

type PredictionLastPlayerProps = PrismaPredictionLastPlayer & {
  player: {
    name: string
    team: TeamPlayerPredictionProps
  }
}

export class PrismaPredictionLastPlayerMapper {
  static toDomainWithPlayer(
    raw: PredictionLastPlayerProps,
  ): PredictionLastPlayer {
    return PredictionLastPlayer.create(
      {
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        status: raw.status,
        roundId: new UniqueEntityID(raw.roundId),
        teamId: new UniqueEntityID(raw.teamId),
        playerId: new UniqueEntityID(raw.playerId),
        userId: new UniqueEntityID(raw.userId),
        player: raw.player,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toDomain(raw: PrismaPredictionLastPlayer): PredictionLastPlayer {
    return PredictionLastPlayer.create(
      {
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        status: raw.status,
        roundId: new UniqueEntityID(raw.roundId),
        teamId: new UniqueEntityID(raw.teamId),
        playerId: new UniqueEntityID(raw.playerId),
        userId: new UniqueEntityID(raw.userId),
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(
    predictionLastPlayer: PredictionLastPlayer,
  ): Prisma.PredictionLastPlayerUncheckedCreateInput {
    return {
      id: predictionLastPlayer.id.toString(),
      createdAt: predictionLastPlayer.createdAt,
      updatedAt: predictionLastPlayer.updatedAt,
      roundId: predictionLastPlayer.roundId.toString(),
      teamId: predictionLastPlayer.teamId.toString(),
      status: predictionLastPlayer.status,
      userId: predictionLastPlayer.userId.toString(),
      playerId: predictionLastPlayer.playerId.toString(),
    }
  }
}
