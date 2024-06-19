import { ApiProperty } from '@nestjs/swagger'

export class CreateUserDto {
  @ApiProperty()
  fullName!: string

  @ApiProperty()
  birthdate!: Date

  @ApiProperty()
  phone!: string

  @ApiProperty()
  password!: string

  @ApiProperty()
  email?: string
}
