import { Match } from '../../enterprise/entities/match'

export abstract class MatchRepository {
  abstract create(match: Match): Promise<Match>
  abstract findById(id: string): Promise<Match | null>
  abstract findByTeamHomeAndTeamAwayAndDate(
    teamHomeId: string,
    teamAwayId: string,
    date: Date,
  ): Promise<Match | null>

  abstract updateScore(
    matchId: string,
    scoreHome: number,
    scoreAway: number,
  ): Promise<void>
}
