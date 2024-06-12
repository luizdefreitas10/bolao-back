import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { FetchRoundsChampionshipUseCase } from '@/domain/project/application/use-cases/fetch-rounds-championship'
import { RoundsPresenter } from '../../presenters/rounds-presenter'
import { ApiTags } from '@nestjs/swagger'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@ApiTags('round')
@Controller('/all-rounds/:champId')
export class FetchRoundsChampionshipController {
  constructor(
    private fetchRoundsChampionship: FetchRoundsChampionshipUseCase,
  ) {}

  @Get()
  async handle(
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
    @Param('champId') champId: string,
  ) {
    const result = await this.fetchRoundsChampionship.execute({
      champId,
      page,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const rounds = result.value.rounds
    const presenter = rounds.map(RoundsPresenter.toHTTP)
    return { rounds: presenter }
  }
}
