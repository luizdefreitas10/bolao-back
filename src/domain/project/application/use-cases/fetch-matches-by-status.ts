import { Either } from "@/core/either"
import { Match } from "../../enterprise/entities/match"
import { Injectable } from "@nestjs/common"


interface FetchMatchesByStatusUseCaseRequest {
  roundId: string
  page: number
}

type FetchMatchesByStatusUseCaseResponse = Either<
  null,
  {
    matches: Match[]
  }
>

@Injectable()
export class FetchMatchesByStatusUseCase {
  constructor(private questionCommentsRepository: QuestionCommentsRepository) {}

  async execute({
    questionId,
    page,
  }: FetchQuestionCommentsUseCaseRequest): Promise<FetchQuestionCommentsUseCaseResponse> {
    const comments =
      await this.questionCommentsRepository.findManyByQuestionIdWithAuthor(
        questionId,
        {
          page,
        },
      )

    return right({
      comments,
    })
  }
}
