import {
  BadRequestException,
  Controller,
  Get,
  Param,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { FetchRoundsByMatchStatusUseCase } from '@/domain/project/application/use-cases/fetch-rounds-by-match-status'
import { AdminRoundPresenter } from '../../presenters/list-presenters'
import { Roles } from '@/infra/auth/roles.decorator'

const matchStatusParamSchema = z.enum([
  'WAITING',
  'IN_PROGRESS',
  'DONE',
  'CANCELED',
  'INACTIVE',
])

const paramValidationPipe = new ZodValidationPipe(matchStatusParamSchema)

@ApiTags('round')
@Controller('/rounds/status/:status')
export class FetchRoundsByMatchStatusController {
  constructor(
    private fetchRoundsByMatchStatus: FetchRoundsByMatchStatusUseCase,
  ) {}

  @Get()
  @Roles(['ADMIN'])
  async handle(@Param('status', paramValidationPipe) status: string) {
    const result = await this.fetchRoundsByMatchStatus.execute({
      status: status as z.infer<typeof matchStatusParamSchema>,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const rounds = result.value.rounds.map(AdminRoundPresenter.toHTTP)

    return { rounds }
  }
}
