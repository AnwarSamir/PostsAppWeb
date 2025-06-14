import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("features/home.tsx"),
  route("posts", "features/posts.tsx"),
  route("posts/:id", "features/post.tsx"),
] satisfies RouteConfig;
