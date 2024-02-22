import { ApiProperty } from '@nestjs/swagger'

export class SendVerificationResetPasswordCodeDto {
  @ApiProperty()
  phone!: string
}
