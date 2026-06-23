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
    onlyActive?: boolean,
  ): Promise<Round[]> {
    const rounds = await this.prisma.round.findMany({
      where: {
        championshipId: champId,
        ...(onlyActive ? { status: { not: 'INACTIVE' } } : {}),
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

  async findByMatchStatus(
    status: import('@prisma/client').MatchStatus,
  ): Promise<
    import('@/domain/project/application/repositories/types/admin-round-details').AdminRoundDetails[]
  > {
    const rounds = await this.prisma.round.findMany({
      where: {
        matchs: {
          some: {
            status,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        championship: {
          select: {
            name: true,
          },
        },
        matchs: {
          where: {
            status,
          },
          orderBy: {
            date: 'asc',
          },
          include: {
            teamHome: {
              select: {
                id: true,
                name: true,
              },
            },
            teamAway: {
              select: {
                id: true,
                name: true,
              },
            },
            lastPlayer: {
              select: {
                id: true,
                name: true,
                team: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    return Promise.all(
      rounds.map(async (round) => ({
        id: round.id,
        name: round.name,
        status: round.status,
        createdAt: round.createdAt,
        championship: {
          name: round.championship.name,
        },
        matchs: await Promise.all(
          round.matchs.map(async (match) => {
            const roundPlayers = await this.prisma.player.findMany({
              where: {
                roundId: round.id,
                status: 'ACTIVE',
                teamId: {
                  in: [match.teamIdHome, match.teamIdAway],
                },
              },
              select: {
                id: true,
                name: true,
                teamId: true,
              },
            })

            const teamIdsWithPlayers = [
              ...new Set(roundPlayers.map((player) => player.teamId)),
            ]

            let lastPlayerTeam = match.lastPlayer?.team ?? null

            if (!lastPlayerTeam && teamIdsWithPlayers.length === 1) {
              lastPlayerTeam =
                teamIdsWithPlayers[0] === match.teamHome.id
                  ? match.teamHome
                  : match.teamAway
            }

            const players = lastPlayerTeam
              ? roundPlayers.filter(
                  (player) => player.teamId === lastPlayerTeam!.id,
                )
              : roundPlayers

            return {
              id: match.id,
              scoreAway: match.scoreAway,
              scoreHome: match.scoreHome,
              status: match.status,
              date: match.date,
              teamHome: match.teamHome,
              teamAway: match.teamAway,
              lastPlayer: match.lastPlayer,
              lastPlayerTeam,
              players: players.map(({ id, name }) => ({ id, name })),
            }
          }),
        ),
      })),
    )
  }

  async findByChampionshipIdAndStatus(
    champId: string,
    status: RoundStatus,
  ): Promise<Round[]> {
    const rounds = await this.prisma.round.findMany({
      where: {
        championshipId: champId,
        status,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return rounds.map(PrismaRoundMapper.toDomain)
  }
}
