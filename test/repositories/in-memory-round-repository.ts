import { PaginationParams } from '@/core/repositories/pagination-params'
import { RoundRepository } from '@/domain/project/application/repositories/round-repository'
import { Round } from '@/domain/project/enterprise/entities/round'
import { RoundStatus } from '@prisma/client'

export class InMemoryRoundRepository implements RoundRepository {
  public items: Round[] = []

  async updateRoundName(roundId: string, name: string): Promise<void> {
    const roundIndex = this.items.findIndex(
      (item) => item.id.toString() === roundId,
    )

    if (roundIndex === -1) {
      return
    }

    this.items[roundIndex].name = name
  }

  async updateRoundStatus(roundId: string, status: RoundStatus): Promise<void> {
    const roundIndex = this.items.findIndex(
      (item) => item.id.toString() === roundId,
    )

    if (roundIndex === -1) {
      return
    }

    this.items[roundIndex].status = status
  }

  async create(round: Round): Promise<Round> {
    this.items.push(round)
    return round
  }

  async findById(id: string): Promise<Round | null> {
    const round = this.items.find((item) => item.id.toString() === id)

    if (!round) {
      return null
    }

    return round
  }

  async findByChampionshipId(
    champId: string,
    params: PaginationParams,
    onlyActive?: boolean,
  ): Promise<Round[]> {
    let rounds = this.items.filter(
      (item) => item.championshipId.toString() === champId,
    )

    if (onlyActive) {
      rounds = rounds.filter((round) => round.status !== 'INACTIVE')
    }

    return rounds
  }
}
