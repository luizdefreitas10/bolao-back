import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'

import { UserRepository } from '@/domain/project/application/repositories/user-repository'
import { PrismaUsersRepository } from './prisma/repositories/prisma-users-repository'
import { VerificationCodeRepository } from '@/domain/project/application/repositories/verification-code-repository'
import { PrismaVerificationCodeRepository } from './prisma/repositories/prisma-verification-code-repository'
import { TeamRepository } from '@/domain/project/application/repositories/team-repository'
import { PrismaTeamRepository } from './prisma/repositories/prisma-teams-repository'
import { RoundRepository } from '@/domain/project/application/repositories/round-repository-'
import { PrismaRoundRepository } from './prisma/repositories/prisma-round-repository'
import { MatchRepository } from '@/domain/project/application/repositories/match-repository'
import { PrismaMatchRepository } from './prisma/repositories/prisma-matchs-repository'
import { PredictionRepository } from '@/domain/project/application/repositories/prediction-repository'
import { PrismaPredictionRepository } from './prisma/repositories/prisma-predictions-repository'

@Module({
  providers: [
    PrismaService,

    {
      provide: UserRepository,
      useClass: PrismaUsersRepository,
    },
    {
      provide: VerificationCodeRepository,
      useClass: PrismaVerificationCodeRepository,
    },
    {
      provide: TeamRepository,
      useClass: PrismaTeamRepository,
    },
    {
      provide: RoundRepository,
      useClass: PrismaRoundRepository,
    },
    {
      provide: MatchRepository,
      useClass: PrismaMatchRepository,
    },
    {
      provide: PredictionRepository,
      useClass: PrismaPredictionRepository,
    },
  ],
  exports: [
    PrismaService,
    UserRepository,
    VerificationCodeRepository,
    PredictionRepository,
    MatchRepository,
    TeamRepository,
    RoundRepository,
  ],
})
export class DatabaseModule {}
