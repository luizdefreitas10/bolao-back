import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Patch,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { ApiTags } from '@nestjs/swagger'
import { Roles } from '@/infra/auth/roles.decorator'
import { UpdateChampionshipNameUseCase } from '@/domain/project/application/use-cases/update-championship-name'
import { UpdateChampionshipNameDto } from './dto/update-championship-name-dto'
import { ChampionshipDoesNotExistYetError } from '@/domain/project/application/use-cases/errors/championship-doesnt-exist-yet-error'
import { UpdateChampionshipNamePresenter } from '../../presenters/http-update-championship-name-presenter'

const updateChampionshipNameBodySchema = z.object({
  championshipName: z.string(),
  newChampionshipName: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(
  updateChampionshipNameBodySchema,
)

@ApiTags('championship')
@Controller('/championship/update-name')
export class UpdateChampionshipNameController {
  constructor(
    private updateChampionshipNameUseCase: UpdateChampionshipNameUseCase,
  ) {}

  @Patch()
  @HttpCode(200)
  @Roles(['ADMIN'])
  async handle(@Body(bodyValidationPipe) body: UpdateChampionshipNameDto) {
    const { championshipName, newChampionshipName } = body

    const result = await this.updateChampionshipNameUseCase.execute({
      championshipName,
      newChampionshipName,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case ChampionshipDoesNotExistYetError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { championship } = result.value

    return {
      championship: UpdateChampionshipNamePresenter.toHTTP(championship),
    }
  }
}
