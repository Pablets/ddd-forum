import { UseCase } from '../../../../../shared/core/UseCase';
import { ICommentRepo } from '../../../repos/commentRepo';
import { GetCommentByCommentIdRequestDTO } from './GetCommentByCommentIdRequestDTO';
import { Either, Result, left, right } from '../../../../../shared/core/Result';
import { CommentDetails } from '../../../domain/commentDetails';
import { UnexpectedError } from '../../../../../shared/core/AppError';
import { CommentNotFoundError } from './GetCommentByCommentIdErrors';
import { MemberId } from '../../../domain/memberId';
import { IMemberRepo } from '../../../repos/memberRepo';

type Response = Either<CommentNotFoundError | UnexpectedError, Result<CommentDetails>>;

export class GetCommentByCommentId
  implements UseCase<GetCommentByCommentIdRequestDTO, Promise<Response>>
{
  private commentRepo: ICommentRepo;
  private memberRepo: IMemberRepo;

  constructor(commentRepo: ICommentRepo, memberRepo: IMemberRepo) {
    this.commentRepo = commentRepo;
    this.memberRepo = memberRepo;
  }

  public async execute(req: GetCommentByCommentIdRequestDTO): Promise<Response> {
    let comment: CommentDetails;
    let memberId: MemberId;

    try {
      const isAuthenticated = !!req.userId === true;

      if (isAuthenticated) {
        memberId = await this.memberRepo.getMemberIdByUserId(req.userId);
      }

      try {
        comment = await this.commentRepo.getCommentDetailsByCommentId(req.commentId, memberId);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        return left(new CommentNotFoundError(req.commentId));
      }

      return right(Result.ok<CommentDetails>(comment));
    } catch (err) {
      return left(new UnexpectedError(err));
    }
  }
}
