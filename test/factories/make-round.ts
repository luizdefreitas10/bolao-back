import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Round, RoundProps } from '@/domain/project/enterprise/entities/round'
import { PrismaRoundMapper } from '@/infra/database/prisma/mappers/prisma-round-mapper'

export function makeRound(
  override: Partial<RoundProps> = {},
  id?: UniqueEntityID,
) {
  const round = Round.create(
    {
      name: 'Time 1',
      status: 'WAITING',
      championshipId: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return round
}

@Injectable()
export class RoundFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaRound(data: Partial<RoundProps> = {}): Promise<Round> {
    const round = makeRound(data)

    await this.prisma.round.create({
      data: PrismaRoundMapper.toPrisma(round),
    })

    return round
  }
}
