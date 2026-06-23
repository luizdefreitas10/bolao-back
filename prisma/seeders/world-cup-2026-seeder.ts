import { PrismaClient } from '@prisma/client'
import {
  playerPhotoPath,
  teamLogoPath,
  WC2026_CHAMPIONSHIP_NAME,
  WC2026_TEAM_PLAYERS,
  WC2026_TEAMS,
  WC2026_UPCOMING_MATCHES,
} from './world-cup-2026-data'

export async function seedWorldCup2026(prisma: PrismaClient) {
  const teamIdByName = new Map<string, string>()
  const roundIdByGroup = new Map<string, string>()

  for (const team of WC2026_TEAMS) {
    const record = await prisma.team.upsert({
      where: { name: team.name },
      update: {
        logoUrl: teamLogoPath(team.iso),
        status: 'ACTIVE',
      },
      create: {
        name: team.name,
        logoUrl: teamLogoPath(team.iso),
        status: 'ACTIVE',
        createdAt: new Date(),
      },
    })
    teamIdByName.set(team.name, record.id)
  }

  const championship = await prisma.championship.upsert({
    where: { name: WC2026_CHAMPIONSHIP_NAME },
    update: {
      status: 'IN_PROGRESS',
    },
    create: {
      name: WC2026_CHAMPIONSHIP_NAME,
      status: 'IN_PROGRESS',
      createdAt: new Date(),
    },
  })

  const groups = [...new Set(WC2026_TEAMS.map((team) => team.group))]

  for (const group of groups) {
    const roundName = `Grupo ${group}`
    const existingRound = await prisma.round.findFirst({
      where: {
        championshipId: championship.id,
        name: roundName,
      },
    })

    const round =
      existingRound ??
      (await prisma.round.create({
        data: {
          name: roundName,
          championshipId: championship.id,
          status: 'IN_PROGRESS',
          createdAt: new Date(),
        },
      }))

    roundIdByGroup.set(group, round.id)
  }

  for (const teamPlayers of WC2026_TEAM_PLAYERS) {
    const teamId = teamIdByName.get(teamPlayers.teamName)
    const roundId = roundIdByGroup.get(teamPlayers.group)

    if (!teamId || !roundId) {
      continue
    }

    for (const player of teamPlayers.players) {
      const existingPlayer = await prisma.player.findFirst({
        where: {
          name: player.name,
          teamId,
          roundId,
        },
      })

      const photoUrl = playerPhotoPath(teamPlayers.folder, player.slug)

      if (!existingPlayer) {
        await prisma.player.create({
          data: {
            name: player.name,
            photoUrl,
            teamId,
            roundId,
            status: 'ACTIVE',
            createdAt: new Date(),
          },
        })
      } else {
        await prisma.player.update({
          where: { id: existingPlayer.id },
          data: {
            photoUrl,
            status: 'ACTIVE',
          },
        })
      }
    }
  }

  for (const match of WC2026_UPCOMING_MATCHES) {
    const homeId = teamIdByName.get(match.home)
    const awayId = teamIdByName.get(match.away)
    const roundId = roundIdByGroup.get(match.group)

    if (!homeId || !awayId || !roundId) {
      continue
    }

    const matchDate = new Date(match.date)

    const existingMatch = await prisma.match.findFirst({
      where: {
        roundId,
        teamIdHome: homeId,
        teamIdAway: awayId,
        date: matchDate,
      },
    })

    if (!existingMatch) {
      await prisma.match.create({
        data: {
          scoreHome: 0,
          scoreAway: 0,
          teamIdHome: homeId,
          teamIdAway: awayId,
          roundId,
          date: matchDate,
          status: 'WAITING',
          createdAt: new Date(),
        },
      })
    }
  }
}
