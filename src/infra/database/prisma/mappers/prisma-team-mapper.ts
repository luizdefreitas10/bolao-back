import { Team as PrismaTeam, Prisma } from '@prisma/client'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Team } from '@/domain/project/enterprise/entities/team'

export class PrismaTeamMapper {
  static toDomain(raw: PrismaTeam): Team {
    return Team.create(
      {
        name: raw.name,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(team: Team): Prisma.TeamUncheckedCreateInput {
    return {
      id: team.id.toString(),
      name: team.name,
      createdAt: team.createdAt,
      updatedAt: team.updatedAt,
    }
  }
}
