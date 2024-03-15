import { ChampionshipRepository } from "@/domain/project/application/repositories/championship-repository";
import { Championship } from "@/domain/project/enterprise/entities/championship";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaChampionshipMapper } from "../mappers/prisma-championship-mapper";
import { $Enums } from "@prisma/client";


@Injectable()
export class PrismaChampionshipRepository implements ChampionshipRepository {

  constructor(private prisma: PrismaService) {}

  async updateChampionshipStatus(championship: Championship, status: $Enums.ChampionshipStatus): Promise<Championship> {
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

  async updateChampionshipName(championship: Championship, newChampionshipName: string): Promise<Championship> {

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
}