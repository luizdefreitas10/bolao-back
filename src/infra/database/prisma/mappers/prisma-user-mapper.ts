import { User as PrismaUser, Prisma } from '@prisma/client'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { User } from '@/domain/project/enterprise/entities/user'

export class PrismaUserMapper {
  static toDomain(raw: PrismaUser): User {
    return User.create(
      {
        fullName: raw.fullName,
        userName: raw.userName,
        phone: raw.phone,
        password: raw.password,
        isVerified: raw.isVerified,
        lastPasswordModification: raw.lastPasswordModification,
        email: raw.email,
        isEmailVerified: raw.isEmailVerified,
        instagram: raw.instagram,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(user: User): Prisma.UserUncheckedCreateInput {
    return {
      id: user.id.toString(),
      fullName: user.fullName,
      userName: user.userName,
      phone: user.phone,
      password: user.password,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      lastPasswordModification: user.lastPasswordModification,
      email: user.email,
      isEmailVerified: user.isEmailVerified,
      instagram: user.instagram,
    }
  }
}
