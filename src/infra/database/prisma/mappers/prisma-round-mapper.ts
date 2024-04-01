import { Round as PrismaRound, Prisma, RoundStatus } from '@prisma/client'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Round,
  TeamPropsMatch,
} from '@/domain/project/enterprise/entities/round'
import { Match } from '@/domain/project/enterprise/entities/match'

// id: true,
// scoreAway: true,
// scoreHome: true,
// teamIdAway: true,
// teamIdHome: true,
// roundId: true,
// status: true,
// date: true,
// createdAt: true,
// updatedAt: true,

type RoundProps = PrismaRound & {
  matchs: {
    scoreAway: number
    scoreHome: number
    teamHome: TeamPropsMatch
    teamAway: TeamPropsMatch
    date: Date
    status: RoundStatus
  }[]
}
export class PrismaRoundMapper {
  static toDomainWithRound(raw: RoundProps): Round {
    return Round.create(
      {
        status: raw.status,
        name: raw.name,
        championshipId: new UniqueEntityID(raw.championshipId),
        matchs: raw.matchs,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toDomain(raw: PrismaRound): Round {
    return Round.create(
      {
        status: raw.status,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        name: raw.name,
        championshipId: new UniqueEntityID(raw.championshipId),
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(round: Round): Prisma.RoundUncheckedCreateInput {
    return {
      id: round.id.toString(),
      name: round.name,
      status: round.status,
      createdAt: round.createdAt,
      updatedAt: round.updatedAt,
      championshipId: round.championshipId.toString(),
    }
  }
}
