import { GetUserByUserNameDTO } from './GetUserByUserNameDTO';
import { UserNotFoundError } from './GetUserByUserNameErrors';
import { left, Result, Either, right } from '../../../../shared/core/Result';
import { UserName } from '../../domain/userName';
import { IUserRepo } from '../../repos/userRepo';
import { UseCase } from '../../../../shared/core/UseCase';
import { UnexpectedError } from '../../../../shared/core/AppError';
import { User } from '../../domain/user';

type Response = Either<UnexpectedError, Result<User>>;

export class GetUserByUserName implements UseCase<GetUserByUserNameDTO, Promise<Response>> {
  private userRepo: IUserRepo;

  constructor(userRepo: IUserRepo) {
    this.userRepo = userRepo;
  }

  public async execute(request: GetUserByUserNameDTO): Promise<Response> {
    try {
      const userNameOrError = UserName.create({ name: request.username });

      if (userNameOrError.isFailure) {
        return left(Result.fail<any>(userNameOrError.getErrorValue().toString())) as Response;
      }

      const userName: UserName = userNameOrError.getValue();

      const user = await this.userRepo.getUserByUserName(userName);
      const userFound = !!user === true;

      if (!userFound) {
        return left(new UserNotFoundError(userName.value)) as Response;
      }

      return right(Result.ok<User>(user));
    } catch (err) {
      return left(new UnexpectedError(err));
    }
  }
}
