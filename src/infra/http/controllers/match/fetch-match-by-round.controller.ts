import {
  BadRequestException,
  ConflictException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common'
import { MatchPresenter } from '../../presenters/match-presenter'
import { FetchMatchByRoundUseCase } from '@/domain/project/application/use-cases/fetch-matchs-by-round'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { z } from 'zod'
import { RoundNotFoundError } from '@/domain/project/application/use-cases/errors/round-not-found-error'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/matchs/:roundId')
export class FetchMatchByRoundController {
  constructor(private fetchMatchUseCase: FetchMatchByRoundUseCase) {}

  @Get()
  async handle(
    @Param('roundId') roundId: string,
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
  ) {
    if (!roundId) {
      throw new BadRequestException()
    }
    const result = await this.fetchMatchUseCase.execute({
      roundId,
      page,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case RoundNotFoundError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const matchs = result.value.matchs

    const presenter = matchs.map(MatchPresenter.toHTTP)
    return { matchs: presenter }
  }
}
