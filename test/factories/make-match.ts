import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Match, MatchProps } from '@/domain/project/enterprise/entities/match'
import { PrismaMatchMapper } from '@/infra/database/prisma/mappers/prisma-match-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

export function makeMatch(
  override: Partial<MatchProps> = {},
  id?: UniqueEntityID,
) {
  const match = Match.create(
    {
      roundId: new UniqueEntityID(),
      scoreAway: 0,
      scoreHome: 0,
      teamIdAway: new UniqueEntityID(),
      teamIdHome: new UniqueEntityID(),
      date: new Date(Date.now() + 1000 * 1000000),
      ...override,
    },
    id,
  )

  return match
}

@Injectable()
export class MatchFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaMatch(data: Partial<MatchProps> = {}): Promise<Match> {
    const match = makeMatch(data)

    await this.prisma.match.create({
      data: PrismaMatchMapper.toPrisma(match),
    })

    return match
  }
}
