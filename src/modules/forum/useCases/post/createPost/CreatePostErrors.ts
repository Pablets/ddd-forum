import { UseCaseError } from '../../../../../shared/core/UseCaseError';
import { Result } from '../../../../../shared/core/Result';

export class MemberDoesntExistError extends Result<UseCaseError> {
  constructor() {
    super(false, {
      message: `A forum member doesn't exist for this account.`,
    } as UseCaseError);
  }
}
