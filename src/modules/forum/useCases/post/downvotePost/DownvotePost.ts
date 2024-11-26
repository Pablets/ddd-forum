import { UseCase } from '../../../../../shared/core/UseCase';
import { IMemberRepo } from '../../../repos/memberRepo';
import { IPostRepo } from '../../../repos/postRepo';
import { left, right, Result } from '../../../../../shared/core/Result';
import { UnexpectedError } from '../../../../../shared/core/AppError';
import { Member } from '../../../domain/member';
import { Post } from '../../../domain/post';
import { IPostVotesRepo } from '../../../repos/postVotesRepo';
import { PostVote } from '../../../domain/postVote';
import { PostService } from '../../../domain/services/postService';
import { DownvotePostResponse } from './DownvotePostResponse';
import { DownvotePostDTO } from './DownvotePostDTO';
import { MemberNotFoundError, PostNotFoundError } from './DownvotePostErrors';

export class DownvotePost implements UseCase<DownvotePostDTO, Promise<DownvotePostResponse>> {
  private memberRepo: IMemberRepo;
  private postRepo: IPostRepo;
  private postVotesRepo: IPostVotesRepo;
  private postService: PostService;

  constructor(
    memberRepo: IMemberRepo,
    postRepo: IPostRepo,
    postVotesRepo: IPostVotesRepo,
    postService: PostService,
  ) {
    this.memberRepo = memberRepo;
    this.postRepo = postRepo;
    this.postVotesRepo = postVotesRepo;
    this.postService = postService;
  }

  public async execute(req: DownvotePostDTO): Promise<DownvotePostResponse> {
    let member: Member;
    let post: Post;
    let existingVotesOnPostByMember: PostVote[];

    try {
      try {
        member = await this.memberRepo.getMemberByUserId(req.userId);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        return left(new MemberNotFoundError());
      }

      try {
        post = await this.postRepo.getPostBySlug(req.slug);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        return left(new PostNotFoundError(req.slug));
      }

      existingVotesOnPostByMember = await this.postVotesRepo.getVotesForPostByMemberId(
        post.postId,
        member.memberId,
      );

      const downvotePostResult = this.postService.downvotePost(
        post,
        member,
        existingVotesOnPostByMember,
      );

      if (downvotePostResult.isLeft()) {
        return left(downvotePostResult.value);
      }

      await this.postRepo.save(post);

      return right(Result.ok<void>());
    } catch (err) {
      return left(new UnexpectedError(err));
    }
  }
}
