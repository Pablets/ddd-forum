
import { UseCaseError } from "../../../../shared/core/UseCaseError"
import { Result } from "../../../../shared/core/Result"

export class UserNameDoesntExistError extends Result<UseCaseError> {
  constructor () {
    super(false, {
      message: `Username or password incorrect.`
    } as UseCaseError)
  }
}

export class PasswordDoesntMatchError extends Result<UseCaseError> {
  constructor () {
    super(false, {
      message: `Password doesnt match error.`
    } as UseCaseError)
  }
}