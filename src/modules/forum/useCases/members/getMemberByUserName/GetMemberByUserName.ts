import { UseCase } from '../../../../../shared/core/UseCase';
import { IMemberRepo } from '../../../repos/memberRepo';
import { GetMemberByUserNameDTO } from './GetMemberByUserNameDTO';
import { Either, Result, left, right } from '../../../../../shared/core/Result';
import { UnexpectedError } from '../../../../../shared/core/AppError';
import { MemberNotFoundError } from './GetMemberByUserNameErrors';
import { MemberDetails } from '../../../domain/memberDetails';

type Response = Either<MemberNotFoundError | UnexpectedError, Result<MemberDetails>>;

export class GetMemberByUserName implements UseCase<GetMemberByUserNameDTO, Promise<Response>> {
  private memberRepo: IMemberRepo;

  constructor(memberRepo: IMemberRepo) {
    this.memberRepo = memberRepo;
  }

  public async execute(request: GetMemberByUserNameDTO): Promise<Response> {
    let memberDetails: MemberDetails;
    const { username } = request;

    try {
      try {
        memberDetails = await this.memberRepo.getMemberDetailsByUserName(username);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        return left(new MemberNotFoundError(username));
      }

      return right(Result.ok<MemberDetails>(memberDetails));
    } catch (err) {
      return left(new UnexpectedError(err));
    }
  }
}
