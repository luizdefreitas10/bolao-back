import { ApiProperty } from '@nestjs/swagger'

export class AuthDto {
  @ApiProperty()
  userName!: string

  @ApiProperty()
  password!: string
}
