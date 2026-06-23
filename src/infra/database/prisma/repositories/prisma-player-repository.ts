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

  async findByTeamAndRoundAndName(
    teamId: string,
    roundId: string,
    name: string,
  ): Promise<Player[]> {
    const players = await this.prisma.player.findMany({
      where: {
        teamId,
        roundId,
        name,
        status: 'ACTIVE',
      },
    })

    return players.map(PrismaPlayerMapper.toDomain)
  }

  async findByTeam(teamId: string): Promise<Player[]> {
    const players = await this.prisma.player.findMany({
      where: {
        teamId,
        status: 'ACTIVE',
      },
      orderBy: {
        name: 'asc',
      },
    })

    return players.map(PrismaPlayerMapper.toDomain)
  }

  async syncPlayersForRoundAndTeam(
    roundId: string,
    teamId: string,
    playerNames: string[],
  ): Promise<Player[]> {
    const normalizedNames = [
      ...new Set(playerNames.map((name) => name.trim()).filter(Boolean)),
    ]

    const existingPlayers = await this.prisma.player.findMany({
      where: {
        roundId,
        teamId,
        status: 'ACTIVE',
      },
    })

    for (const player of existingPlayers) {
      if (!normalizedNames.includes(player.name)) {
        await this.prisma.player.update({
          where: { id: player.id },
          data: { status: 'INACTIVE', updatedAt: new Date() },
        })
      }
    }

    const syncedPlayers: Player[] = []

    for (const name of normalizedNames) {
      const existing = existingPlayers.find((player) => player.name === name)

      if (existing) {
        syncedPlayers.push(PrismaPlayerMapper.toDomain(existing))
        continue
      }

      const created = await this.prisma.player.create({
        data: {
          name,
          roundId,
          teamId,
          status: 'ACTIVE',
          createdAt: new Date(),
        },
      })

      syncedPlayers.push(PrismaPlayerMapper.toDomain(created))
    }

    return syncedPlayers
  }
}
