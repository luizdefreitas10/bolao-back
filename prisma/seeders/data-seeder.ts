import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const ADMIN_PHONE = '5581997825316'
const ADMIN_PASSWORD = 'admin'
const DEMO_USER_PASSWORD = '123456'
const HASH_SALT_LENGTH = 8

const DEMO_USERS = [
  {
    phone: '5581999990001',
    fullName: 'João Silva',
    userName: 'joao_silva',
    email: 'joao@demo.com',
  },
  {
    phone: '5581999990002',
    fullName: 'Maria Santos',
    userName: 'maria_santos',
    email: 'maria@demo.com',
  },
  {
    phone: '5581999990003',
    fullName: 'Pedro Oliveira',
    userName: 'pedro_oliveira',
    email: 'pedro@demo.com',
  },
  {
    phone: '5581999990004',
    fullName: 'Ana Costa',
    userName: 'ana_costa',
    email: 'ana@demo.com',
  },
  {
    phone: '5581999990005',
    fullName: 'Carlos Lima',
    userName: 'carlos_lima',
    email: 'carlos@demo.com',
  },
]

export async function CreateInitialDataSeeder(prisma: PrismaClient) {
  async function createAdminUser() {
    const hashedPassword = await hash(ADMIN_PASSWORD, HASH_SALT_LENGTH)

    await prisma.user.upsert({
      where: { phone: ADMIN_PHONE },
      update: {
        password: hashedPassword,
        role: 'ADMIN',
        isVerified: true,
      },
      create: {
        fullName: 'Admin User',
        userName: 'admin',
        phone: ADMIN_PHONE,
        password: hashedPassword,
        email: 'admin@email.com',
        role: 'ADMIN',
        createdAt: new Date(),
        isVerified: true,
      },
    })
  }

  async function createDemoUsers() {
    for (const demoUser of DEMO_USERS) {
      const hashedPassword = await hash(DEMO_USER_PASSWORD, HASH_SALT_LENGTH)

      await prisma.user.upsert({
        where: { phone: demoUser.phone },
        update: {
          password: hashedPassword,
          role: 'USER',
          isVerified: true,
          fullName: demoUser.fullName,
          userName: demoUser.userName,
          email: demoUser.email,
        },
        create: {
          fullName: demoUser.fullName,
          userName: demoUser.userName,
          phone: demoUser.phone,
          password: hashedPassword,
          email: demoUser.email,
          role: 'USER',
          createdAt: new Date(),
          isVerified: true,
        },
      })
    }
  }

  async function createTeams() {
    await prisma.team.upsert({
      where: { name: 'Time 1' },
      update: {},
      create: {
        name: 'Time 1',
        createdAt: new Date(),
      },
    })
    await prisma.team.upsert({
      where: { name: 'Time 2' },
      update: {},
      create: {
        name: 'Time 2',
        createdAt: new Date(),
      },
    })
  }

  async function createChampionship() {
    await prisma.championship.upsert({
      where: { name: 'Campeonato 1' },
      update: {},
      create: {
        name: 'Campeonato 1',
        createdAt: new Date(),
      },
    })
  }

  async function createRound() {
    const championships = await prisma.championship.findMany()
    const championship = championships.find((item) => item.name === 'Campeonato 1')

    if (!championship) {
      return
    }

    const existingRound = await prisma.round.findFirst({
      where: {
        championshipId: championship.id,
        name: 'Rodada 1',
      },
    })

    if (!existingRound) {
      await prisma.round.create({
        data: {
          name: 'Rodada 1',
          championshipId: championship.id,
          createdAt: new Date(),
        },
      })
    }
  }

  async function createMatch() {
    const teams = await prisma.team.findMany()
    const rounds = await prisma.round.findMany()
    const homeTeam = teams.find((team) => team.name === 'Time 1')
    const awayTeam = teams.find((team) => team.name === 'Time 2')
    const round = rounds.find((item) => item.name === 'Rodada 1')

    if (!homeTeam || !awayTeam || !round) {
      return
    }

    const matchDate = new Date()
    matchDate.setDate(matchDate.getDate() + 7)

    const existingMatch = await prisma.match.findFirst({
      where: {
        roundId: round.id,
        teamIdHome: homeTeam.id,
        teamIdAway: awayTeam.id,
      },
    })

    if (!existingMatch) {
      await prisma.match.create({
        data: {
          scoreHome: 0,
          scoreAway: 0,
          teamIdAway: awayTeam.id,
          teamIdHome: homeTeam.id,
          date: matchDate,
          createdAt: new Date(),
          roundId: round.id,
          status: 'WAITING',
        },
      })
    } else {
      await prisma.match.update({
        where: { id: existingMatch.id },
        data: {
          date: matchDate,
          status: 'WAITING',
        },
      })
    }
  }

  async function createPlayersForLastGoal() {
    const round = await prisma.round.findFirst({
      where: { name: 'Rodada 1' },
    })
    const team = await prisma.team.findFirst({
      where: { name: 'Time 1' },
    })

    if (!round || !team) {
      return
    }

    for (const name of ['Jogador A', 'Jogador B', 'Jogador C']) {
      const existingPlayer = await prisma.player.findFirst({
        where: {
          roundId: round.id,
          teamId: team.id,
          name,
        },
      })

      if (!existingPlayer) {
        await prisma.player.create({
          data: {
            name,
            roundId: round.id,
            teamId: team.id,
            status: 'ACTIVE',
            createdAt: new Date(),
          },
        })
      }
    }
  }

  return {
    createTeams,
    createChampionship,
    createRound,
    createMatch,
    createAdminUser,
    createDemoUsers,
    createPlayersForLastGoal,
  }
}
