
import { UseCase } from "../../../../shared/core/UseCase";
import { IAuthService } from "../../services/authService";
import { Either, Result, left, right } from "../../../../shared/core/Result";
import { UnexpectedError } from "../../../../shared/core/AppError";
import { JWTToken } from "../../domain/jwt";
import { RefreshTokenNotFound, UserNotFoundOrDeletedError } from "./RefreshAccessTokenErrors";
import { IUserRepo } from "../../repos/userRepo";
import { User } from "../../domain/user";
import { RefreshAccessTokenDTO } from "./RefreshAccessTokenDTO";

type Response = Either<
  RefreshTokenNotFound |
  UnexpectedError,
  Result<JWTToken>
>

export class RefreshAccessToken implements UseCase<RefreshAccessTokenDTO, Promise<Response>> {
  private userRepo: IUserRepo;
  private authService: IAuthService;

  constructor (userRepo: IUserRepo, authService: IAuthService) {
    this.userRepo = userRepo;
    this.authService = authService;
  }

  public async execute (req: RefreshAccessTokenDTO): Promise<Response> {
    const { refreshToken } = req;
    let user: User;
    let username: string;

    try {

      // Get the username for the user that owns the refresh token
      try {
        username = await this.authService.getUserNameFromRefreshToken(refreshToken);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        return left(new RefreshTokenNotFound());
      }


      try {
        // get the user by username
        user = await this.userRepo.getUserByUserName(username);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        return left(new UserNotFoundOrDeletedError());
      }

      const accessToken: JWTToken = this.authService.signJWT({
        username: user.username.value,
        email: user.email.value,
        isEmailVerified: user.isEmailVerified,
        userId: user.userId.getStringValue(),
        adminUser: user.isAdminUser,
      });

      // sign a new jwt for that user
      user.setAccessToken(accessToken, refreshToken);

      // save it
      await this.authService.saveAuthenticatedUser(user);

      // return the new access token
      return right(Result.ok<JWTToken>(accessToken))

    } catch (err) {
      return left(new UnexpectedError(err));
    }
  }
}