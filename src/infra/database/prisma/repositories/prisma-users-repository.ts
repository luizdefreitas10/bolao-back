import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { UserRepository } from '@/domain/project/application/repositories/user-repository'
import { User } from '@/domain/project/enterprise/entities/user'
import { PrismaUserMapper } from '../mappers/prisma-user-mapper'
import { addDays, startOfDay } from 'date-fns'
import { PaginationParams } from '@/core/repositories/pagination-params'

@Injectable()
export class PrismaUsersRepository implements UserRepository {
  constructor(private prisma: PrismaService) {}
  async findAll({ page, size }: PaginationParams): Promise<User[]> {
    const amount = size || 20
    const users = await this.prisma.user.findMany({
      take: amount,
      skip: (page - 1) * amount,
    })
    return users.map(PrismaUserMapper.toDomain)
  }

  async updatePassword(id: string, newPassword: string): Promise<User> {
    const user = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        password: newPassword,
        lastPasswordModification: new Date(),
      },
    })

    return PrismaUserMapper.toDomain(user)
  }

  async findByUserAndlastPasswordModification(
    id: string,
    date: Date,
  ): Promise<User | null> {
    const startOfDayDate = startOfDay(date)
    const startOfNextDayDate = addDays(startOfDayDate, 1)
    const user = await this.prisma.user.findFirst({
      where: {
        id,
        lastPasswordModification: {
          gte: startOfDayDate,
          lt: startOfNextDayDate,
        },
      },
    })

    if (!user) return null
    return PrismaUserMapper.toDomain(user)
  }

  async updateVerified(id: string): Promise<User> {
    const user = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        isVerified: true,
      },
    })

    return PrismaUserMapper.toDomain(user)
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    })

    if (!user) {
      return null
    }

    return PrismaUserMapper.toDomain(user)
  }

  async findByPhone(phone: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        phone,
      },
    })

    if (!user) {
      return null
    }

    return PrismaUserMapper.toDomain(user)
  }

  async findByUsername(userName: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        userName,
      },
    })

    if (!user) {
      return null
    }

    return PrismaUserMapper.toDomain(user)
  }

  async create(user: User): Promise<User> {
    const data = PrismaUserMapper.toPrisma(user)

    const newUser = await this.prisma.user.create({
      data,
    })
    return PrismaUserMapper.toDomain(newUser)
  }
}
