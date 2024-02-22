import { Round } from './../../enterprise/entities/round'

export abstract class RoundRepository {
  abstract create(round: Round): Promise<Round>
  abstract findById(id: string): Promise<Round | null>
}
