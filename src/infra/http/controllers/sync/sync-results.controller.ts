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

interface Wc2026Match {
  id: number
  team1: string
  team2: string
  status: 'scheduled' | 'live' | 'finished'
  score: [number, number] | null
  date: string
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
      const res = await fetch(
        'https://wcup2026.org/api/data.php?action=results&limit=50',
        { headers: { Accept: 'application/json' } },
      )

      if (!res.ok) {
        throw new InternalServerErrorException('External API unavailable.')
      }

      const json = (await res.json()) as { matches: Wc2026Match[] }
      const finishedMatches = (json.matches ?? []).filter(
        (m) => m.status === 'finished' && Array.isArray(m.score),
      )

      let updated = 0
      let skipped = 0

      for (const extMatch of finishedMatches) {
        const homePt = toPortuguese(extMatch.team1)
        const awayPt = toPortuguese(extMatch.team2)

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

        await this.prisma.match.update({
          where: { id: match.id },
          data: {
            scoreHome: extMatch.score![0],
            scoreAway: extMatch.score![1],
            status: 'DONE',
          },
        })

        this.logger.log(
          `Updated: ${homePt} ${extMatch.score![0]}×${extMatch.score![1]} ${awayPt}`,
        )
        updated++
      }

      return {
        message: 'Sync completed.',
        updated,
        skipped,
        total: finishedMatches.length,
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
