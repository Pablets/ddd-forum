import { Either, Result } from '../../../../../shared/core/Result';
import {
  AlreadyDownvotedError,
  MemberNotFoundError,
  PostNotFoundError,
} from './DownvotePostErrors';
import { UnexpectedError } from '../../../../../shared/core/AppError';

export type DownvotePostResponse = Either<
  MemberNotFoundError | AlreadyDownvotedError | PostNotFoundError | UnexpectedError | Result<any>,
  Result<void>
>;
