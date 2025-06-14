import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("features/home.tsx"),
  route("posts", "features/posts/posts.tsx"),
  route("posts/:id", "features/post/post.tsx"),
] satisfies RouteConfig;
