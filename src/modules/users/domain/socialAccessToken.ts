import { ValueObject } from '../../../shared/domain/ValueObject';
import { Guard } from '../../../shared/core/Guard';
import { Result } from '../../../shared/core/Result';

export interface IUserSocialAccessTokenProps {
  accessToken: string;
}

export class SocialAccessToken extends ValueObject<IUserSocialAccessTokenProps> {
  get value(): string {
    return this.props.accessToken;
  }

  private constructor(props: IUserSocialAccessTokenProps) {
    super(props);
  }

  public static create(props: IUserSocialAccessTokenProps): Result<SocialAccessToken> {
    const propsResult = Guard.againstNullOrUndefined(props.accessToken, 'accessToken');

    if (propsResult.isFailure) {
      return Result.fail<SocialAccessToken>(propsResult.getErrorValue());
    } else {
      return Result.ok<SocialAccessToken>(
        new SocialAccessToken({
          accessToken: props.accessToken,
        })
      );
    }
  }
}
