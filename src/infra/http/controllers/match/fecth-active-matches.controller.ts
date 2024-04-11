import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { ApiTags } from '@nestjs/swagger'
import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
} from '@nestjs/common'
import { Roles } from '@/infra/auth/roles.decorator'
import { FetchActiveMatchesUseCase } from '@/domain/project/application/use-cases/fetch-active-matches'
import { MatchPresenter } from '../../presenters/match-presenter'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@ApiTags('match')
@Controller('/match')
export class FetchActiveMatchesController {
  constructor(private fetchActiveMatchesUseCase: FetchActiveMatchesUseCase) {}

  @Get('/active-matches')
  @HttpCode(200)
  @Roles(['ADMIN'])
  async handle(@Query('page', queryValidationPipe) page: PageQueryParamSchema) {
    console.log('oi entramos')
    console.log(page)

    const result = await this.fetchActiveMatchesUseCase.execute({
      page,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const activeMatches = result.value.matches

    const matches = activeMatches.map(MatchPresenter.toHTTP)

    return { matches }
  }
}
