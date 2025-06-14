import { useLoaderData, Link } from "react-router";
import type { Route } from "./+types/home";
import { fetchPosts, type PostsResponse } from "~/services/postsApi";

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-emerald-50/30">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-mesh-gradient opacity-5"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-violet-300/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-rose-300/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <div className="animate-fade-in">
            <h1 className="text-6xl md:text-8xl font-display font-bold mb-8 gradient-text leading-tight">
              Daily Inspiration
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-12">
              Discover powerful quotes and motivational content that will transform your perspective and brighten your day
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link 
                to="/posts" 
                className="btn-modern bg-gradient-to-r from-violet-500 to-violet-600 text-white hover:shadow-lg hover:shadow-violet-500/30 text-lg px-8 py-4"
              >
                Explore Posts
              </Link>
              <Link 
                to="/posts/posts" 
                className="btn-modern bg-white text-slate-700 border border-slate-200 hover:border-violet-300 hover:text-violet-600 text-lg px-8 py-4"
              >
                Browse All
              </Link>
            </div>
          </div>
          
          {/* Stats */}
          <div className="mt-20 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="glass-card rounded-3xl p-8 max-w-2xl mx-auto">
              <div className="grid grid-cols-2 gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold gradient-text mb-2">{data.total_posts}</div>
                  <div className="text-slate-600 font-medium">Inspiring Posts</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold gradient-text mb-2">{data.total_pages}</div>
                  <div className="text-slate-600 font-medium">Pages of Wisdom</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts Section */}
      {data.posts.length > 0 && (
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">
                Featured Inspiration
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Handpicked quotes and stories to spark your motivation
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {data.posts.slice(0, 3).map((post, index) => (
                <Link
                  key={post.id}
                  to={`/posts/${post.id}`}
                  className="block group animate-scale-in"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <article className="relative overflow-hidden rounded-3xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3">
                    <div className="relative h-64 overflow-hidden">
                      <img 
                        src={`https://codestomp.com/apps/testApi/${post.image}`} 
                        alt={post.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Floating badge */}
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-slate-700 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                        Featured
                      </div>
                    </div>
                    
                    <div className="p-8">
                      <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-violet-600 transition-colors duration-300">
                        {post.title}
                      </h3>
                      <blockquote className="text-slate-600 leading-relaxed italic line-clamp-3 mb-4">
                        "{post.content}"
                      </blockquote>
                      <div className="flex items-center justify-between">
                        <time className="text-sm text-slate-400 font-medium">
                          {new Date(post.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </time>
                        <div className="flex items-center text-violet-500 group-hover:text-violet-600 transition-colors duration-300">
                          <span className="text-sm font-medium mr-2">Read</span>
                          <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
            
            {/* More Posts Preview */}
            {data.posts.length > 3 && (
              <div className="text-center animate-slide-up">
                <div className="glass-card rounded-3xl p-12 max-w-2xl mx-auto">
                  <div className="flex items-center justify-center gap-8 mb-8">
                    <div className="flex -space-x-4">
                      {data.posts.slice(3, 6).map((post, index) => (
                        <div 
                          key={post.id} 
                          className="w-16 h-16 rounded-2xl overflow-hidden border-4 border-white shadow-lg floating"
                          style={{ animationDelay: `${index * 0.5}s` }}
                        >
                          <img 
                            src={`https://codestomp.com/apps/testApi/${post.image}`} 
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="text-left">
                      <div className="text-2xl font-bold gradient-text mb-2">
                        +{data.total_posts - 6}
                      </div>
                      <div className="text-slate-600 font-medium">More posts</div>
                    </div>
                  </div>
                  <Link 
                    to="/posts/posts" 
                    className="btn-modern bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:shadow-lg hover:shadow-emerald-500/30 inline-flex items-center gap-3"
                  >
                    <span>View All Posts</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Call to Action Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-emerald-500/20 rounded-3xl blur-2xl"></div>
            <div className="relative glass-card rounded-3xl p-16">
              <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">
                Ready for Daily Inspiration?
              </h2>
              <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
                Join thousands who start their day with motivational quotes and transform their mindset
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                <Link 
                  to="/posts/posts" 
                  className="btn-modern bg-gradient-to-r from-violet-500 to-emerald-500 text-white hover:shadow-lg hover:shadow-violet-500/30 text-lg px-8 py-4 inline-flex items-center gap-3"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Start Your Journey
                </Link>
                <button className="btn-modern bg-white text-slate-700 border border-slate-200 hover:border-violet-300 hover:text-violet-600 text-lg px-8 py-4 inline-flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Save Favorites
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
