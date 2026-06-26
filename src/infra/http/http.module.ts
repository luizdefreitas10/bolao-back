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
import { CreatePredictionsController } from './controllers/prediction/create-predictions.controller'
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
import { FetchMatchesByStatusController } from './controllers/match/fetch-matches-by-status.controller'
import { FetchMatchesByStatusUseCase } from '@/domain/project/application/use-cases/fetch-matches-by-status'
import { FetchMatchByRoundUseCase } from '@/domain/project/application/use-cases/fetch-matchs-by-round'
import { FetchMatchByRoundController } from './controllers/match/fetch-match-by-round.controller'

import { FetchActiveMatchesController } from './controllers/match/fecth-active-matches.controller'
import { FetchActiveMatchesUseCase } from '@/domain/project/application/use-cases/fetch-active-matches'

import { FetchRoundsActiveChampionshipController } from './controllers/round/fetch-rounds-active-championship.controller'
import { FetchRoundsActiveChampionshipUseCase } from '@/domain/project/application/use-cases/fetch-rounds-active-championship'
import { FetchPredictionsController } from './controllers/prediction/fetch-predictions-by-user'
import { FetchPredicitonByUserUseCase } from '@/domain/project/application/use-cases/fetch-predictions-by-user'
import { CreatePlayerController } from './controllers/player/create-player.controller'
import { CreatePlayerUseCase } from '@/domain/project/application/use-cases/create-player'
import { FetchPlayersController } from './controllers/player/fetch-players-by-round-and-teams'
import { FetchPlayerByTeamAndRoundUseCase } from '@/domain/project/application/use-cases/fetch-players-by-round-and-team'
import { CreatePredictionLastPlayerController } from './controllers/prediciton-last-player/create-prediction-last-player'
import { CreatePredictionLastPlayerUseCase } from '@/domain/project/application/use-cases/create-prediction-last-player'
import { FetchChampionshipsUseCase } from '@/domain/project/application/use-cases/fetch-championships'
import { FetchChampionshipsController } from './controllers/championship/fetch-championships.controller'
import { FetchChampionshipsWithWaitingRoundsUseCase } from '@/domain/project/application/use-cases/fetch-championships-with-waiting-rounds'
import { FetchChampionshipsWithWaitingRoundsController } from './controllers/championship/fetch-championships-with-waiting-rounds.controller'
import { FetchTeamsUseCase } from '@/domain/project/application/use-cases/fetch-teams'
import { FetchTeamsController } from './controllers/team/fetch-teams.controller'
import { FetchRoundsByMatchStatusUseCase } from '@/domain/project/application/use-cases/fetch-rounds-by-match-status'
import { FetchRoundsByMatchStatusController } from './controllers/round/fetch-rounds-by-match-status.controller'
import { FetchRoundsByChampionshipAndStatusUseCase } from '@/domain/project/application/use-cases/fetch-rounds-by-championship-and-status'
import { FetchRoundsByChampionshipAndStatusController } from './controllers/round/fetch-rounds-by-championship-and-status.controller'
import { FetchPlayersByTeamUseCase } from '@/domain/project/application/use-cases/fetch-players-by-team'
import { FetchPlayersByTeamController } from './controllers/player/fetch-players-by-team.controller'
import { UpdatePlayersMatchUseCase } from '@/domain/project/application/use-cases/update-players-match'
import { UpdatePlayersMatchController } from './controllers/player/update-players-match.controller'
import { HealthController } from './controllers/health/health.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule, JobsModule.register()],
  controllers: [
    HealthController,
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
    CreatePredictionsController,
    CreateChampionshipController,
    UpdateChampionshipNameController,
    UpdateChampionshipStatusController,
    RemoveChampionshipController,
    UpdateScoreController,
    FetchRoundsChampionshipController,
    FetchRoundsByMatchStatusController,
    FetchRoundsByChampionshipAndStatusController,
    FetchActiveMatchesController,
    FetchMatchController,
    FetchMatchesByStatusController,
    FetchMatchByRoundController,
    FetchRoundsActiveChampionshipController,
    FetchChampionshipsWithWaitingRoundsController,
    FetchChampionshipsController,
    FetchTeamsController,
    FetchPredictionsController,
    CreatePlayerController,
    UpdatePlayersMatchController,
    FetchPlayersController,
    FetchPlayersByTeamController,
    CreatePredictionLastPlayerController,
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
    FetchActiveMatchesUseCase,
    FetchMatchUseCase,
    FetchMatchesByStatusUseCase,
    FetchMatchByRoundUseCase,
    FetchActiveMatchesUseCase,
    FetchRoundsActiveChampionshipUseCase,
    FetchPredicitonByUserUseCase,
    CreatePlayerUseCase,
    FetchPlayerByTeamAndRoundUseCase,
    CreatePredictionLastPlayerUseCase,
    FetchChampionshipsUseCase,
    FetchChampionshipsWithWaitingRoundsUseCase,
    FetchTeamsUseCase,
    FetchRoundsByMatchStatusUseCase,
    FetchRoundsByChampionshipAndStatusUseCase,
    FetchPlayersByTeamUseCase,
    UpdatePlayersMatchUseCase,
  ],
})
export class HttpModule {}
