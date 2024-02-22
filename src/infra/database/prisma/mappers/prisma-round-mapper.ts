import { Round as PrismaRound, Prisma } from '@prisma/client'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Round } from '@/domain/project/enterprise/entities/round'

export class PrismaRoundMapper {
  static toDomain(raw: PrismaRound): Round {
    return Round.create(
      {
        date: raw.date,
        status: raw.status,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        name: raw.name,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(round: Round): Prisma.RoundUncheckedCreateInput {
    return {
      id: round.id.toString(),
      name: round.name,
      date: round.date,
      status: round.status,
      createdAt: round.createdAt,
      updatedAt: round.updatedAt,
    }
  }
}
