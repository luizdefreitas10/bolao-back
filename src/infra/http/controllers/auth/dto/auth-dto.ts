import { ApiProperty } from '@nestjs/swagger'

export class AuthDto {
  @ApiProperty()
  phone!: string

  @ApiProperty()
  password!: string
}
