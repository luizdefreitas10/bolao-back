import { ChampionshipRepository } from '@/domain/project/application/repositories/championship-repository'
import { Championship } from '@/domain/project/enterprise/entities/championship'
import { ChampionshipStatus } from '@prisma/client'

export class InMemoryChampionshipRepository implements ChampionshipRepository {
  public items: Championship[] = []

  async updateChampionshipName(
    champ: Championship,
    name: string,
  ): Promise<Championship> {
    const champIndex = this.items.findIndex(
      (item) => item.id.toString() === champ.id.toString(),
    )

    this.items[champIndex].name = name
    return this.items[champIndex]
  }

  async updateChampionshipStatus(
    champ: Championship,
    status: ChampionshipStatus,
  ): Promise<Championship> {
    const champIndex = this.items.findIndex(
      (item) => item.id.toString() === champ.id.toString(),
    )

    this.items[champIndex].status = status

    return this.items[champIndex]
  }

  async create(champ: Championship): Promise<Championship> {
    this.items.push(champ)
    return champ
  }

  async findById(id: string): Promise<Championship | null> {
    const champ = this.items.find((item) => item.id.toString() === id)

    if (!champ) {
      return null
    }

    return champ
  }

  async findByName(championshipName: string): Promise<Championship | null> {
    const champ = this.items.find((item) => item.name === championshipName)

    if (!champ) {
      return null
    }

    return champ
  }

  async removeChampionship(championship: Championship): Promise<void> {
    const team = this.items.find((item) => item.name === championship.name)

    if (!team) {
      throw new Error('Team not found')
    }

    team.status = 'INACTIVE'
  }
}
