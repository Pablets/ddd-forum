
import { UseCaseError } from "../../../../shared/core/UseCaseError"
import { Result } from "../../../../shared/core/Result"

export namespace LoginWithSocialUseCaseErrors {

  export class UserNameDoesntExistError extends Result<UseCaseError> {
    constructor () {
      super(false, {
        message: `Username or password incorrect.`
      } as UseCaseError)
    }
  }

  export class AccessTokenNotValidError extends Result<UseCaseError> {
    constructor () {
      super(false, {
        message: `Access token not valid error.`
      } as UseCaseError)
    }
  }
}