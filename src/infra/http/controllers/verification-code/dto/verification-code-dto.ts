import { ApiProperty } from '@nestjs/swagger'

export class VerificationCodeDto {
  @ApiProperty()
  userId!: string

  @ApiProperty()
  code!: string
}
