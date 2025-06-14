import { useState, useEffect } from "react";
import { type LoaderFunctionArgs } from "react-router";
import { useLoaderData, Link } from "react-router";
import { fetchPosts, type PostsResponse } from "~/services/postsApi";
import type { Post } from "~/types/PostDTO";

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
  
  // 🎯 useState Hook - Managing component state
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPosts, setFilteredPosts] = useState<Post[]>(data.posts);
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  // 🎯 useEffect Hook - Side effects and lifecycle
  useEffect(() => {
    // Filter posts based on search term
    const filtered = data.posts.filter(post =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPosts(filtered);
  }, [searchTerm, data.posts]);

  // 🎯 useEffect Hook - Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    
    // Cleanup function
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 🎯 Custom function using hooks
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-emerald-50/30">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-white/60 backdrop-blur-sm border-b border-slate-200/50">
        <div className="absolute inset-0 bg-mesh-gradient opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16 text-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-4 gradient-text">
              Inspirational Posts
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Discover wisdom, motivation, and inspiration in our curated collection
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Search Section */}
        <div className="mb-12 animate-slide-up">
          <div className="max-w-2xl mx-auto">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-emerald-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative glass-card rounded-3xl p-8">
                <div className="relative">
                  <div className="absolute left-6 top-1/2 transform -translate-y-1/2 text-slate-400">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  
                  <input
                    type="text"
                    placeholder="Search for inspiration..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-16 pr-16 py-5 bg-white/50 border-2 border-slate-200/50 rounded-2xl text-lg placeholder-slate-400 focus:outline-none focus:border-violet-400 focus:bg-white transition-all duration-300"
                  />
                  
                  {searchTerm && (
                    <button
                      onClick={clearSearch}
                      className="absolute right-6 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-slate-200 hover:bg-rose-500 text-slate-600 hover:text-white rounded-full flex items-center justify-center transition-all duration-300 group"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
                
                {searchTerm && (
                  <div className="mt-6 text-center">
                    <span className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {filteredPosts.length} result{filteredPosts.length !== 1 ? 's' : ''} found
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="mb-12 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="glass-card rounded-2xl p-6 text-center">
            <div className="flex items-center justify-center gap-8 text-slate-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-violet-500 rounded-full animate-pulse"></div>
                <span className="font-medium">Page {data.current_page} of {data.total_pages}</span>
              </div>
              <div className="w-px h-6 bg-slate-300"></div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="font-medium">{data.total_posts} total posts</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredPosts.map((post: Post, index) => (
            <article 
              key={post.id} 
              className="group animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Link to={"/posts/" + post.id} className="block">
                <div className="relative overflow-hidden rounded-3xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={`https://codestomp.com/apps/testApi/${post.image}`} 
                      alt={post.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Floating badge */}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-slate-700 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      Read More
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-4 line-clamp-2 group-hover:text-violet-600 transition-colors duration-300">
                      {post.title}
                    </h2>
                    
                    <blockquote className="text-slate-600 leading-relaxed mb-6 line-clamp-3 italic">
                      "{post.content}"
                    </blockquote>
                    
                    <div className="flex items-center justify-between">
                      <time className="text-sm text-slate-400 font-medium">
                        {new Date(post.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
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
                </div>
              </Link>
            </article>
          ))}
        </div>

        {/* No Results State */}
        {filteredPosts.length === 0 && searchTerm && (
          <div className="text-center py-20 animate-fade-in">
            <div className="glass-card rounded-3xl p-12 max-w-md mx-auto">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">No posts found</h3>
              <p className="text-slate-600 mb-8">Try searching with different keywords or browse all posts</p>
              <button 
                onClick={clearSearch}
                className="btn-modern bg-gradient-to-r from-violet-500 to-emerald-500 text-white hover:shadow-lg"
              >
                Clear Search
              </button>
            </div>
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center items-center gap-6 mb-12">
          {data.current_page > 1 && (
            <Link 
              to={`/posts?page=${data.current_page - 1}`}
              className="group relative overflow-hidden bg-gradient-to-r from-slate-100 to-slate-50 hover:from-violet-500 hover:to-purple-600 text-slate-700 hover:text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-500 transform hover:scale-105 hover:shadow-xl hover:shadow-violet-500/25 border border-slate-200 hover:border-transparent"
            >
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-slate-300 group-hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300">
                  <svg className="w-3 h-3 transform group-hover:-translate-x-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                  </svg>
                </div>
                <span className="relative z-10">Previous</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </Link>
          )}
          
          <div className="flex items-center gap-3">
            {Array.from({ length: Math.min(5, data.total_pages) }, (_, i) => {
              const pageNum = Math.max(1, Math.min(data.current_page - 2 + i, data.total_pages - 4 + i));
              return (
                <Link
                  key={pageNum}
                  to={`/posts?page=${pageNum}`}
                  className={`relative w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg transition-all duration-300 transform hover:scale-110 ${
                    pageNum === data.current_page
                      ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-xl shadow-violet-500/30 scale-110'
                      : 'bg-white text-slate-600 hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50 hover:text-violet-600 border border-slate-200 hover:border-violet-300 hover:shadow-lg'
                  }`}
                >
                  <span className="relative z-10">{pageNum}</span>
                  {pageNum === data.current_page && (
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-purple-500 rounded-2xl blur-sm opacity-50"></div>
                  )}
                </Link>
              );
            })}
          </div>
          
          {data.current_page < data.total_pages && (
            <Link 
              to={`/posts?page=${data.current_page + 1}`}
              className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-500 transform hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/25"
            >
              <div className="flex items-center gap-3">
                <span className="relative z-10">Next</span>
                <div className="w-5 h-5 bg-white/20 group-hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300">
                  <svg className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </Link>
          )}
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollToTop && (
        <button 
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-violet-500 to-emerald-500 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 z-50 animate-glow"
          aria-label="Scroll to top"
        >
          <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </div>
  );
} 