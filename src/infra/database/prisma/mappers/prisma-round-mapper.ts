import { Round as PrismaRound, Prisma } from '@prisma/client'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Round } from '@/domain/project/enterprise/entities/round'

export class PrismaRoundMapper {
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
