import { ChampionshipRepository } from '@/domain/project/application/repositories/championship-repository'
import { Championship } from '@/domain/project/enterprise/entities/championship'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaChampionshipMapper } from '../mappers/prisma-championship-mapper'
import { $Enums } from '@prisma/client'

@Injectable()
export class PrismaChampionshipRepository implements ChampionshipRepository {
  constructor(private prisma: PrismaService) {}

  async updateChampionshipStatus(
    championship: Championship,
    status: $Enums.ChampionshipStatus,
  ): Promise<Championship> {
    const data = PrismaChampionshipMapper.toPrisma(championship)

    const updatedChampionship = await this.prisma.championship.update({
      where: {
        id: data.id,
      },
      data: {
        status,
        updatedAt: new Date(),
      },
    })

    return PrismaChampionshipMapper.toDomain(updatedChampionship)
  }

  async updateChampionshipName(
    championship: Championship,
    newChampionshipName: string,
  ): Promise<Championship> {
    const data = PrismaChampionshipMapper.toPrisma(championship)

    const updatedChampionship = await this.prisma.championship.update({
      where: {
        id: data.id,
      },
      data: {
        name: newChampionshipName,
        updatedAt: new Date(),
      },
    })

    return PrismaChampionshipMapper.toDomain(updatedChampionship)
  }

  async create(championship: Championship): Promise<Championship> {
    const data = PrismaChampionshipMapper.toPrisma(championship)

    const createdChampionship = await this.prisma.championship.create({
      data,
    })

    return PrismaChampionshipMapper.toDomain(createdChampionship)
  }

  async findById(id: string): Promise<Championship | null> {
    const championship = await this.prisma.championship.findUnique({
      where: {
        id,
      },
    })

    if (!championship) {
      return null
    }

    return PrismaChampionshipMapper.toDomain(championship)
  }

  async findByName(championshipName: string): Promise<Championship | null> {
    const championship = await this.prisma.championship.findFirst({
      where: {
        name: championshipName,
      },
    })

    if (!championship) {
      return null
    }

    return PrismaChampionshipMapper.toDomain(championship)
  }

  async removeChampionship(championship: Championship): Promise<void> {
    const data = PrismaChampionshipMapper.toPrisma(championship)

    await this.prisma.championship.update({
      where: {
        id: data.id,
      },
      data: {
        status: 'INACTIVE',
        updatedAt: new Date(),
      },
    })
  }

  async findMany(): Promise<Championship[]> {
    const championships = await this.prisma.championship.findMany({
      where: {
        status: { not: 'INACTIVE' },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return championships.map(PrismaChampionshipMapper.toDomain)
  }

  async findManyWithWaitingRounds(
    userId: string,
  ): Promise<
    import('@/domain/project/application/repositories/types/admin-round-details').ChampionshipWithWaitingRoundsDetails[]
  > {
    const championships = await this.prisma.championship.findMany({
      where: {
        status: { not: 'INACTIVE' },
        rounds: {
          some: {
            status: { in: ['WAITING', 'IN_PROGRESS'] },
            matchs: {
              some: {
                status: { in: ['WAITING', 'IN_PROGRESS'] },
              },
            },
          },
        },
      },
      include: {
        rounds: {
          where: {
            status: { in: ['WAITING', 'IN_PROGRESS'] },
          },
          include: {
            matchs: {
              where: {
                status: { in: ['WAITING', 'IN_PROGRESS'] },
              },
              include: {
                teamHome: { select: { name: true } },
                teamAway: { select: { name: true } },
                lastPlayer: {
                  select: {
                    id: true,
                    name: true,
                    team: { select: { id: true, name: true } },
                  },
                },
                predictions: {
                  where: {
                    userId,
                  },
                  include: {
                    lastPlayer: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    const roundsWithPlayers = await Promise.all(
      championships.map(async (championship) => {
        const rounds = await Promise.all(
          championship.rounds.map(async (round) => {
            const matchs = await Promise.all(
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

                let lastPlayerTeam = match.lastPlayer
                  ? {
                      id: match.lastPlayer.team.id,
                      name: match.lastPlayer.team.name,
                    }
                  : null

                if (!lastPlayerTeam && teamIdsWithPlayers.length === 1) {
                  lastPlayerTeam =
                    teamIdsWithPlayers[0] === match.teamIdHome
                      ? {
                          id: match.teamIdHome,
                          name: match.teamHome.name,
                        }
                      : {
                          id: match.teamIdAway,
                          name: match.teamAway.name,
                        }
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
                  teamHome: { name: match.teamHome.name },
                  teamAway: { name: match.teamAway.name },
                  lastPlayerTeam,
                  players: players.map(({ id, name }) => ({ id, name })),
                  predictions: match.predictions.map((prediction) => ({
                    id: prediction.id,
                    createdAt: prediction.createdAt,
                    updatedAt: prediction.updatedAt,
                    lastPlayerToScore: prediction.lastPlayer,
                    lastPlayerToScoreId: prediction.lastPlayerId,
                    predictionHome: prediction.predictionHome,
                    predictionAway: prediction.predictionAway,
                    predictionType: prediction.predictionType,
                  })),
                }
              }),
            )

            return {
              id: round.id,
              name: round.name,
              status: round.status,
              createdAt: round.createdAt,
              updatedAt: round.updatedAt,
              matchs,
            }
          }),
        )

        return {
          id: championship.id,
          name: championship.name,
          status: championship.status,
          rounds,
        }
      }),
    )

    return roundsWithPlayers
  }
}
