import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  ConflictException,
  Patch,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { ApiTags } from '@nestjs/swagger'
import { Roles } from '@/infra/auth/roles.decorator'
import { UpdateTeamUseCase } from '@/domain/project/application/use-cases/update-team'
import { UpdateTeamDto } from './dto/update-team-dto'
import { TeamNotFoundError } from '@/domain/project/application/use-cases/errors/team-not-found'

const updateTeamBodySchema = z.object({
  teamName: z.string(),
  newTeamName: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(updateTeamBodySchema)

@ApiTags('team')
@Controller('/team')
export class UpdateTeamController {
  constructor(private updateTeamUseCase: UpdateTeamUseCase) {}

  @Patch()
  @HttpCode(204)
  @Roles(['ADMIN'])
  async handle(@Body(bodyValidationPipe) body: UpdateTeamDto) {
    const { teamName, newTeamName } = body

    const result = await this.updateTeamUseCase.execute({
      teamName,
      newTeamName,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case TeamNotFoundError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
