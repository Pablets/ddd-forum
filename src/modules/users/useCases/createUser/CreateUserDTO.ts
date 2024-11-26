
export interface CreateUserDTO {
  username: string;
  email: string;
  password?: string;
  socialAccessToken?: string;
}