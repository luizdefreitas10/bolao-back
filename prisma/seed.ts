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
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })
