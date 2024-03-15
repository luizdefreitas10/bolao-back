import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { UserRepository } from '@/domain/project/application/repositories/user-repository'
import { User } from '@/domain/project/enterprise/entities/user'
import { use } from 'passport'

export class InMemoryUsersRepository implements UserRepository {
  public items: User[] = []

  async create(user: User): Promise<User> {
    this.items.push(user)

    DomainEvents.dispatchEventsForAggregate(user.id)
    return user
  }

  async findByUsername(userName: string): Promise<User | null> {
    const user = this.items.find((item) => item.userName === userName)

    if (!user) {
      return null
    }

    return user
  }

  async findByPhone(phone: string): Promise<User | null> {
    const user = this.items.find((item) => item.phone === phone)

    if (!user) {
      return null
    }

    return user
  }

  findById(userId: string): Promise<User | null> {
    throw new Error('Method not implemented.')
  }

  async updateVerified(userId: string): Promise<User> {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toString() === userId,
    )
    const oldUser = this.items[itemIndex]

    const newUser = User.create({
      fullName: oldUser.fullName,
      userName: oldUser.userName,
      phone: oldUser.phone,
      isVerified: true,
    })

    return newUser
  }

  updatePassword(userId: string, newPassword: string): Promise<User> {
    throw new Error('Method not implemented.')
  }

  findByUserAndlastPasswordModification(
    id: string,
    date: Date,
  ): Promise<User | null> {
    throw new Error('Method not implemented.')
  }

  findAll({ page, size }: PaginationParams): Promise<User[]> {
    throw new Error('Method not implemented.')
  }
}
