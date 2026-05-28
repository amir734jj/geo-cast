import { create } from "zustand";
import { PostInfoType } from "@geo-cast/lib/dto/board/post";
import {immer} from "zustand/middleware/immer";
import _ from "lodash";

export type PostsState = {
  posts: PostInfoType[];
  refreshTrigger: number;
};

export type PostsActions = {
  appendPosts: (posts: PostInfoType[]) => void;
  clearPosts: () => void;
  removePost: (postId: number) => void;
  triggerRefresh: () => void;
};

export const usePostsStore = create<PostsState & PostsActions>()(immer((set) => ({
  posts: [],
  refreshTrigger: 0,
  appendPosts: (posts) => {
    set((state) => {
      state.posts = state.posts.filter(p => !_.find(posts, { id: p.id })).concat(posts);
    });
  },
  clearPosts: () => {
    set((state) => {
      state.posts = [];
    });
  },
  removePost: (postId) => {
    set((state) => {
      state.posts = state.posts.filter(p => p.id !== postId);
    });
  },
  triggerRefresh: () => {
    set((state) => {
      state.refreshTrigger = state.refreshTrigger + 1;
    });
  }
})));

