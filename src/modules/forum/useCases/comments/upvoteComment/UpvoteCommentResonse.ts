import { Either, Result } from '../../../../../shared/core/Result';
import {
  CommentNotFoundError,
  MemberNotFoundError,
  PostNotFoundError,
} from './UpvoteCommentErrors';
import { UnexpectedError } from '../../../../../shared/core/AppError';

export type UpvoteCommentResponse = Either<
  PostNotFoundError | CommentNotFoundError | MemberNotFoundError | UnexpectedError | Result<any>,
  Result<void>
>;
