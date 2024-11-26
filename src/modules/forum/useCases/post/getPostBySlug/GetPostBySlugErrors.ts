import { Result } from '../../../../../shared/core/Result';
import { UseCaseError } from '../../../../../shared/core/UseCaseError';

export class GetPostBySlugErrors {
  static PostNotFoundError = class extends Result<UseCaseError> {
    constructor(slug: string) {
      super(false, {
        message: `Couldn't find a post by slug {${slug}}.`,
      } as UseCaseError);
    }
  };
}
