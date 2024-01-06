import { create } from "zustand";
import { PostInfoType } from "@geo-cast/lib/dto/board/post";
import {immer} from "zustand/middleware/immer";
import _ from "lodash";

export type PostsState = {
  posts: PostInfoType[];
};

export type PostsActions = {
  appendPosts: (posts: PostInfoType[]) => void,
  clearPosts: () => void
};

export const usePostsStore = create<PostsState & PostsActions>()(immer((set) => ({
  posts: [],
  appendPosts: (posts) => {
    set((state) => {
      state.posts = state.posts.filter(p => !_.find(posts, { id: p.id })).concat(posts)
    });
  },
  clearPosts: () => {
    set((state) => {
      state.posts = [];
    });
  }
})));

