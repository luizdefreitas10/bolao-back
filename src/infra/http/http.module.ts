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

@Module({
  imports: [DatabaseModule, CryptographyModule, JobsModule],
  controllers: [
    AuthenticateController,
    CreateAccountController,
    ResetPasswordController,
    SendCodeResetPasswordController,
    ResendVerificationCodeController,
    VerificationCodeController,
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
  ],
})
export class HttpModule {}
