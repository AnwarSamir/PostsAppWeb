import { useState, useEffect, useCallback } from "react";
import { useLoaderData, Link } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { type Post } from "~/types/PostDTO";
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
  
  // 🎯 useState Hook - Managing multiple states
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(42); // Mock initial count
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const [readingTime, setReadingTime] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  // 🎯 useEffect Hook - Calculate reading time
  useEffect(() => {
    const wordsPerMinute = 200;
    const wordCount = post.content.split(' ').length;
    const time = Math.ceil(wordCount / wordsPerMinute);
    setReadingTime(time);
  }, [post.content]);

  // 🎯 useEffect Hook - Auto-hide copy success message
  useEffect(() => {
    if (showCopySuccess) {
      const timer = setTimeout(() => {
        setShowCopySuccess(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [showCopySuccess]);

  // 🎯 useCallback Hook - Optimized event handlers
  const handleLike = useCallback(() => {
    setLiked(prev => !prev);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
  }, [liked]);

  const handleCopyQuote = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(post.content);
      setShowCopySuccess(true);
    } catch (error) {
      console.error('Failed to copy:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = post.content;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setShowCopySuccess(true);
    }
  }, [post.content]);

  const handleShare = useCallback(async () => {
    const shareData = {
      title: post.title,
      text: post.content,
      url: window.location.href
    };

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy URL to clipboard
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  }, [post.title, post.content]);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-emerald-50/30">
      {/* Navigation Header */}
      <div className="bg-white/60 backdrop-blur-sm border-b border-slate-200/50 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link 
            to="/posts"
            className="inline-flex items-center gap-3 text-slate-600 hover:text-violet-600 transition-colors duration-300 group"
          >
            <div className="w-10 h-10 bg-slate-100 group-hover:bg-violet-100 rounded-xl flex items-center justify-center transition-colors duration-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
            <span className="font-medium">Back to Posts</span>
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Main Article */}
        <article className="animate-fade-in">
          {/* Hero Image Section */}
          <div className="relative mb-12 group">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-emerald-500/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
            <div className="relative glass-card rounded-3xl overflow-hidden">
              <div className="relative h-96 md:h-[500px] overflow-hidden">
                {!imageLoaded && (
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse flex items-center justify-center">
                    <div className="text-slate-400 font-medium">Loading image...</div>
                  </div>
                )}
                <img 
                  src={`https://codestomp.com/apps/testApi/${post.image}`} 
                  alt={post.title}
                  onLoad={handleImageLoad}
                  className={`w-full h-full object-cover transition-all duration-700 ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                
                {/* Floating metadata */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="glass-card px-4 py-2 rounded-full">
                      <div className="flex items-center gap-2 text-white text-sm font-medium">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {readingTime} min read
                      </div>
                    </div>
                    <div className="glass-card px-4 py-2 rounded-full">
                      <div className="flex items-center gap-2 text-white text-sm font-medium">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(post.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                    </div>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                    {post.title}
                  </h1>
                </div>
              </div>
            </div>
          </div>
          
          {/* Content Section */}
          <div className="space-y-12">
            {/* Quote Section */}
            <div className="relative animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-emerald-500/10 rounded-3xl blur-xl"></div>
              <div className="relative glass-card rounded-3xl p-12">
                <div className="text-center">
                  <div className="text-6xl text-violet-300 mb-6 font-serif">"</div>
                  <blockquote className="text-2xl md:text-3xl font-light text-slate-800 leading-relaxed italic mb-8">
                    {post.content}
                  </blockquote>
                  <div className="text-6xl text-violet-300 font-serif rotate-180">"</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <button 
                onClick={handleLike}
                className={`group relative overflow-hidden px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-500 transform hover:scale-105 flex items-center gap-4 ${
                  liked 
                    ? 'bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white shadow-xl shadow-rose-500/40 animate-pulse' 
                    : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-rose-400 hover:text-rose-600 hover:shadow-xl hover:shadow-rose-500/20'
                }`}
                aria-pressed={liked}
              >
                <div className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                  liked ? 'bg-white/20' : 'bg-rose-50 group-hover:bg-rose-100'
                }`}>
                  <svg className={`w-5 h-5 transition-all duration-300 ${
                    liked ? 'fill-current text-white scale-110' : 'text-rose-500 group-hover:scale-110'
                  }`} fill={liked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div className="flex flex-col items-start">
                  <span className="font-bold">{likeCount}</span>
                  <span className="text-sm opacity-80">Likes</span>
                </div>
                {liked && (
                  <div className="absolute inset-0 bg-gradient-to-r from-rose-400 via-pink-400 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                )}
              </button>

              <button 
                onClick={handleShare}
                className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:via-teal-600 hover:to-emerald-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-500 transform hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/40 flex items-center gap-4"
              >
                <div className="w-8 h-8 bg-white/20 group-hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300">
                  <svg className="w-5 h-5 transform group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                </div>
                <div className="flex flex-col items-start">
                  <span className="font-bold">Share</span>
                  <span className="text-sm opacity-80">Spread the wisdom</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
              </button>
              
              <button 
                onClick={handleCopyQuote}
                disabled={showCopySuccess}
                className={`group relative overflow-hidden px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-500 transform hover:scale-105 flex items-center gap-4 ${
                  showCopySuccess 
                    ? 'bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 text-white shadow-xl shadow-emerald-500/40 animate-pulse' 
                    : 'bg-gradient-to-r from-violet-500 via-purple-500 to-violet-600 hover:from-violet-600 hover:via-purple-600 hover:to-violet-700 text-white hover:shadow-xl hover:shadow-violet-500/40'
                }`}
              >
                <div className={`w-8 h-8 bg-white/20 group-hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300 ${
                  showCopySuccess ? 'animate-bounce' : ''
                }`}>
                  <svg className={`w-5 h-5 transition-all duration-300 ${
                    showCopySuccess ? 'text-white' : 'group-hover:scale-110'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showCopySuccess ? "M5 13l4 4L19 7" : "M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"} />
                  </svg>
                </div>
                <div className="flex flex-col items-start">
                  <span className="font-bold">{showCopySuccess ? 'Copied!' : 'Copy Quote'}</span>
                  <span className="text-sm opacity-80">{showCopySuccess ? 'Ready to share' : 'Save for later'}</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-violet-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
              </button>
            </div>

            {/* Success Message */}
            {showCopySuccess && (
              <div className="text-center animate-slide-up">
                <div className="inline-flex items-center gap-3 glass-card px-6 py-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/50">
                  <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-emerald-800 font-medium">Quote copied to clipboard!</span>
                </div>
              </div>
            )}
          </div>
        </article>
        
        {/* Navigation Footer */}
        <div className="mt-20 pt-12 border-t border-slate-200">
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/posts/posts" 
              className="btn-modern bg-gradient-to-r from-violet-500 to-violet-600 text-white hover:shadow-lg hover:shadow-violet-500/30 flex items-center gap-3"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0l-4-4m4 4l-4 4" />
              </svg>
              View All Posts
            </Link>
            <Link 
              to="/public" 
              className="btn-modern bg-white text-slate-700 border border-slate-200 hover:border-emerald-300 hover:text-emerald-600 flex items-center gap-3"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}