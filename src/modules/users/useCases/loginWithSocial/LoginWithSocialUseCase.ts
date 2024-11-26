import { LoginWithSocialDTO, LoginWithSocialDTOResponse } from './LoginWithSocialDTO';
import { LoginWithSocialUseCaseErrors } from './LoginWithSocialErrors';
import { AppError } from '../../../../shared/core/AppError';
import { Either, Result, left, right } from '../../../../shared/core/Result';
import { UseCase } from '../../../../shared/core/UseCase';
import { IUserRepo } from '../../repos/userRepo';
import { IAuthService } from '../../services/authService';
import { User } from '../../domain/user';
import { UserName } from '../../domain/userName';
import { UserPassword } from '../../domain/userPassword';
import { JWTToken, RefreshToken } from '../../domain/jwt';
import { SocialAccessToken } from '../../domain/socialAccessToken';

type Response = Either<
  | LoginWithSocialUseCaseErrors.AccessTokenNotValidError
  | LoginWithSocialUseCaseErrors.UserNameDoesntExistError
  | AppError.UnexpectedError,
  Result<LoginWithSocialDTOResponse>
>;

export class LoginWithSocialUserUseCase implements UseCase<LoginWithSocialDTO, Promise<Response>> {
  private userRepo: IUserRepo;
  private authService: IAuthService;

  constructor(userRepo: IUserRepo, authService: IAuthService) {
    this.userRepo = userRepo;
    this.authService = authService;
  }

  public async execute(request: LoginWithSocialDTO): Promise<Response> {
    let user: User;
    let socialAccesToken: SocialAccessToken;

    try {
      const socialAccesTokenOrError = SocialAccessToken.create({
        accessToken: request.accessToken,
      });
      const payloadResult = Result.combine([socialAccesTokenOrError]);

      if (payloadResult.isFailure) {
        return left(Result.fail<any>(payloadResult.getErrorValue()));
      }

      socialAccesToken = socialAccesTokenOrError.getValue();

      user = await this.userRepo.getUserByAccessToken(socialAccesToken);
      const userFound = !!user;

      if (!userFound) {
        return left(new LoginWithSocialUseCaseErrors.UserNameDoesntExistError());
      }

      const accessToken: JWTToken = this.authService.signJWT({
        username: user.username.value,
        email: user.email.value,
        isEmailVerified: user.isEmailVerified,
        userId: user.userId.getStringValue(),
        adminUser: user.isAdminUser,
      });

      const refreshToken: RefreshToken = this.authService.createRefreshToken();

      user.setAccessToken(accessToken, refreshToken);

      await this.authService.saveAuthenticatedUser(user);

      return right(
        Result.ok<LoginWithSocialDTOResponse>({
          accessToken,
          refreshToken,
        })
      );
    } catch (err) {
      return left(new AppError.UnexpectedError(err.toString()));
    }
  }
}
