import { z } from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { ApiTags } from "@nestjs/swagger";
import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Param,
  Query,
} from "@nestjs/common";
import { Roles } from "@/infra/auth/roles.decorator";

const pageQueryParamSchema = z
  .string()
  .optional()
  .default("1")
  .transform(Number)
  .pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

const fetchMatchesByStatusBodySchema = 

@ApiTags("match")
@Controller("/match/:roundId/status")
export class FetchMatchByStatusController {
  constructor(private fetchMatchesByStatus: FetchMatchesByStatus) {}

  @Get()
  @HttpCode(200)
  @Roles(["ADMIN"])
  async handle(
    @Query("page", queryValidationPipe) page: PageQueryParamSchema,
    @Param("roundId") roundId: number
  ) {
    const result = await this.fetchMatchesByStatus.execute({
      page,
      roundId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
