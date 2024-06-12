import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import {
  Player,
  PlayerProps,
} from '@/domain/project/enterprise/entities/player'
import { PrismaPlayerMapper } from '@/infra/database/prisma/mappers/prisma-player-mapper'

export function makePlayer(
  override: Partial<PlayerProps> = {},
  id?: UniqueEntityID,
) {
  const player = Player.create(
    {
      name: 'Time 1',
      status: 'ACTIVE',
      teamId: new UniqueEntityID('1'),
      roundId: new UniqueEntityID('1'),
      ...override,
    },
    id,
  )

  return player
}

@Injectable()
export class PlayerFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaPlayer(data: Partial<PlayerProps> = {}): Promise<Player> {
    const player = makePlayer(data)

    await this.prisma.player.create({
      data: PrismaPlayerMapper.toPrisma(player),
    })

    return player
  }
}
