import axios from 'axios';
import type {Post} from "~/types/PostDTO";

const postDetailsUrl = "https://codestomp.com/apps/testApi/get_post.php";

// Create axios instance for post details with default config
const postDetailsClient = axios.create({
    timeout: 10000, // 10 seconds timeout
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor for logging
postDetailsClient.interceptors.request.use(
    (config) => {
        console.log(`🚀 Post Details Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => {
        console.error('❌ Post Details Request Error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for logging and error handling
postDetailsClient.interceptors.response.use(
    (response) => {
        console.log(`✅ Post Details Response: ${response.status} ${response.config.url}`);
        return response;
    },
    (error) => {
        console.error('❌ Post Details Response Error:', error.response?.status, error.message);
        return Promise.reject(error);
    }
);

export const fetchPostDetails = async(postId: number): Promise<Post> => {
    try {
        const response = await postDetailsClient.get<Post>(postDetailsUrl, {
            params: { id: postId }
        });
        
        return response.data;
    } catch (error) {
        console.error('Error fetching post details:', error);
        throw error;
    }
}