import { CreateUserDTO } from './CreateUserDTO';
import { EmailAlreadyExistsError, UsernameTakenError } from './CreateUserErrors';
import { Either, Result, left, right } from '~/shared/core/Result';
import { UnexpectedError } from '~/shared/core/AppError';
import { IUserRepo } from '../../repos/userRepo';
import { UseCase } from '../../../../shared/core/UseCase';
import { UserEmail } from '../../domain/userEmail';
import { UserPassword } from '../../domain/userPassword';
import { UserName } from '../../domain/userName';
import { User } from '../../domain/user';
import { SocialAccessToken } from '../../domain/socialAccessToken';

type Response = Either<
  | EmailAlreadyExistsError
  | UsernameTakenError
  | UnexpectedError
  | Result<any>,
  Result<void>
>;

export class CreateUserUseCase implements UseCase<CreateUserDTO, Promise<Response>> {
  private userRepo: IUserRepo;

  constructor(userRepo: IUserRepo) {
    this.userRepo = userRepo;
  }

  async execute(request: CreateUserDTO): Promise<Response> {
    const emailOrError = UserEmail.create(request.email);
    const passwordOrError = UserPassword.create({ value: request.password });
    const usernameOrError = UserName.create({ name: request.username });
    const socialAccessTokenOrError = SocialAccessToken.create({
      accessToken: request.socialAccessToken,
    });

    const authenticationOrError = Result.oneOf(passwordOrError, socialAccessTokenOrError);
    if (Array.isArray(authenticationOrError)) {
      if (authenticationOrError[0].isFailure && authenticationOrError[1].isFailure) {
        return left(
          Result.fail<void>('Cannot have two authentication methods at the same time')
        ) as Response;
      } else {
        return left(Result.fail<void>('Needs one authentication method')) as Response;
      }
    }

    const dtoResult = Result.combine([emailOrError, usernameOrError]);

    if (dtoResult.isFailure) {
      return left(Result.fail<void>(dtoResult.getErrorValue())) as Response;
    }

    const email: UserEmail = emailOrError.getValue();
    const username: UserName = usernameOrError.getValue();
    const password: UserPassword = socialAccessTokenOrError.isSuccess
      ? undefined
      : passwordOrError.getValue();
    const socialAccessToken: SocialAccessToken = socialAccessTokenOrError.isSuccess
      ? socialAccessTokenOrError.getValue()
      : undefined;

    try {
      const userAlreadyExists = await this.userRepo.exists(email);

      if (userAlreadyExists) {
        return left(new EmailAlreadyExistsError(email.value)) as Response;
      }

      try {
        const alreadyCreatedUserByUserName = await this.userRepo.getUserByUserName(username);

        const userNameTaken = !!alreadyCreatedUserByUserName === true;

        if (userNameTaken) {
          return left(new UsernameTakenError(username.value)) as Response;
        }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {}

      const userOrError: Result<User> = User.create({
        email,
        password,
        username,
        socialAccessToken,
      });

      if (userOrError.isFailure) {
        return left(Result.fail<User>(userOrError.getErrorValue().toString())) as Response;
      }

      const user: User = userOrError.getValue();

      await this.userRepo.save(user);

      return right(Result.ok<void>());
    } catch (err) {
      return left(new UnexpectedError(err)) as Response;
    }
  }
}
