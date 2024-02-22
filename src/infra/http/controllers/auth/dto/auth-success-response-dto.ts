import { ApiProperty } from '@nestjs/swagger'

export class AuthSuccessResponseDto {
  @ApiProperty()
  access_token!: string
}
