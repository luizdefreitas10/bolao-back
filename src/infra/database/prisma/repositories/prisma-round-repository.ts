import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { RoundRepository } from '@/domain/project/application/repositories/round-repository'
import { Round } from '@/domain/project/enterprise/entities/round'
import { PrismaRoundMapper } from '../mappers/prisma-round-mapper'
import { RoundStatus } from '@prisma/client'

@Injectable()
export class PrismaRoundRepository implements RoundRepository {
  constructor(private prisma: PrismaService) {}
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
