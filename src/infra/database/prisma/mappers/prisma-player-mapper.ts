import { Player as PrismaPlayer, Prisma } from '@prisma/client'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Player } from '@/domain/project/enterprise/entities/player'

export class PrismaPlayerMapper {
  static toDomain(raw: PrismaPlayer): Player {
    return Player.create(
      {
        name: raw.name,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        status: raw.status,
        roundId: new UniqueEntityID(raw.roundId),
        teamId: new UniqueEntityID(raw.teamId),
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(player: Player): Prisma.PlayerUncheckedCreateInput {
    return {
      id: player.id.toString(),
      name: player.name,
      createdAt: player.createdAt,
      updatedAt: player.updatedAt,
      roundId: player.roundId.toString(),
      teamId: player.teamId.toString(),
      status: player.status,
    }
  }
}
