import { MatchStatus, RoundStatus } from '@prisma/client'

export type AdminMatchDetails = {
  id: string
  scoreAway: number
  scoreHome: number
  status: MatchStatus
  date: Date
  teamHome: { id: string; name: string; logoUrl?: string | null }
  teamAway: { id: string; name: string; logoUrl?: string | null }
  lastPlayer: {
    id: string
    name: string
    team: { id: string; name: string; logoUrl?: string | null }
  } | null
  lastPlayerTeam: { id: string; name: string; logoUrl?: string | null } | null
  players: { id: string; name: string; photoUrl?: string | null }[]
}

export type AdminRoundDetails = {
  id: string
  name: string
  status: RoundStatus
  createdAt: Date
  championship: { name: string }
  matchs: AdminMatchDetails[]
}

export type ChampionshipWithWaitingRoundsDetails = {
  id: string
  name: string
  status: string
  rounds: {
    id: string
    name: string
    status: string
    createdAt: Date
    updatedAt: Date | null
    matchs: {
      id: string
      scoreAway: number
      scoreHome: number
      status: string
      date: Date
      teamHome: { name: string; logoUrl?: string | null }
      teamAway: { name: string; logoUrl?: string | null }
      lastPlayerTeam: { id: string; name: string; logoUrl?: string | null } | null
      players: { id: string; name: string; photoUrl?: string | null }[]
      predictions: {
        id: string
        createdAt: Date
        updatedAt: Date | null
        lastPlayerToScore: {
          id: string
          name: string
          teamId: string
          status: string
          createdAt: Date
          updatedAt: Date | null
        } | null
        lastPlayerToScoreId: string | null
        predictionHome: number | null
        predictionAway: number | null
        predictionType: string
      }[]
    }[]
  }[]
}
