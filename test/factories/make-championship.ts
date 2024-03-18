import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Championship,
  ChampionshipProps,
} from '@/domain/project/enterprise/entities/championship'
import { PrismaChampionshipMapper } from '@/infra/database/prisma/mappers/prisma-championship-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

export function makeChampionship(
  override: Partial<ChampionshipProps> = {},
  id?: UniqueEntityID,
) {
  const championship = Championship.create(
    {
      name: 'Campeonato Teste',
      status: 'WAITING',
      ...override,
    },
    id,
  )

  return championship
}

@Injectable()
export class ChampionshipFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaChampionship(
    data: Partial<ChampionshipProps> = {},
  ): Promise<Championship> {
    const championship = makeChampionship(data)

    await this.prisma.championship.create({
      data: PrismaChampionshipMapper.toPrisma(championship),
    })

    return championship
  }
}
