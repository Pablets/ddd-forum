import { UseCase } from '../../../../shared/core/UseCase';
import { IUserRepo } from '../../repos/userRepo';
import { IAuthService } from '../../services/authService';
import { Either, left, Result, right } from '../../../../shared/core/Result';
import { LogoutDTO } from './LogoutDTO';
import { UnexpectedError } from '~/shared/core/AppError';
import { User } from '../../domain/user';
import { UserNotFoundOrDeletedError } from './LogoutErrors';

type Response = Either<UnexpectedError, Result<void>>;

export class LogoutUseCase implements UseCase<LogoutDTO, Promise<Response>> {
  private userRepo: IUserRepo;
  private authService: IAuthService;

  constructor(userRepo: IUserRepo, authService: IAuthService) {
    this.userRepo = userRepo;
    this.authService = authService;
  }

  public async execute(request: LogoutDTO): Promise<Response> {
    let user: User;
    const { userId } = request;

    try {
      try {
        user = await this.userRepo.getUserByUserId(userId);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        return left(new UserNotFoundOrDeletedError());
      }

      await this.authService.deAuthenticateUser(user.username.value);

      return right(Result.ok<void>());
    } catch (err) {
      return left(new UnexpectedError(err));
    }
  }
}
