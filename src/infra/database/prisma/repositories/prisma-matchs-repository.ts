import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { MatchRepository } from '@/domain/project/application/repositories/match-repository'
import { Match } from '@/domain/project/enterprise/entities/match'
import { PrismaMatchMapper } from '../mappers/prisma-match-mapper'

@Injectable()
export class PrismaMatchRepository implements MatchRepository {
  constructor(private prisma: PrismaService) {}
  async updateScore(
    matchId: string,
    scoreHome: number,
    scoreAway: number,
  ): Promise<void> {
    await this.prisma.match.update({
      where: {
        id: matchId,
      },
      data: {
        scoreHome,
        scoreAway,
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
