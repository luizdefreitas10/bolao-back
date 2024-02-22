import { Match as PrismaMatch, Prisma } from '@prisma/client'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Match } from '@/domain/project/enterprise/entities/match'

export class PrismaMatchMapper {
  static toDomain(raw: PrismaMatch): Match {
    return Match.create(
      {
        scoreAway: raw.scoreAway,
        scoreHome: raw.scoreHome,
        roundId: new UniqueEntityID(raw.roundId),
        teamIdAway: new UniqueEntityID(raw.teamIdAway),
        teamIdHome: new UniqueEntityID(raw.teamIdHome),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(match: Match): Prisma.MatchUncheckedCreateInput {
    return {
      id: match.id.toString(),
      scoreAway: match.scoreAway,
      scoreHome: match.scoreHome,
      roundId: match.roundId.toString(),
      teamIdAway: match.teamIdAway.toString(),
      teamIdHome: match.teamIdHome.toString(),
      createdAt: match.createdAt,
      updatedAt: match.updatedAt,
    }
  }
}
