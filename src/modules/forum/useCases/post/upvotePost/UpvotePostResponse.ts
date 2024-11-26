import { Either, Result } from '../../../../../shared/core/Result';
import { AlreadyUpvotedError, MemberNotFoundError, PostNotFoundError } from './UpvotePostErrors';
import { UnexpectedError } from '../../../../../shared/core/AppError';

export type UpvotePostResponse = Either<
  MemberNotFoundError | AlreadyUpvotedError | PostNotFoundError | UnexpectedError | Result<any>,
  Result<void>
>;
