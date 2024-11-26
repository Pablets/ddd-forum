import { verifyGoogleToken } from './google';

interface UserInfo {
  id?: string;
  email?: string;
}

export async function getSocialUserInfo(
  accessToken: string,
  provider: 'GOOGLE',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _nonce: string | null
): Promise<UserInfo | null> {
  let userInfo: UserInfo | null = null;
  switch (provider) {
    case 'GOOGLE': {
      const profile = await verifyGoogleToken(accessToken);

      if (profile != null) {
        userInfo = {
          id: profile.sub,
          email: profile.email,
        };
      }
      break;
    }
    default:
      userInfo = null;
      break;
  }

  return userInfo;
}
