import type {Post} from "~/types/PostDTO";


const postDetailsUrl = "https://codestomp.com/apps/testApi/get_post.php?id="


export const fetchPostDetails = async(postId:number) : Promise<Post> =>{
    try {
        const  response = await fetch(`${postDetailsUrl}${postId}`,{
            method : 'GET',
            headers : {
            'Content-Type': 'application/json'
                },
        })
        console.log("---->")
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return  await response.json()
    }catch (e) {
        console.error('Error fetching posts:', e);
        throw e;
    }
}