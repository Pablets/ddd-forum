import { IUserRepo } from '../userRepo';
import { UserName } from '../../domain/userName';
import { User } from '../../domain/user';
import { UserMap } from '../../mappers/userMap';
import { UserEmail } from '../../domain/userEmail';
import { SocialAccessToken } from '../../domain/socialAccessToken';
import { getSocialUserInfo } from '../../services/google/googleAuthService';

export class SequelizeUserRepo implements IUserRepo {
  private models: any;

  constructor (models: any) {
    this.models = models;
  }
  async getUserByAccessToken(accessToken: SocialAccessToken | string): Promise<User> {
    const BaseUserModel = this.models.BaseUser;

    const asd = await getSocialUserInfo((accessToken as SocialAccessToken).value, 'GOOGLE', null);

    const baseUser = await BaseUserModel.findOne({
      where: {
        ['social_access_token']: asd.id,
      },
    });
    if (!!baseUser === false) throw new Error('User not found.');
    return UserMap.toDomain(baseUser);
  }

  async exists (userEmail: UserEmail): Promise<boolean> {
    const BaseUserModel = this.models.BaseUser;
    const baseUser = await BaseUserModel.findOne({
      where: {
        user_email: userEmail.value
      }
    });
    return !!baseUser === true;
  }

  async getUserByUserName (userName: UserName | string): Promise<User> {
    const BaseUserModel = this.models.BaseUser;
    const baseUser = await BaseUserModel.findOne({
      where: {
        username: userName instanceof UserName
          ? (<UserName>userName).value
          : userName
      }
    });
    if (!!baseUser === false) throw new Error("User not found.")
    return UserMap.toDomain(baseUser);
  }

  async getUserByUserId (userId: string): Promise<User> {
    const BaseUserModel = this.models.BaseUser;
    const baseUser = await BaseUserModel.findOne({
      where: {
        base_user_id: userId
      }
    });
    if (!!baseUser === false) throw new Error("User not found.")
    return UserMap.toDomain(baseUser);
  }

  async save (user: User): Promise<void> {
    const UserModel = this.models.BaseUser;
    const exists = await this.exists(user.email);

    if (!exists) {
      const rawSequelizeUser = await UserMap.toPersistence(user);
      await UserModel.create(rawSequelizeUser);
    }

    return;
  }
}
