
import { UseCase } from "../../../../../shared/core/UseCase";
import { IPostRepo } from "../../../repos/postRepo";
import { EditPostDTO } from "./EditPostDTO";
import { EditPostResponse } from "./EditPostResponse";
import { Post } from "../../../domain/post";
import { WithChanges, Changes } from "../../../../../shared/core/WithChanges";
import { right, Result, left } from "../../../../../shared/core/Result";
import { PostNotFoundError } from "./EditPostErrors";
import { PostText } from "../../../domain/postText";
import { PostLink } from "../../../domain/postLink";
import { has } from 'lodash'

// TODO: Fix this use case
export class EditPost implements UseCase<EditPostDTO, Promise<EditPostResponse>>, WithChanges {
  private postRepo: IPostRepo;
  public changes: Changes;

  constructor (postRepo: IPostRepo) {
    this.postRepo = postRepo;
    this.changes = new Changes();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private updateText (request: EditPostDTO, post: Post) : void {
    let postText: PostText;
    let postTextOrError: Result<PostText>;

    if (has(request, 'text')) {
      postTextOrError = PostText.create({ value: request.text });

      // postTextOrError.isSuccess ? (
      //   this.changes.addChange(
      //     post.updateText(
      //       postTextOrError.getValue()
      //     ).value
      //   )
      // ) :

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      postText = postTextOrError.getValue();


    }
  }

  public async execute (request: EditPostDTO): Promise<EditPostResponse> {
    let post: Post;

    try {
      post = await this.postRepo.getPostByPostId(request.postId);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      return left(new PostNotFoundError(post.postId.getStringValue()))
    }



    if (has(request, 'link')) {
      PostLink.create({ url: request.link });
    }



    return right(Result.ok<void>())
  }
}
