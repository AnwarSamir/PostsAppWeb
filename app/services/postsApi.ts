// Types for the API response

import type {PostsResponse} from "~/types/PostResponseDTO";

const API_URL = 'https://codestomp.com/apps/testApi/list_posts.php';

export const fetchPosts = async (page: number = 1): Promise<PostsResponse> => {
  try {
    const url = page > 1 ? `${API_URL}?page=${page}` : API_URL;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: PostsResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
}; 