import { UseCase } from '../../../../../shared/core/UseCase';
import { IMemberRepo } from '../../../repos/memberRepo';
import { IPostRepo } from '../../../repos/postRepo';
import { ReplyToCommentDTO } from './ReplyToCommentDTO';
import { left, Either, Result, right } from '../../../../../shared/core/Result';
import { UnexpectedError } from '../../../../../shared/core/AppError';
import { Post } from '../../../domain/post';
import { Member } from '../../../domain/member';
import { PostSlug } from '../../../domain/postSlug';
import {
  CommentNotFoundError,
  MemberNotFoundError,
  PostNotFoundError,
} from './ReplyToCommentErrors';
import { Comment } from '../../../domain/comment';
import { ICommentRepo } from '../../../repos/commentRepo';
import { CommentText } from '../../../domain/commentText';
import { PostService } from '../../../domain/services/postService';

type Response = Either<
  CommentNotFoundError | PostNotFoundError | MemberNotFoundError | UnexpectedError | Result<any>,
  Result<void>
>;

export class ReplyToComment implements UseCase<ReplyToCommentDTO, Promise<Response>> {
  private memberRepo: IMemberRepo;
  private postRepo: IPostRepo;
  private commentRepo: ICommentRepo;
  private postService: PostService;

  constructor(
    memberRepo: IMemberRepo,
    postRepo: IPostRepo,
    commentRepo: ICommentRepo,
    postService: PostService,
  ) {
    this.memberRepo = memberRepo;
    this.postRepo = postRepo;
    this.commentRepo = commentRepo;
    this.postService = postService;
  }

  private async getPost(slug: PostSlug): Promise<Either<PostNotFoundError, Result<Post>>> {
    try {
      const post = await this.postRepo.getPostBySlug(slug.value);
      return right(Result.ok<Post>(post));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      return left(new PostNotFoundError(slug.value));
    }
  }

  private async getMember(userId: string): Promise<Either<MemberNotFoundError, Result<Member>>> {
    try {
      const member = await this.memberRepo.getMemberByUserId(userId);
      return right(Result.ok<Member>(member));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      return left(new MemberNotFoundError(userId));
    }
  }

  private async getParentComment(
    commentId: string,
  ): Promise<Either<CommentNotFoundError, Result<Comment>>> {
    try {
      const comment = await this.commentRepo.getCommentByCommentId(commentId);
      return right(Result.ok<Comment>(comment));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      return left(new CommentNotFoundError(commentId));
    }
  }

  public async execute(req: ReplyToCommentDTO): Promise<Response> {
    let post: Post;
    let member: Member;
    let slug: PostSlug;
    let parentComment: Comment;
    const { userId, parentCommentId } = req;

    try {
      const slugOrError = PostSlug.createFromExisting(req.slug);

      if (slugOrError.isFailure) {
        return left(slugOrError);
      }

      slug = slugOrError.getValue();

      const asyncResults = await Promise.all([
        this.getPost(slug),
        this.getMember(userId),
        this.getParentComment(parentCommentId),
      ]);

      for (const result of asyncResults) {
        if (result.isLeft()) {
          return left(result.value);
        }
      }

      const [postResult, memberResult, parentCommentResult] = asyncResults;

      post = (postResult.value as Result<Post>).getValue();
      member = (memberResult.value as Result<Member>).getValue();
      parentComment = (parentCommentResult.value as Result<Comment>).getValue();

      const commentTextOrError = CommentText.create({ value: req.comment });

      if (commentTextOrError.isFailure) {
        return left(commentTextOrError);
      }

      const commentText: CommentText = commentTextOrError.getValue();

      const replyToCommentResult: Either<
        Result<any>,
        Result<void>
      > = this.postService.replyToComment(post, member, parentComment, commentText);

      if (replyToCommentResult.isLeft()) {
        return left(replyToCommentResult.value);
      }

      await this.postRepo.save(post);

      return right(Result.ok<void>());
    } catch (err) {
      return left(new UnexpectedError(err));
    }
  }
}
