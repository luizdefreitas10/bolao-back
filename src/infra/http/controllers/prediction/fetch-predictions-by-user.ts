import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  UnprocessableEntityException,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { CurrentUser } from '@/infra/auth/currrent-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { FetchPredicitonByUserUseCase } from '@/domain/project/application/use-cases/fetch-predictions-by-user'
import { PredictionsPresenter } from '../../presenters/predictions-presenter'

@ApiTags('prediction')
@Controller('/predictions')
export class FetchPredictionsController {
  constructor(private fetchPredictions: FetchPredicitonByUserUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(@CurrentUser() user: UserPayload) {
    const result = await this.fetchPredictions.execute({
      userId: user.sub,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case UnprocessableEntityException:
          throw new UnprocessableEntityException()
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { predictions } = result.value
    const response = predictions.map(PredictionsPresenter.toHTTP)
    return { predictions: response }
  }
}
