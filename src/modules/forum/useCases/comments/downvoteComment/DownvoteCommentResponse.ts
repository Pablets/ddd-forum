import { Either, Result } from '../../../../../shared/core/Result';

import { UnexpectedError } from '../../../../../shared/core/AppError';
import {
  CommentNotFoundError,
  MemberNotFoundError,
  PostNotFoundError,
} from './DownvoteCommentErrors';

export type DownvoteCommentResponse = Either<
  CommentNotFoundError | MemberNotFoundError | PostNotFoundError | UnexpectedError | Result<any>,
  Result<void>
>;
