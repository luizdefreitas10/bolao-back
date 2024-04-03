import { Module } from '@nestjs/common'
import { AuthenticateController } from './controllers/auth/authenticate-controller'
import { CreateAccountController } from './controllers/users/user-create.controller'
import { DatabaseModule } from '../database/database.module'
import { RegisterUserUseCase } from '@/domain/project/application/use-cases/register-user'
import { AuthenticateUserUseCase } from '@/domain/project/application/use-cases/authenticate-user'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { JobsModule } from '../jobs/jobs.module'
import { ResendVerificationCodeUseCase } from '@/domain/project/application/use-cases/resend-verification-code'
import { SendSmsUseCase } from '@/domain/project/application/use-cases/send-sms'
import { SendVerificationCodeResetPasswordUseCase } from '@/domain/project/application/use-cases/send-verification-code-reset-password'
import { VerificationCodeUseCase } from '@/domain/project/application/use-cases/validate-verification-code'
import { VerificationCodeResetPasswordUseCase } from '@/domain/project/application/use-cases/validation-verification-code-reset-password'
import { ResetPasswordController } from './controllers/reset-password/reset-password.controller'
import { SendCodeResetPasswordController } from './controllers/reset-password/send-code-reset-password.controller'
import { ResendVerificationCodeController } from './controllers/verification-code/resend-verification-code.controller'
import { VerificationCodeController } from './controllers/verification-code/verification-code.controler'
import { EnvService } from '../env/env.service'
import { CreateTeamController } from './controllers/team/create-team-controller'
import { CreateTeamUseCase } from '@/domain/project/application/use-cases/create-team'

import { UpdateTeamController } from './controllers/team/update-team-controller'
import { UpdateTeamUseCase } from '@/domain/project/application/use-cases/update-team'
import { RemoveTeamController } from './controllers/team/remove-team-controller'
import { RemoveTeamUseCase } from '@/domain/project/application/use-cases/remove-team'
import { UpdateMatchStatusController } from './controllers/match/update-match-status.controller'
import { UpdateMatchDateController } from './controllers/match/update-match-date.controller'
import { UpdateRoundNameController } from './controllers/round/update-round-name.controller'
import { UpdateRoundStatusController } from './controllers/round/update-round-status.controller'
import { UpdateMatchDateUseCase } from '@/domain/project/application/use-cases/update-match-date'
import { UpdateMatchStatusUseCase } from '@/domain/project/application/use-cases/update-match-status'
import { UpdateRoundNameUseCase } from '@/domain/project/application/use-cases/update-round-name'
import { UpdateRoundStatusUseCase } from '@/domain/project/application/use-cases/update-round-status'
import { RemoveRoundUseCase } from '@/domain/project/application/use-cases/remove-round'
import { RemoveRoundController } from './controllers/round/remove-round.controller'
import { RemoveMatchController } from './controllers/match/remove-match.controller'
import { RemoveMatchUseCase } from '@/domain/project/application/use-cases/remove-match'
import { CreateRoundController } from './controllers/round/create-round.controller'
import { CreateRoundUseCase } from '@/domain/project/application/use-cases/create-round'
import { CreatePredictionUseCase } from '@/domain/project/application/use-cases/create-prediction'
import { CreatePredictionController } from './controllers/prediction/create-prediction.controller'
import { CreateChampionshipUseCase } from '@/domain/project/application/use-cases/create-championship'
import { CreateChampionshipController } from './controllers/championship/create-championship-controller'
import { CreateMatchController } from './controllers/match/create-match.controller'
import { CreateMatchUseCase } from '@/domain/project/application/use-cases/create-match'
import { UpdateChampionshipNameUseCase } from '@/domain/project/application/use-cases/update-championship-name'
import { UpdateChampionshipNameController } from './controllers/championship/update-championship-name-controller'
import { UpdateChampionshipStatusUseCase } from '@/domain/project/application/use-cases/update-championship-status'
import { UpdateChampionshipStatusController } from './controllers/championship/update-championship-status-controller'
import { RemoveChampionshipUseCase } from '@/domain/project/application/use-cases/remove-championship'
import { RemoveChampionshipController } from './controllers/championship/remove-championship-controller'
import { UpdateScoreController } from './controllers/match/update-score.controller'
import { UpdateScoreUseCase } from '@/domain/project/application/use-cases/update-score-match'
import { FetchRoundsChampionshipUseCase } from '@/domain/project/application/use-cases/fetch-rounds-championship'
import { FetchRoundsChampionshipController } from './controllers/round/fetch-rounds-championship.controller'
import { FetchMatchController } from './controllers/match/fetch-match.controller'
import { FetchMatchUseCase } from '@/domain/project/application/use-cases/fetch-match'

@Module({
  imports: [DatabaseModule, CryptographyModule, JobsModule],
  controllers: [
    AuthenticateController,
    CreateAccountController,
    ResetPasswordController,
    SendCodeResetPasswordController,
    ResendVerificationCodeController,
    VerificationCodeController,
    CreateTeamController,
    CreateMatchController,
    UpdateMatchStatusController,
    UpdateMatchDateController,
    UpdateRoundNameController,
    UpdateRoundStatusController,
    UpdateTeamController,
    RemoveTeamController,
    RemoveRoundController,
    RemoveMatchController,
    CreateRoundController,
    CreatePredictionController,
    CreateChampionshipController,
    UpdateChampionshipNameController,
    UpdateChampionshipStatusController,
    RemoveChampionshipController,
    UpdateScoreController,
    FetchRoundsChampionshipController,
    FetchMatchController,
  ],
  providers: [
    RegisterUserUseCase,
    AuthenticateUserUseCase,
    ResendVerificationCodeUseCase,
    EnvService,
    SendSmsUseCase,
    SendVerificationCodeResetPasswordUseCase,
    VerificationCodeUseCase,
    VerificationCodeResetPasswordUseCase,
    CreateTeamUseCase,
    UpdateTeamUseCase,
    RemoveTeamUseCase,
    UpdateMatchDateUseCase,
    UpdateMatchStatusUseCase,
    UpdateRoundNameUseCase,
    UpdateRoundStatusUseCase,
    RemoveRoundUseCase,
    RemoveMatchUseCase,
    CreateRoundUseCase,
    CreatePredictionUseCase,
    CreateChampionshipUseCase,
    CreateMatchUseCase,
    UpdateChampionshipNameUseCase,
    UpdateChampionshipStatusUseCase,
    RemoveChampionshipUseCase,
    UpdateScoreUseCase,
    FetchRoundsChampionshipUseCase,
    FetchMatchUseCase,
  ],
})
export class HttpModule {}
