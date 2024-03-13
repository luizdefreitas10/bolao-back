import { PrismaClient } from '@prisma/client'
import { CreateInitialDataSeeder } from './seeders/data-seeder'

const prisma = new PrismaClient()

async function main() {
  const { createChampionship, createMatch, createRound, createTeams } =
    await CreateInitialDataSeeder(prisma)
  await createTeams()
  await createChampionship()
  await createRound()
  await createMatch()
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })
