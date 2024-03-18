import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { User, UserProps } from '@/domain/project/enterprise/entities/user'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaUserMapper } from '@/infra/database/prisma/mappers/prisma-user-mapper'

export function makeUser(
  override: Partial<UserProps> = {},
  id?: UniqueEntityID,
) {
  const user = User.create(
    {
      fullName: faker.person.fullName(),
      email: faker.internet.email(),
      userName: faker.internet.userName(),
      password: faker.internet.password(),
      ...override,
      phone: faker.phone.number(),
    },
    id,
  )

  return user
}
export function makeUserAdmin(
  override: Partial<UserProps> = {},
  id?: UniqueEntityID,
) {
  const user = User.create(
    {
      fullName: faker.person.fullName(),
      email: faker.internet.email(),
      userName: faker.internet.userName(),
      password: faker.internet.password(),
      ...override,
      phone: faker.phone.number(),
      role: 'ADMIN',
    },
    id,
  )

  return user
}

@Injectable()
export class UserFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaUser(data: Partial<UserProps> = {}): Promise<User> {
    const user = makeUser(data)

    await this.prisma.user.create({
      data: PrismaUserMapper.toPrisma(user),
    })

    return user
  }

  async makePrismaUserAdmin(data: Partial<UserProps> = {}): Promise<User> {
    const user = makeUserAdmin(data)

    await this.prisma.user.create({
      data: PrismaUserMapper.toPrisma(user),
    })

    return user
  }
}
