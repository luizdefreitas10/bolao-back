import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { TeamRepository } from '@/domain/project/application/repositories/team-repository'
import { PrismaTeamMapper } from '../mappers/prisma-team-mapper'
import { Team } from '@/domain/project/enterprise/entities/team'
import { format } from 'date-fns'

@Injectable()
export class PrismaTeamRepository implements TeamRepository {
  constructor(private prisma: PrismaService) {}

  async update(teamName: string, newTeamName: string): Promise<Team | null> {
    const teamExists = await this.prisma.team.findUnique({
      where: {
        name: teamName,
      },
    })

    if (!teamExists) {
      return null
    }

    // const updatedAt = format(new Date(), 'dd/MM/yyyy - HH:mm:ss')

    const newTeam = await this.prisma.team.update({
      where: {
        name: teamName,
      },
      data: {
        name: newTeamName,
        updatedAt: new Date(),
      },
    })

    return PrismaTeamMapper.toDomain(newTeam)
  }

  async findByName(name: string): Promise<Team | null> {
    const team = await this.prisma.team.findUnique({
      where: {
        name,
      },
    })

    if (!team) {
      return null
    }

    return PrismaTeamMapper.toDomain(team)
  }

  async findById(id: string): Promise<Team | null> {
    const team = await this.prisma.team.findUnique({
      where: {
        id,
      },
    })

    if (!team) {
      return null
    }

    return PrismaTeamMapper.toDomain(team)
  }

  async create(team: Team): Promise<Team> {
    const data = PrismaTeamMapper.toPrisma(team)

    const newTeam = await this.prisma.team.create({
      data,
    })
    return PrismaTeamMapper.toDomain(newTeam)
  }
}
