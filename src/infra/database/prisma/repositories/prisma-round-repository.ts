import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { RoundRepository } from '@/domain/project/application/repositories/round-repository'
import { Round } from '@/domain/project/enterprise/entities/round'
import { PrismaRoundMapper } from '../mappers/prisma-round-mapper'
import { RoundStatus } from '@prisma/client'
import { PaginationParams } from '@/core/repositories/pagination-params'

@Injectable()
export class PrismaRoundRepository implements RoundRepository {
  constructor(private prisma: PrismaService) {}

  async findByChampionshipId(
    champId: string,
    { page }: PaginationParams,
  ): Promise<Round[]> {
    const rounds = await this.prisma.round.findMany({
      where: {
        championshipId: champId,
      },
      select: {
        name: true,
        status: true,
        championshipId: true,
        id: true,
        createdAt: true,
        updatedAt: true,
        matchs: {
          select: {
            scoreAway: true,
            scoreHome: true,
            status: true,
            date: true,
            teamAway: {
              select: {
                name: true,
              },
            },
            teamHome: {
              select: {
                name: true,
              },
            },
          },
        },
        // id: string; scoreHome: number; scoreAway: number; teamIdHome: string; teamIdAway: string; roundId: string; status: MatchStatus; date: Date; createdAt: Date;
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return rounds.map(PrismaRoundMapper.toDomainWithRound)
  }

  async updateRoundName(roundId: string, name: string): Promise<void> {
    await this.prisma.round.update({
      where: {
        id: roundId,
      },
      data: {
        name,
      },
    })
  }

  async updateRoundStatus(roundId: string, status: RoundStatus): Promise<void> {
    await this.prisma.round.update({
      where: {
        id: roundId,
      },
      data: {
        status,
      },
    })
  }

  async findById(id: string): Promise<Round | null> {
    const round = await this.prisma.round.findUnique({
      where: {
        id,
      },
    })

    if (!round) {
      return null
    }

    return PrismaRoundMapper.toDomain(round)
  }

  async create(round: Round): Promise<Round> {
    const data = PrismaRoundMapper.toPrisma(round)

    const newRound = await this.prisma.round.create({
      data,
    })
    return PrismaRoundMapper.toDomain(newRound)
  }
}
