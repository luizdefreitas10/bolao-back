import { BadRequestException, Controller, Get, Param } from '@nestjs/common'
import { FetchMatchUseCase } from '@/domain/project/application/use-cases/fetch-match'
import { MatchPresenter } from '../../presenters/match-presenter'

@Controller('/match/:matchId')
export class FetchMatchController {
  constructor(private fetchMatchUseCase: FetchMatchUseCase) {}

  @Get()
  async handle(@Param('matchId') matchId: string) {
    if (!matchId) {
      throw new BadRequestException()
    }
    const result = await this.fetchMatchUseCase.execute({
      matchId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const match = result.value.match

    const presenter = MatchPresenter.toHTTP(match)
    return { match: presenter }
  }
}
