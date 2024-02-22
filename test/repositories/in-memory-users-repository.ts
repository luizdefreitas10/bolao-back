import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { UserRepository } from '@/domain/project/application/repositories/user-repository'
import { User } from '@/domain/project/enterprise/entities/user'

export class InMemoryUsersRepository implements UserRepository {
  public items: User[] = []
  findAll({ page, size }: PaginationParams): Promise<User[]> {
    throw new Error('Method not implemented.')
  }

  async findByUserAndlastPasswordModification(
    id: string,
    date: Date,
  ): Promise<User | null> {
    const user = this.items.find(
      (item) =>
        item.id.toString() === id && item.lastPasswordModification === date,
    )

    if (!user) {
      return null
    }

    return user
  }

  async updatePassword(userId: string, newPassword: string): Promise<User> {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toString() === userId,
    )
    const oldUser = this.items[itemIndex]

    const newUser = User.create({
      fullName: oldUser.fullName,
      userName: oldUser.userName,
      phone: oldUser.phone,
      isVerified: oldUser.isVerified,
      password: newPassword,
    })

    return newUser
  }

  async findById(userId: string): Promise<User | null> {
    const user = this.items.find((item) => item.id.toString() === userId)

    if (!user) {
      return null
    }

    return user
  }

  async updateVerified(userId: string) {
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

  async findByUsername(userName: string): Promise<User | null> {
    const user = this.items.find((item) => item.userName === userName)

    if (!user) {
      return null
    }

    return user
  }

  async findByPhone(phone: string) {
    const user = this.items.find((item) => item.phone === phone)

    if (!user) {
      return null
    }

    return user
  }

  async create(user: User) {
    this.items.push(user)

    DomainEvents.dispatchEventsForAggregate(user.id)
    return user
  }
}
