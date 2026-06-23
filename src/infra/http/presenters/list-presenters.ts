import { Championship } from '@/domain/project/enterprise/entities/championship'
import {
  AdminRoundDetails,
  ChampionshipWithWaitingRoundsDetails,
} from '@/domain/project/application/repositories/types/admin-round-details'
import { Round } from '@/domain/project/enterprise/entities/round'
import { Team } from '@/domain/project/enterprise/entities/team'

export class ChampionshipListPresenter {
  static toHTTP(championship: Championship) {
    return {
      id: championship.id.toString(),
      name: championship.name,
      status: championship.status,
      createdAt: championship.createdAt,
    }
  }
}

export class TeamListPresenter {
  static toHTTP(team: Team) {
    return {
      id: team.id.toString(),
      name: team.name,
      createdAt: team.createdAt,
    }
  }
}

export class RoundListPresenter {
  static toHTTP(round: Round) {
    return {
      id: round.id.toString(),
      name: round.name,
      status: round.status,
      createdAt: round.createdAt,
    }
  }
}

export class AdminRoundPresenter {
  static toHTTP(round: AdminRoundDetails) {
    return {
      id: round.id,
      name: round.name,
      status: round.status,
      createdAt: round.createdAt,
      championship: round.championship,
      matchs: round.matchs.map((match) => ({
        id: match.id,
        creator: null,
        scoreAway: match.scoreAway,
        scoreHome: match.scoreHome,
        status: match.status,
        date: match.date,
        teamHome: match.teamHome,
        teamAway: match.teamAway,
        players: match.players,
        lastPlayerTeam: match.lastPlayerTeam ?? match.lastPlayer?.team ?? null,
        lastPlayerToScore: match.lastPlayer
          ? {
              id: match.lastPlayer.id,
              name: match.lastPlayer.name,
            }
          : undefined,
      })),
    }
  }
}

export class ChampionshipWithWaitingRoundsPresenter {
  static toHTTP(championship: ChampionshipWithWaitingRoundsDetails) {
    return championship
  }
}
