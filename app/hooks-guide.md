# 🎯 React Hooks Guide - Your Project

## 📋 **Overview**
This guide shows you all the React hooks implemented in your project and how to use them effectively.

## 🔥 **Hooks Currently Used in Your Project**

### **1. useState Hook**
**Purpose:** Manages component state that can change over time

**Examples in your project:**
```typescript
// Search functionality (posts.tsx)
const [searchTerm, setSearchTerm] = useState("");
const [filteredPosts, setFilteredPosts] = useState<Post[]>(data.posts);

// Like system (post.tsx)
const [liked, setLiked] = useState(false);
const [likeCount, setLikeCount] = useState(42);

// UI feedback (post.tsx)
const [showCopySuccess, setShowCopySuccess] = useState(false);
const [imageLoaded, setImageLoaded] = useState(false);
```

### **2. useEffect Hook**
**Purpose:** Handles side effects and lifecycle events

**Examples in your project:**
```typescript
// Filter posts when search term changes
useEffect(() => {
  const filtered = data.posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );
  setFilteredPosts(filtered);
}, [searchTerm, data.posts]); // Dependencies array

// Auto-hide success message
useEffect(() => {
  if (showCopySuccess) {
    const timer = setTimeout(() => {
      setShowCopySuccess(false);
    }, 2000);
    
    return () => clearTimeout(timer); // Cleanup
  }
}, [showCopySuccess]);

// Scroll listener with cleanup
useEffect(() => {
  const handleScroll = () => {
    setShowScrollToTop(window.scrollY > 300);
  };

  window.addEventListener('scroll', handleScroll);
  
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

### **3. useCallback Hook**
**Purpose:** Optimizes performance by memoizing functions

**Examples in your project:**
```typescript
// Optimized event handlers
const handleLike = useCallback(() => {
  setLiked(prev => !prev);
  setLikeCount(prev => liked ? prev - 1 : prev + 1);
}, [liked]);

const handleCopyQuote = useCallback(async () => {
  try {
    await navigator.clipboard.writeText(post.content);
    setShowCopySuccess(true);
  } catch (error) {
    // Fallback logic
  }
}, [post.content]);
```

### **4. useLoaderData Hook** (React Router)
**Purpose:** Gets data from React Router loaders

**Examples in your project:**
```typescript
// Getting posts data
const data = useLoaderData<PostsResponse>();

// Getting single post data
const { post } = useLoaderData<{ post: Post }>();
```

## 🎨 **Hook Patterns Used**

### **Pattern 1: State + Effect Combination**
```typescript
// State for scroll position
const [showScrollToTop, setShowScrollToTop] = useState(false);

// Effect to update state based on scroll
useEffect(() => {
  const handleScroll = () => {
    setShowScrollToTop(window.scrollY > 300);
  };
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

### **Pattern 2: Controlled Form Inputs**
```typescript
// Controlled search input
const [searchTerm, setSearchTerm] = useState("");

// In JSX:
<input
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
/>
```

### **Pattern 3: Conditional Rendering**
```typescript
// State for UI feedback
const [showCopySuccess, setShowCopySuccess] = useState(false);

// In JSX:
{showCopySuccess && (
  <div className="copy-success-message">
    Quote copied to clipboard! ✨
  </div>
)}
```

### **Pattern 4: Optimized Event Handlers**
```typescript
// Memoized function to prevent unnecessary re-renders
const handleShare = useCallback(async () => {
  const shareData = {
    title: post.title,
    text: post.content,
    url: window.location.href
  };
  
  try {
    if (navigator.share) {
      await navigator.share(shareData);
    }
  } catch (error) {
    console.error('Error sharing:', error);
  }
}, [post.title, post.content]);
```

## 🚀 **Features Powered by Hooks**

### **Posts Page (posts.tsx)**
- ✅ **Real-time search** - `useState` + `useEffect`
- ✅ **Scroll to top button** - `useState` + `useEffect` + scroll listener
- ✅ **Filtered results display** - `useState` with derived state

### **Post Details Page (post.tsx)**
- ✅ **Like system** - `useState` with interactive buttons
- ✅ **Copy functionality** - `useState` + `useCallback` + async operations
- ✅ **Auto-hide messages** - `useEffect` with timers
- ✅ **Image loading states** - `useState` + `onLoad` events
- ✅ **Reading time calculation** - `useEffect` with text processing
- ✅ **Enhanced sharing** - `useCallback` with Web APIs

## 💡 **Hook Best Practices from Your Project**

### **1. Always Include Dependencies**
```typescript
useEffect(() => {
  // Effect logic here
}, [dependency1, dependency2]); // ✅ Dependencies listed
```

### **2. Cleanup Side Effects**
```typescript
useEffect(() => {
  const timer = setTimeout(/* ... */);
  return () => clearTimeout(timer); // ✅ Cleanup
}, []);
```

### **3. Use useCallback for Expensive Functions**
```typescript
const expensiveHandler = useCallback(() => {
  // Complex logic here
}, [dependency]); // ✅ Memoized
```

### **4. Initialize State Properly**
```typescript
const [posts, setPosts] = useState<Post[]>(data.posts); // ✅ Typed
```

## 🎯 **Next Steps - More Hooks You Can Add**

### **useMemo** - For expensive calculations
```typescript
const expensiveValue = useMemo(() => {
  return posts.filter(post => post.featured);
}, [posts]);
```

### **useRef** - For DOM references
```typescript
const inputRef = useRef<HTMLInputElement>(null);

// Focus input programmatically
const focusInput = () => {
  inputRef.current?.focus();
};
```

### **Custom Hooks** - Reusable logic
```typescript
function useLocalStorage(key: string, initialValue: any) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: any) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}
```

## ✨ **Your Project is Now Hook-Powered!**

You now have a modern React application using:
- ✅ **Interactive UI** with useState
- ✅ **Side effect management** with useEffect  
- ✅ **Performance optimization** with useCallback
- ✅ **Data loading** with useLoaderData
- ✅ **Real-time features** like search and scroll tracking
- ✅ **User feedback** with animations and messages

**Happy coding with React Hooks!** 🚀 