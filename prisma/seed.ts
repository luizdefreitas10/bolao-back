import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { CreateInitialDataSeeder } from './seeders/data-seeder'

const prisma = new PrismaClient()

async function main() {
  const {
    createAdminUser,
    createNormalUser,
    createChampionship,
    createMatch,
    createRound,
    createTeams,
    createPlayersForLastGoal,
  } = await CreateInitialDataSeeder(prisma)

  await createAdminUser()
  await createNormalUser()
  await createTeams()
  await createChampionship()
  await createRound()
  await createMatch()
  await createPlayersForLastGoal()

  const { seedWorldCup2026 } = await import('./seeders/world-cup-2026-seeder')
  await seedWorldCup2026(prisma)
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })
