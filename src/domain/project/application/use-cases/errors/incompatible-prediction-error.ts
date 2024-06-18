import { UseCaseError } from '@/core/errors/use-case-error'

export class IncompatiblePrediction extends Error implements UseCaseError {
  constructor() {
    super(`Palpite incompatível.`)
  }
}
