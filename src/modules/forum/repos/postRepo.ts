import { Post } from "../domain/post";
import { PostId } from "../domain/postId";
import { PostDetails } from "../domain/postDetails";

export interface IPostRepo {
  getPostDetailsBySlug (slug: string): Promise<PostDetails>;
  getPostBySlug (slug: string): Promise<Post>;
  getRecentPosts (offset?: number): Promise<PostDetails[]>;
  exists (postId: PostId): Promise<boolean>;
  save (post: Post): Promise<void>;
  delete (postId: PostId): Promise<void>;
}