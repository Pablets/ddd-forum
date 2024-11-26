import { Either, Result } from '../../../../../shared/core/Result';
import { UnexpectedError } from '../../../../../shared/core/AppError';
import { PostNotFoundError } from './EditPostErrors';

export type EditPostResponse = Either<
  PostNotFoundError | UnexpectedError | Result<any>,
  Result<void>
>;
