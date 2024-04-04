import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { ApiTags } from '@nestjs/swagger'
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
} from '@nestjs/common'
import { Roles } from '@/infra/auth/roles.decorator'
import { FetchMatchesByStatusDto } from './dto/fetch-matches-by-status-dto'
import { FetchMatchesByStatusUseCase } from '@/domain/project/application/use-cases/fetch-matches-by-status'
import { MatchPresenter } from '../../presenters/match-presenter'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

const ChampionshipStatusEnum = z.enum([
  'WAITING',
  'IN_PROGRESS',
  'DONE',
  'CANCELED',
])

const fetchMatchesByStatusBodySchema = z.object({
  status: ChampionshipStatusEnum,
})

const bodyValidationPipe = new ZodValidationPipe(fetchMatchesByStatusBodySchema)

@ApiTags('match')
@Controller('/match/by-status')
export class FetchMatchesByStatusController {
  constructor(
    private fetchMatchesByStatusUseCase: FetchMatchesByStatusUseCase,
  ) {}

  @Post()
  @HttpCode(200)
  @Roles(['ADMIN'])
  async handle(
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
    @Body(bodyValidationPipe) body: FetchMatchesByStatusDto,
  ) {
    const { status } = body

    const result = await this.fetchMatchesByStatusUseCase.execute({
      page,
      status,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const matchesByStatus = result.value.matches

    const matches = matchesByStatus.map(MatchPresenter.toHTTP)

    return { matches }
  }
}
