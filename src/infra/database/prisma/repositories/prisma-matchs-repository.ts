import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { MatchRepository } from '@/domain/project/application/repositories/match-repository'
import { Match } from '@/domain/project/enterprise/entities/match'
import { PrismaMatchMapper } from '../mappers/prisma-match-mapper'
import { $Enums, MatchStatus } from '@prisma/client'
import { PaginationParams } from '@/core/repositories/pagination-params'

@Injectable()
export class PrismaMatchRepository implements MatchRepository {
  constructor(private prisma: PrismaService) {}

  async fetchActiveMatches({ page }: PaginationParams): Promise<Match[]> {
    const matches = await this.prisma.match.findMany({
      where: {
        status: { in: ['WAITING', 'IN_PROGRESS', 'DONE'] },
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return matches.map(PrismaMatchMapper.toDomain)
  }

  async findByRoundId(
    roundId: string,
    { page }: PaginationParams,
  ): Promise<Match[]> {
    const matches = await this.prisma.match.findMany({
      where: {
        roundId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return matches.map(PrismaMatchMapper.toDomain)
  }

  async fetchMatchesByStatus(
    status: $Enums.MatchStatus,
    { page }: PaginationParams,
  ): Promise<Match[]> {
    const matches = await this.prisma.match.findMany({
      where: {
        status,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return matches.map(PrismaMatchMapper.toDomain)
  }

  async updateMatchDate(matchId: string, date: Date): Promise<void> {
    await this.prisma.match.update({
      where: {
        id: matchId,
      },
      data: {
        date,
      },
    })
  }

  async updateMatchStatus(matchId: string, status: MatchStatus): Promise<void> {
    await this.prisma.match.update({
      where: {
        id: matchId,
      },
      data: {
        status,
      },
    })
  }

  async updatResult(
    matchId: string,
    scoreHome: number,
    scoreAway: number,
    lastPlayerId?: string | null,
  ): Promise<void> {
    await this.prisma.match.update({
      where: {
        id: matchId,
      },
      data: {
        scoreHome,
        scoreAway,
        lastPlayerId: lastPlayerId || null,
        status: 'DONE',
      },
    })
  }

  async findByTeamHomeAndTeamAwayAndDate(
    teamIdHome: string,
    teamIdAway: string,
    date: Date,
  ): Promise<Match | null> {
    const match = await this.prisma.match.findFirst({
      where: {
        teamIdHome,
        teamIdAway,
        date,
      },
    })

    if (!match) {
      return null
    }

    return PrismaMatchMapper.toDomain(match)
  }

  async findById(id: string): Promise<Match | null> {
    const match = await this.prisma.match.findUnique({
      where: {
        id,
      },
    })

    if (!match) {
      return null
    }

    return PrismaMatchMapper.toDomain(match)
  }

  async create(match: Match): Promise<Match> {
    const data = PrismaMatchMapper.toPrisma(match)

    const newMatch = await this.prisma.match.create({
      data,
    })
    return PrismaMatchMapper.toDomain(newMatch)
  }
}
