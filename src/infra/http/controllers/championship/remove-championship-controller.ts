import { BadRequestException, Body, ConflictException, Controller, Delete, HttpCode, Patch } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { z } from "zod";
import { RemoveChampionshipUseCase } from "@/domain/project/application/use-cases/remove-championship";
import { Roles } from "@/infra/auth/roles.decorator";
import { RemoveChampionshipDto } from "./dto/remove-championship-dto";
import { ChampionshipDoesNotExistYetError } from "@/domain/project/application/use-cases/errors/championship-doesnt-exist-yet-error";

const removeChampionshipBodySchema = z.object({
  championshipName: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(removeChampionshipBodySchema)

@ApiTags('championship')
@Controller('/championship')
export class RemoveChampionshipController {
  constructor(private removeChampionshipUseCase: RemoveChampionshipUseCase) {}

  @Delete()
  @HttpCode(204)
  @Roles(['ADMIN'])
  async handle(@Body(bodyValidationPipe) body: RemoveChampionshipDto) {
    const { championshipName } = body

    const result = await this.removeChampionshipUseCase.execute({
      championshipName
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case ChampionshipDoesNotExistYetError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}