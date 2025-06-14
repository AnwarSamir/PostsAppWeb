import { useLoaderData, Link } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { type Post } from "~/types/PostDTO";
import "~/post-details.css";
import {fetchPostDetails} from "~/services/postDetails.api";

export async function loader({ params }: LoaderFunctionArgs) {
  try {
    // Get the post ID from the URL parameters
    const postId = params.id ? parseInt(params.id, 10) : 1;
    
    if (isNaN(postId)) {
      throw new Response("Invalid post ID", { status: 400 });
    }
    
    const post = await fetchPostDetails(postId);
    return { post };
  } catch (error) {
    console.error("Failed to load post:", error);
    throw new Response("Failed to load post", { status: 500 });
  }
}

export default function Post() {
  const { post } = useLoaderData<{ post: Post }>();
  return (
    <div className="post-details-container">
      <Link to="/posts" className="back-link">
        ← Back to All Posts
      </Link>
      
      <article className="post-details">
        <div className="post-hero">
          <div className="post-image-large">
            <img 
              src={`https://codestomp.com/apps/testApi/${post.image}`} 
              alt={post.title}
            />
            <div className="image-overlay"></div>
          </div>
          <div className="post-header">
            <h1 className="post-title">{post.title}</h1>
            <time className="post-date" dateTime={post.created_at}>
              {new Date(post.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </time>
          </div>
        </div>
        
        <div className="post-content-section">
          <blockquote className="main-quote">
            {post.content}
          </blockquote>
          
          <div className="post-actions">
            <button className="share-btn" onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: post.title,
                  text: post.content,
                  url: window.location.href
                });
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert('Link copied to clipboard!');
              }
            }}>
              Share This Quote
            </button>
            
            <button className="copy-btn" onClick={() => {
              navigator.clipboard.writeText(post.content);
              alert('Quote copied to clipboard!');
            }}>
              Copy Quote
            </button>
          </div>
        </div>
      </article>
      
      <div className="navigation-section">
        <Link to="/posts" className="view-all-posts">
          View All Posts
        </Link>
        <Link to="/" className="back-home">
          Back to Home
        </Link>
      </div>
    </div>
  );
}