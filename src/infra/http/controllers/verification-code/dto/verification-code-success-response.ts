import { ApiProperty } from '@nestjs/swagger'

export class VerificationCodeSuccessResponseDto {
  @ApiProperty()
  access_token!: string
}
