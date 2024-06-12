import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PlayerRepository } from '@/domain/project/application/repositories/player-repository'
import { PrismaPlayerMapper } from '../mappers/prisma-player-mapper'
import { Player } from '@/domain/project/enterprise/entities/player'

@Injectable()
export class PrismaPlayerRepository implements PlayerRepository {
  constructor(private prisma: PrismaService) {}

  async remove(id: string): Promise<void> {
    await this.prisma.player.update({
      where: {
        id,
      },
      data: {
        status: 'INACTIVE',
      },
    })
  }

  async update(id: string, playerName: string): Promise<Player | null> {
    const playerExists = await this.prisma.player.findUnique({
      where: {
        id,
      },
    })

    if (!playerExists) {
      return null
    }

    const newPlayer = await this.prisma.player.update({
      where: {
        id,
      },
      data: {
        name: playerName,
        updatedAt: new Date(),
      },
    })

    return PrismaPlayerMapper.toDomain(newPlayer)
  }

  async findById(id: string): Promise<Player | null> {
    const player = await this.prisma.player.findUnique({
      where: {
        id,
      },
    })

    if (!player) {
      return null
    }

    return PrismaPlayerMapper.toDomain(player)
  }

  async create(player: Player): Promise<Player> {
    const data = PrismaPlayerMapper.toPrisma(player)

    const newPlayer = await this.prisma.player.create({
      data,
    })
    return PrismaPlayerMapper.toDomain(newPlayer)
  }

  async findByTeamAndRound(teamId: string, roundId: string): Promise<Player[]> {
    const players = await this.prisma.player.findMany({
      where: {
        teamId,
        roundId,
        status: 'ACTIVE',
      },
    })

    return players.map(PrismaPlayerMapper.toDomain)
  }
}
