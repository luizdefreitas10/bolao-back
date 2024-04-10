import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { RoundsPresenter } from '../../presenters/rounds-presenter'
import { FetchRoundsActiveChampionshipUseCase } from '@/domain/project/application/use-cases/fetch-rounds-active-championship'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/rounds/:champId')
export class FetchRoundsActiveChampionshipController {
  constructor(
    private fetchRoundsActiveChampionship: FetchRoundsActiveChampionshipUseCase,
  ) {}

  @Get()
  async handle(
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
    @Param('champId') champId: string,
  ) {
    const result = await this.fetchRoundsActiveChampionship.execute({
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
