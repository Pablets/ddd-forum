
import { LoginWithSocialUserUseCase } from "./LoginWithSocialUseCase";
import { LoginWithSocialController } from "./LoginWithSocialController";
import { authService } from "../../services";
import { userRepo } from "../../repos";

const loginWithSocialUseCase = new LoginWithSocialUserUseCase(userRepo, authService);
const loginWithSocialController = new LoginWithSocialController(loginWithSocialUseCase);

export { loginWithSocialController, loginWithSocialUseCase }