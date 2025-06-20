// Generated by React Router

import "react-router"

declare module "react-router" {
  interface Register {
    pages: Pages
    routeFiles: RouteFiles
  }
}

type Pages = {
  "/": {
    params: {};
  };
  "/posts": {
    params: {};
  };
  "/posts/:id": {
    params: {
      "id": string;
    };
  };
};

type RouteFiles = {
  "root.tsx": {
    id: "root";
    page: "/" | "/posts" | "/posts/:id";
  };
  "features/home.tsx": {
    id: "features/home";
    page: "/";
  };
  "features/posts/posts.tsx": {
    id: "features/posts/posts";
    page: "/posts";
  };
  "features/post/post.tsx": {
    id: "features/post/post";
    page: "/posts/:id";
  };
};