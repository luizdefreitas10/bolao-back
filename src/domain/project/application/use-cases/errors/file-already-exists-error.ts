import { UseCaseError } from '@/core/errors/use-case-error'

export class FileAlreadyExistsError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`File "${identifier}" already exists.`)
  }
}
