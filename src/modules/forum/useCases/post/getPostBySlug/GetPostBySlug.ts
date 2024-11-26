

import { UseCase } from "../../../../../shared/core/UseCase";
import { IPostRepo } from "../../../repos/postRepo";
import { PostDetails } from "../../../domain/postDetails";
import { Either, Result, left, right } from "../../../../../shared/core/Result";
import { UnexpectedError } from "../../../../../shared/core/AppError";
import { GetPostBySlugDTO } from "./GetPostBySlugDTO";
import { PostNotFoundError } from "../upvotePost/UpvotePostErrors";

type Response = Either<
  PostNotFoundError |
  UnexpectedError,
  Result<PostDetails>
>

export class GetPostBySlug implements UseCase<any, Promise<Response>> {
  private postRepo: IPostRepo;

  constructor (postRepo: IPostRepo) {
    this.postRepo = postRepo;
  }

  public async execute (req: GetPostBySlugDTO): Promise<Response> {
    let postDetails: PostDetails;
    const { slug } = req;

    try {

      try {
        postDetails = await this.postRepo.getPostDetailsBySlug(slug);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        return left(new PostNotFoundError(slug));
      }

      return right(Result.ok<PostDetails>(postDetails));

    } catch (err) {
      return left(new UnexpectedError(err));
    }
  }

}