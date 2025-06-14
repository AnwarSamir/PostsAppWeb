import { type LoaderFunctionArgs } from "react-router";
import { useLoaderData, Link } from "react-router";
import { fetchPosts, type PostsResponse } from "~/services/postsApi";
import "~/posts.css";

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    
    const data = await fetchPosts(page);
    return data;
  } catch (error) {
    console.error("Failed to load posts:", error);
    throw new Response("Failed to load posts", { status: 500 });
  }
}

export default function Posts() {
  const data = useLoaderData<PostsResponse>();

  return (
    <div className="posts-container">
      <h1>Inspirational Posts</h1>
      <div className="posts-meta">
        <p>Page {data.current_page} of {data.total_pages} | Total posts: {data.total_posts}</p>
      </div>
      
      <div className="posts-grid">

        {data.posts.map((post) => (
          <article key={post.id} className="post-card">
            <div className="post-image">
              <img 
                src={`https://codestomp.com/apps/testApi/${post.image}`} 
                alt={post.title}
                loading="lazy"
              />
            </div>
            <div className="post-content">
              <Link to={"/posts/" + post.id} className="post-card-link">
              <h2>{post.title}</h2>
              <blockquote>{post.content}</blockquote>
              <time dateTime={post.created_at}>
                {new Date(post.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
              </Link>
              
            </div>
          </article>
        ))}
      </div>

      <div className="pagination">
        {data.current_page > 1 && (
          <Link 
            to={`/posts?page=${data.current_page - 1}`}
            className="pagination-link"
          >
            ← Previous
          </Link>
        )}
        
        <span className="pagination-info">
          Page {data.current_page} of {data.total_pages}
        </span>
        
        {data.current_page < data.total_pages && (
          <Link 
            to={`/posts?page=${data.current_page + 1}`}
            className="pagination-link"
          >
            Next →
          </Link>
        )}
      </div>
    </div>
  );
} 