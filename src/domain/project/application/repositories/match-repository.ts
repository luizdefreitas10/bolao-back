import { MatchStatus } from '@prisma/client'
import { Match } from '../../enterprise/entities/match'
import { PaginationParams } from '@/core/repositories/pagination-params'

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

  abstract updateMatchDate(matchId: string, date: Date): Promise<void>
  abstract updateMatchStatus(
    matchId: string,
    status: MatchStatus,
  ): Promise<void>

  abstract fetchMatchesByStatus(
    status: MatchStatus,
    params: PaginationParams,
  ): Promise<Match[]>
}
