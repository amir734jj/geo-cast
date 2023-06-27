import { create } from "zustand";
import { PostInfoType } from "@geo-cast/lib/dto/board/post";
import {immer} from "zustand/middleware/immer";

export type PostsState = {
  posts: PostInfoType[][];
};

export type PostsActions = {
  setPosts: (posts: PostInfoType[], page: number) => void,
  clearPosts: () => void
};

export const usePostsStore = create<PostsState & PostsActions>()(immer((set) => ({
  posts: [],
  setPosts: (posts, page) => {
    set((state) => {
      state.posts[page] = posts
    })
  },
  clearPosts: () => {
    set((state) => {
      state.posts = [];
    })
  }
})));

