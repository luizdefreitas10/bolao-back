import { UseCaseError } from '@/core/errors/use-case-error'

export class FormatUsernameNotValidError extends Error implements UseCaseError {
  constructor() {
    super(
      'O formato válido para username são números, letras minúsculas, ponto e sublinhado.',
    )
  }
}
