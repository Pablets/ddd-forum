import { UseCase } from '../../../../../shared/core/UseCase';
import { Member } from '../../../domain/member';
import { Post } from '../../../domain/post';
import { Comment } from '../../../domain/comment';
import { IPostRepo } from '../../../repos/postRepo';
import { IMemberRepo } from '../../../repos/memberRepo';
import { ICommentRepo } from '../../../repos/commentRepo';
import { left, right, Result } from '../../../../../shared/core/Result';
import { UnexpectedError } from '../../../../../shared/core/AppError';
import { CommentVote } from '../../../domain/commentVote';
import { ICommentVotesRepo } from '../../../repos/commentVotesRepo';
import { PostService } from '../../../domain/services/postService';
import { DownvoteCommentDTO } from './DownvoteCommentDTO';
import { DownvoteCommentResponse } from './DownvoteCommentResponse';
import {
  CommentNotFoundError,
  MemberNotFoundError,
  PostNotFoundError,
} from './DownvoteCommentErrors';

export class DownvoteComment
  implements UseCase<DownvoteCommentDTO, Promise<DownvoteCommentResponse>>
{
  private postRepo: IPostRepo;
  private memberRepo: IMemberRepo;
  private commentRepo: ICommentRepo;
  private commentVotesRepo: ICommentVotesRepo;
  private postService: PostService;

  constructor(
    postRepo: IPostRepo,
    memberRepo: IMemberRepo,
    commentRepo: ICommentRepo,
    commentVotesRepo: ICommentVotesRepo,
    postService: PostService,
  ) {
    this.postRepo = postRepo;
    this.memberRepo = memberRepo;
    this.commentRepo = commentRepo;
    this.commentVotesRepo = commentVotesRepo;
    this.postService = postService;
  }

  public async execute(req: DownvoteCommentDTO): Promise<DownvoteCommentResponse> {
    let member: Member;
    let post: Post;
    let comment: Comment;
    let existingVotesOnCommentByMember: CommentVote[];

    try {
      try {
        member = await this.memberRepo.getMemberByUserId(req.userId);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        return left(new MemberNotFoundError());
      }

      try {
        comment = await this.commentRepo.getCommentByCommentId(req.commentId);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        return left(new CommentNotFoundError(req.commentId));
      }

      try {
        post = await this.postRepo.getPostByPostId(comment.postId.getStringValue());
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        return left(new PostNotFoundError(req.commentId));
      }

      existingVotesOnCommentByMember = await this.commentVotesRepo.getVotesForCommentByMemberId(
        comment.commentId,
        member.memberId,
      );

      const downVoteCommentResult = this.postService.downvoteComment(
        post,
        member,
        comment,
        existingVotesOnCommentByMember,
      );

      if (downVoteCommentResult.isLeft()) {
        return left(downVoteCommentResult.value);
      }

      await this.postRepo.save(post);

      return right(Result.ok<void>());
    } catch (err) {
      return left(new UnexpectedError(err));
    }
  }
}
