import { UseCaseError } from '@/core/errors/use-case-error'

export class FileResendNotAllowedInTimeError
  extends Error
  implements UseCaseError
{
  constructor() {
    super(`Sending limit reached. Please wait 1 minute for the next request.`)
  }
}
