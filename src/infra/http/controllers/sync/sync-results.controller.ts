import {
  Controller,
  Post,
  Headers,
  UnauthorizedException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Public } from '@/infra/auth/public'
import { EnvService } from '@/infra/env/env.service'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { toPortuguese } from './wc2026-name-map'

interface Wc2026Goal {
  name: string
  minute: string
}

interface Wc2026MatchSummary {
  id: number
  team1: string
  team2: string
  status: 'scheduled' | 'live' | 'finished'
  score: [number, number] | null
}

interface Wc2026MatchDetail extends Wc2026MatchSummary {
  goals1?: Wc2026Goal[]
  goals2?: Wc2026Goal[]
}

const WC2026_API = 'https://wcup2026.org/api/data.php'

/** Normalize a name for fuzzy comparison: remove accents, lowercase, trim */
function normName(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .trim()
}

/**
 * Return true if the API scorer name plausibly refers to the DB player name.
 * Checks exact match and then checks that every token of the shorter name
 * appears in the longer normalized string.
 */
function namesMatch(dbName: string, apiName: string): boolean {
  const db = normName(dbName)
  const api = normName(apiName)
  if (db === api) return true
  if (db.includes(api) || api.includes(db)) return true
  const tokens = (db.length < api.length ? db : api).split(' ')
  const other = db.length < api.length ? api : db
  return tokens.filter((t) => t.length > 1).every((t) => other.includes(t))
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error(`HTTP ${res.status} from ${url}`)
  return res.json() as Promise<T>
}

@ApiTags('sync')
@Controller('/sync-results')
@Public()
export class SyncResultsController {
  private readonly logger = new Logger(SyncResultsController.name)

  constructor(
    private readonly env: EnvService,
    private readonly prisma: PrismaService,
  ) {}

  @Post()
  async handle(@Headers('x-sync-secret') secret: string) {
    const expected = this.env.get('SYNC_SECRET')
    if (!expected || secret !== expected) {
      throw new UnauthorizedException('Invalid sync secret.')
    }

    try {
      const { matches: extMatches } = await fetchJson<{
        matches: Wc2026MatchSummary[]
      }>(`${WC2026_API}?action=results&limit=100`)

      const finished = (extMatches ?? []).filter(
        (m) => m.status === 'finished' && Array.isArray(m.score),
      )

      let updated = 0
      let skipped = 0

      for (const ext of finished) {
        const homePt = toPortuguese(ext.team1)
        const awayPt = toPortuguese(ext.team2)

        const match = await this.prisma.match.findFirst({
          where: {
            status: 'WAITING',
            teamHome: { name: homePt },
            teamAway: { name: awayPt },
          },
          include: { teamHome: true, teamAway: true },
        })

        if (!match) {
          skipped++
          continue
        }

        const scoreHome = ext.score![0]
        const scoreAway = ext.score![1]

        // Check if there are players seeded for either team in this round
        const roundPlayers = await this.prisma.player.findMany({
          where: {
            roundId: match.roundId,
            status: 'ACTIVE',
            teamId: { in: [match.teamIdHome, match.teamIdAway] },
          },
          select: { id: true, name: true, teamId: true },
        })

        let lastPlayerId: string | null = null

        if (roundPlayers.length > 0) {
          // Determine which team has players (that's the lastPlayerTeam)
          const teamIds = [...new Set(roundPlayers.map((p) => p.teamId))]
          const lastPlayerTeamId = teamIds[0]
          const isHomeTeam = lastPlayerTeamId === match.teamIdHome

          // Fetch match detail from wcup2026.org to get goal events
          try {
            const detail = await fetchJson<{ match: Wc2026MatchDetail }>(
              `${WC2026_API}?action=match&id=${ext.id}`,
            )

            // goals1 = home team goals, goals2 = away team goals
            const teamGoals = isHomeTeam
              ? (detail.match?.goals1 ?? [])
              : (detail.match?.goals2 ?? [])

            const totalGoalsForTeam = isHomeTeam ? scoreHome : scoreAway

            if (teamGoals.length > 0 && totalGoalsForTeam > 0) {
              // The last entry in the goals array is the last goal of that team
              const lastGoalScorerName =
                teamGoals[teamGoals.length - 1].name

              // Find the player in our DB (fuzzy name match)
              const teamPlayers = roundPlayers.filter(
                (p) => p.teamId === lastPlayerTeamId,
              )
              const matched = teamPlayers.find((p) =>
                namesMatch(p.name, lastGoalScorerName),
              )

              if (matched) {
                lastPlayerId = matched.id
                this.logger.log(
                  `Last scorer matched: "${lastGoalScorerName}" → DB player "${matched.name}"`,
                )
              } else {
                this.logger.warn(
                  `Last scorer NOT in player list: "${lastGoalScorerName}" ` +
                    `(match: ${homePt} × ${awayPt}, team players: ${teamPlayers.map((p) => p.name).join(', ')})`,
                )
              }
            }
          } catch (detailErr) {
            this.logger.warn(
              `Could not fetch match detail for id=${ext.id}: ${detailErr}`,
            )
          }
        }

        await this.prisma.match.update({
          where: { id: match.id },
          data: {
            scoreHome,
            scoreAway,
            status: 'DONE',
            ...(lastPlayerId !== null ? { lastPlayerId } : {}),
          },
        })

        this.logger.log(
          `Updated: ${homePt} ${scoreHome}×${scoreAway} ${awayPt}` +
            (lastPlayerId ? ` | lastPlayer: ${lastPlayerId}` : ''),
        )
        updated++
      }

      return {
        message: 'Sync completed.',
        updated,
        skipped,
        total: finished.length,
      }
    } catch (error) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof InternalServerErrorException
      ) {
        throw error
      }
      this.logger.error('Sync error', error)
      throw new InternalServerErrorException('Sync failed.')
    }
  }
}
