import {
  BadRequestException,
  Controller,
  Get,
  Param,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { FetchRoundsByChampionshipAndStatusUseCase } from '@/domain/project/application/use-cases/fetch-rounds-by-championship-and-status'
import { RoundListPresenter } from '../../presenters/list-presenters'
import { Roles } from '@/infra/auth/roles.decorator'

const roundStatusParamSchema = z.enum([
  'WAITING',
  'IN_PROGRESS',
  'DONE',
  'CANCELED',
  'INACTIVE',
])

const paramValidationPipe = new ZodValidationPipe(roundStatusParamSchema)

@ApiTags('round')
@Controller('/rounds/:champId/status/:status')
export class FetchRoundsByChampionshipAndStatusController {
  constructor(
    private fetchRoundsByChampionshipAndStatus: FetchRoundsByChampionshipAndStatusUseCase,
  ) {}

  @Get()
  @Roles(['ADMIN'])
  async handle(
    @Param('champId') champId: string,
    @Param('status', paramValidationPipe) status: string,
  ) {
    const result = await this.fetchRoundsByChampionshipAndStatus.execute({
      champId,
      status: status as z.infer<typeof roundStatusParamSchema>,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const rounds = result.value.rounds.map(RoundListPresenter.toHTTP)

    return { rounds }
  }
}
