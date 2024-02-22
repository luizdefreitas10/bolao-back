import { PaginationParams } from '@/core/repositories/pagination-params'
import { User } from './../../enterprise/entities/user'

export abstract class UserRepository {
  abstract create(user: User): Promise<User>
  abstract findByUsername(userName: string): Promise<User | null>
  abstract findByPhone(phone: string): Promise<User | null>
  abstract findById(userId: string): Promise<User | null>
  abstract updateVerified(userId: string): Promise<User>
  abstract updatePassword(userId: string, newPassword: string): Promise<User>
  abstract findByUserAndlastPasswordModification(
    id: string,
    date: Date,
  ): Promise<User | null>

  abstract findAll({ page, size }: PaginationParams): Promise<User[]>
}
