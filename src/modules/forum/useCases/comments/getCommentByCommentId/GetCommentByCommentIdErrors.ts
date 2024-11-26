import { Result } from '../../../../../shared/core/Result';
import { UseCaseError } from '../../../../../shared/core/UseCaseError';

export class CommentNotFoundError extends Result<UseCaseError> {
  constructor(commentId: string) {
    super(false, {
      message: `Couldn't find a comment by comment id {${commentId}}.`,
    } as UseCaseError);
  }
}
