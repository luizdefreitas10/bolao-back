import { VerificationCode } from '../../enterprise/entities/verificationCode'

export abstract class VerificationCodeRepository {
  abstract create(verificationCode: VerificationCode): Promise<VerificationCode>
  abstract findByUserAndPermissionTimeResend(
    userId: string,
    time: Date,
  ): Promise<VerificationCode | null>

  abstract findByUserAndCode(
    userId: string,
    code: string,
  ): Promise<VerificationCode | null>

  abstract findByUser(userId: string): Promise<VerificationCode[]>
}
