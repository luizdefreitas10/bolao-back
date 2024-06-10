import { PrismaClient } from '@prisma/client'

export async function CreateInitialDataSeeder(prisma: PrismaClient) {
  async function createAdminUser() {
    await prisma.user.create({
      data: {
        fullName: 'Admin User',
        userName: 'admin',
        phone: '81997825316',
        password: 'admin',
        email: 'admin@email.com',
        role: 'ADMIN',
        createdAt: new Date(),
        isVerified: true,
      },
    })
  }

  async function createTeams() {
    await prisma.team.create({
      data: {
        name: 'Time 1',
        createdAt: new Date(),
      },
    })
    await prisma.team.create({
      data: {
        name: 'Time 2',
        createdAt: new Date(),
      },
    })
  }

  async function createChampionship() {
    await prisma.championship.create({
      data: {
        name: 'Campeonato 1',
        createdAt: new Date(),
      },
    })
  }

  async function createRound() {
    const championships = await prisma.championship.findMany()
    await prisma.round.create({
      data: {
        name: 'Rodada 1',
        championshipId: championships[0].id.toString(),
        createdAt: new Date(),
      },
    })
  }

  async function createMatch() {
    const teams = await prisma.team.findMany()
    const rounds = await prisma.round.findMany()
    await prisma.match.create({
      data: {
        scoreHome: 0,
        scoreAway: 0,
        teamIdAway: teams[0].id.toString(),
        teamIdHome: teams[1].id.toString(),
        date: new Date('12/12/2024'),
        createdAt: new Date(),
        roundId: rounds[0].id.toString(),
      },
    })
  }

  return {
    createTeams,
    createChampionship,
    createRound,
    createMatch,
    createAdminUser,
  }
}
