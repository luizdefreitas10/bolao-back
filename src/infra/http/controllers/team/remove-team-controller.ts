import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  ConflictException,
  Delete,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { ApiTags } from '@nestjs/swagger'
import { TeamNotFoundError } from '@/domain/project/application/use-cases/errors/team-not-found'
import { RemoveTeamUseCase } from '@/domain/project/application/use-cases/remove-team'
import { RemoveTeamDto } from './dto/remove-team-dto'
import { Roles } from '@/infra/auth/roles.decorator'

const removeTeamBodySchema = z.object({
  teamName: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(removeTeamBodySchema)

@ApiTags('team')
@Controller('/team')
export class RemoveTeamController {
  constructor(private removeTeamUseCase: RemoveTeamUseCase) {}

  @Delete()
  @HttpCode(204)
  @Roles(['ADMIN'])
  async handle(@Body(bodyValidationPipe) body: RemoveTeamDto) {
    const { teamName } = body

    const result = await this.removeTeamUseCase.execute({
      teamName,
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
