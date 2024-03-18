import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Team, TeamProps } from '@/domain/project/enterprise/entities/team'
import { PrismaTeamMapper } from '@/infra/database/prisma/mappers/prisma-team-mapper'

export function makeTeam(
  override: Partial<TeamProps> = {},
  id?: UniqueEntityID,
) {
  const team = Team.create(
    {
      name: 'Time 1',
      status: 'WAITING',
      ...override,
    },
    id,
  )

  return team
}

@Injectable()
export class TeamFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaTeam(data: Partial<TeamProps> = {}): Promise<Team> {
    const team = makeTeam(data)

    await this.prisma.team.create({
      data: PrismaTeamMapper.toPrisma(team),
    })

    return team
  }
}
