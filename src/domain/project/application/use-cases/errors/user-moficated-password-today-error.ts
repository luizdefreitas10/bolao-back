import { UseCaseError } from '@/core/errors/use-case-error'

export class UserModificatedPasswordTodayError
  extends Error
  implements UseCaseError
{
  constructor() {
    super(`Você só pode alterar a senha uma vez no dia.`)
  }
}
