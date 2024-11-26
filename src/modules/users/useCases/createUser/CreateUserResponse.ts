import { Either, Result } from '../../../../shared/core/Result';
import { EmailAlreadyExistsError, UsernameTakenError } from './CreateUserErrors';
import { UnexpectedError } from '../../../../shared/core/AppError';

export type CreateUserResponse = Either<
  EmailAlreadyExistsError | UsernameTakenError | UnexpectedError | Result<any>,
  Result<void>
>;
