import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { ApiTags } from '@nestjs/swagger'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common'
import { Roles } from '@/infra/auth/roles.decorator'
import { CreateChampionshipUseCase } from '@/domain/project/application/use-cases/create-championship'
import { CreateChampionshipDto } from './dto/create-championship-dto'
import { ChampionshipAlreadyExistsError } from '@/domain/project/application/use-cases/errors/championship-already-exists-error'
import { CreateChampionshipPresenter } from '../../presenters/http-create-championship-presenter'

const createChampionshipBodySchema = z.object({
  name: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(createChampionshipBodySchema)

@ApiTags('championship')
@Controller('/championship')
export class CreateChampionshipController {
  constructor(private createChampionshipUseCase: CreateChampionshipUseCase) {}

  @Post()
  @HttpCode(201)
  @Roles(['ADMIN'])
  async handle(@Body(bodyValidationPipe) body: CreateChampionshipDto) {
    const { name } = body

    const result = await this.createChampionshipUseCase.execute({
      name,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ChampionshipAlreadyExistsError:
          throw new ChampionshipAlreadyExistsError()
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { championship } = result.value

    return { championship: CreateChampionshipPresenter.toHTTP(championship) }
  }
}
