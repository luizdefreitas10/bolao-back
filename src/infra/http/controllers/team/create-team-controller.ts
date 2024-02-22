import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  ConflictException,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { ApiTags } from '@nestjs/swagger'
import { CreateTeamDto } from './dto/create-team-dto'
import { CreateTeamUseCase } from '@/domain/project/application/use-cases/create-team'
import { ExistTeamError } from '@/domain/project/application/use-cases/errors/exist-team-error'
import { Roles } from '@/infra/auth/roles.decorator'

const createTeamBodySchema = z.object({
  name: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(createTeamBodySchema)

@ApiTags('team')
@Controller('/team')
export class CreateTeamController {
  constructor(private createTeam: CreateTeamUseCase) {}

  @Post()
  @HttpCode(201)
  @Roles(['ADMIN'])
  async handle(@Body(bodyValidationPipe) body: CreateTeamDto) {
    const { name } = body

    const result = await this.createTeam.execute({
      name,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case ExistTeamError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { team } = result.value

    return { teamId: team.id.toString() }
  }
}
