import type {Post} from "~/types/PostDTO";

export interface PostsResponse {
    current_page: number;
    total_posts: number;
    total_pages: number;
    posts: Post[];
}