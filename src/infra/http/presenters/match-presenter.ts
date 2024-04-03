import { Match } from '@/domain/project/enterprise/entities/match'

export class MatchPresenter {
  static toHTTP(match: Match) {
    return {
      scoreHome: match.scoreHome,
      scoreAway: match.scoreAway,
      teamIdHome: match.teamIdHome,
      teamIdAway: match.teamIdAway,
      status: match.status,
      date: match.date,
    }
  }
}
