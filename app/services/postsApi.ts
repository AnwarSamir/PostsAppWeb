// Types for the API response
import axios from 'axios';
import type {PostsResponse} from "~/types/PostResponseDTO";

const API_URL = 'https://codestomp.com/apps/testApi/list_posts.php';

// Create axios instance with default config
const apiClient = axios.create({
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for logging and error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', error.response?.status, error.message);
    return Promise.reject(error);
  }
);

export const fetchPosts = async (page: number = 1): Promise<PostsResponse> => {
  try {
    const url = page > 1 ? `${API_URL}?page=${page}` : API_URL;
    
    const response = await apiClient.get<PostsResponse>(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

// Re-export the PostsResponse type for use in other files
export type { PostsResponse }; 