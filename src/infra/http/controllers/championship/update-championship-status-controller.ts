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
import { ChampionshipDoesNotExistYetError } from '@/domain/project/application/use-cases/errors/championship-doesnt-exist-yet-error'
import { UpdateChampionshipStatusUseCase } from '@/domain/project/application/use-cases/update-championship-status'
import { UpdateChampionshipStatusDto } from './dto/update-championship-status-dto'
import { UpdateChampionshipStatusPresenter } from '../../presenters/http-update-championship-status-presenter'

const ChampionshipStatusEnum = z.enum([
  'WAITING',
  'IN_PROGRESS',
  'DONE',
  'CANCELED',
])

const updateChampionshipStatusBodySchema = z.object({
  championshipName: z.string(),
  status: ChampionshipStatusEnum,
})

const bodyValidationPipe = new ZodValidationPipe(
  updateChampionshipStatusBodySchema,
)

@ApiTags('championship')
@Controller('/championship/update-status')
export class UpdateChampionshipStatusController {
  constructor(
    private updateChampionshipStatusUseCase: UpdateChampionshipStatusUseCase,
  ) {}

  @Patch()
  @HttpCode(200)
  @Roles(['ADMIN'])
  async handle(@Body(bodyValidationPipe) body: UpdateChampionshipStatusDto) {
    const { championshipName, status } = body

    const result = await this.updateChampionshipStatusUseCase.execute({
      championshipName,
      status,
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
      championship: UpdateChampionshipStatusPresenter.toHTTP(championship),
    }
  }
}
