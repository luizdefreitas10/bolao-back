import { RoundStatus } from '@prisma/client'
import { Round } from '../../enterprise/entities/round'
import { PaginationParams } from '@/core/repositories/pagination-params'

export abstract class RoundRepository {
  abstract create(round: Round): Promise<Round>
  abstract findById(id: string): Promise<Round | null>
  abstract updateRoundName(roundId: string, name: string): Promise<void>
  abstract updateRoundStatus(
    roundId: string,
    status: RoundStatus,
  ): Promise<void>

  abstract findByChampionshipId(
    champId: string,
    params: PaginationParams,
    onlyActive?: boolean,
  ): Promise<Round[]>
}
