import { ApiProperty } from '@nestjs/swagger'

export class ResendVerificationCodeDto {
  @ApiProperty()
  userId!: string
}
