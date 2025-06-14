import { useLoaderData, Link } from "react-router";
import type { Route } from "./+types/home";
import { fetchPosts, type PostsResponse } from "~/services/postsApi";
import "~/landing.css";

export async function loader() {
  try {
    // Fetch the first page of posts for the landing page
    const data = await fetchPosts(1);
    return data;
  } catch (error) {
    console.error("Failed to load posts for landing page:", error);
    // Return empty data if API fails, so the page still loads
    return {
      current_page: 1,
      total_posts: 0,
      total_pages: 0,
      posts: []
    };
  }
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Inspirational Posts - Daily Motivation" },
    { name: "description", content: "Discover daily inspiration with beautiful quotes and motivational content" },
  ];
}

export default function Home() {
  const data = useLoaderData<PostsResponse>();

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title animate-fade-in">
            Daily Inspiration
          </h1>
          <p className="hero-subtitle animate-slide-up">
            Discover powerful quotes and motivational content to brighten your day
          </p>
          <Link to="/posts" className="cta-button animate-bounce-in">
            Explore All Posts
          </Link>
        </div>
        <div className="hero-stats animate-fade-in-delayed">
          <div className="stat">
            <span className="stat-number">{data.total_posts}</span>
            <span className="stat-label">Inspiring Posts</span>
          </div>
          <div className="stat">
            <span className="stat-number">{data.total_pages}</span>
            <span className="stat-label">Pages of Wisdom</span>
          </div>
        </div>
      </section>

      {/* Featured Posts Section */}
      {data.posts.length > 0 && (
        <section className="featured-section">
          <h2 className="section-title animate-slide-in">Featured Inspiration</h2>
          <div className="featured-grid">
            {data.posts.slice(0, 3).map((post, index) => (
              <article 
                key={post.id} 
                className={`featured-card animate-card-${index + 1}`}
              >
                <div className="card-image">
                  <img 
                    src={`https://codestomp.com/apps/testApi/${post.image}`} 
                    alt={post.title}
                    loading="lazy"
                  />
                  <div className="card-overlay"></div>
                </div>
                <div className="card-content">
                  <h3>{post.title}</h3>
                  <blockquote>{post.content}</blockquote>
                  <time>
                    {new Date(post.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </time>
                </div>
              </article>
            ))}
          </div>
          
          {data.posts.length > 3 && (
            <div className="more-posts-preview">
              <div className="preview-cards">
                {data.posts.slice(3, 6).map((post, index) => (
                  <div 
                    key={post.id} 
                    className={`preview-card animate-float-${index + 1}`}
                  >
                    <img 
                      src={`https://codestomp.com/apps/testApi/${post.image}`} 
                      alt={post.title}
                    />
                  </div>
                ))}
              </div>
              <div className="preview-text animate-pulse">
                <p>+ {data.total_posts - 6} more inspiring posts</p>
                <Link to="/posts" className="view-all-link">
                  View All →
                </Link>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Call to Action Section */}
      <section className="cta-section animate-slide-up-delayed">
        <div className="cta-content">
          <h2>Ready for Daily Inspiration?</h2>
          <p>Join thousands who start their day with motivational quotes</p>
          <Link to="/posts" className="cta-button-secondary">
            Start Your Journey
          </Link>
        </div>
      </section>
    </div>
  );
}
