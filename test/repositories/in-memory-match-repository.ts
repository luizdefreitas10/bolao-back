import { MatchRepository } from '@/domain/project/application/repositories/match-repository'
import { Match } from '@/domain/project/enterprise/entities/match'
import { MatchStatus } from '@prisma/client'

export class InMemoryMatchRepository implements MatchRepository {
  public items: Match[] = []

  async updateScore(
    matchId: string,
    scoreHome: number,
    scoreAway: number,
  ): Promise<void> {
    const matchIndex = this.items.findIndex(
      (item) => item.id.toString() === matchId,
    )

    if (matchIndex === -1) {
      return
    }

    this.items[matchIndex].scoreAway = scoreAway
    this.items[matchIndex].scoreHome = scoreHome
  }

  async updateMatchDate(matchId: string, date: Date): Promise<void> {
    const matchIndex = this.items.findIndex(
      (item) => item.id.toString() === matchId,
    )
    console.log(matchIndex)
    if (matchIndex === -1) {
      return
    }

    this.items[matchIndex].date = date
  }

  async updateMatchStatus(matchId: string, status: MatchStatus): Promise<void> {
    const matchIndex = this.items.findIndex(
      (item) => item.id.toString() === matchId,
    )

    if (matchIndex === -1) {
      return
    }

    this.items[matchIndex].status = status
  }

  async create(match: Match): Promise<Match> {
    this.items.push(match)
    return match
  }

  async findById(id: string): Promise<Match | null> {
    const match = this.items.find((item) => item.id.toString() === id)

    if (!match) {
      return null
    }

    return match
  }

  async findByTeamHomeAndTeamAwayAndDate(
    teamHomeId: string,
    teamAwayId: string,
    date: Date,
  ): Promise<Match | null> {
    const team = this.items.find(
      (item) =>
        item.teamIdHome.toString() === teamHomeId &&
        item.teamIdAway.toString() === teamAwayId &&
        item.date === date,
    )

    if (!team) {
      return null
    }

    return team
  }
}
