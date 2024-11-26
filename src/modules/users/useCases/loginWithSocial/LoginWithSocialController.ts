
import { LoginWithSocialUserUseCase } from "./LoginWithSocialUseCase";
import { LoginWithSocialDTO, LoginWithSocialDTOResponse } from "./LoginWithSocialDTO";
import { LoginWithSocialUseCaseErrors } from "./LoginWithSocialErrors";
import { BaseController } from "../../../../shared/infra/http/models/BaseController";
import * as express from 'express'
import { DecodedExpressRequest } from "../../infra/http/models/decodedRequest";

export class LoginWithSocialController extends BaseController {
  private useCase: LoginWithSocialUserUseCase;

  constructor (useCase: LoginWithSocialUserUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl (req: DecodedExpressRequest, res: express.Response): Promise<any> {
    const dto: LoginWithSocialDTO = req.body as LoginWithSocialDTO;

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case LoginWithSocialUseCaseErrors.UserNameDoesntExistError:
            return this.notFound(res, error.getErrorValue().message)
          case LoginWithSocialUseCaseErrors.AccessTokenNotValidError:
            return this.clientError(res, error.getErrorValue().message)
          default:
            console.log(error.getErrorValue());
            return this.fail(res, error.getErrorValue().message);
        }
      } else {
        const dto: LoginWithSocialDTOResponse = result.value.getValue() as LoginWithSocialDTOResponse;
        return this.ok<LoginWithSocialDTOResponse>(res, dto);
      }

    } catch (err) {
      return this.fail(res, err)
    }
  }
}