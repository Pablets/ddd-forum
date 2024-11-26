import { JWTToken, RefreshToken } from '../../domain/jwt';

export interface LoginWithSocialDTO {
  accessToken: string;
}

export interface LoginWithSocialDTOResponse {
  accessToken: JWTToken;
  refreshToken: RefreshToken;
}
