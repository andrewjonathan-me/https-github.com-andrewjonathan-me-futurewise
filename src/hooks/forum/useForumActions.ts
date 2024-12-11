import { useCreatePost } from "./mutations/useCreatePost";
import { useAddComment } from "./mutations/useAddComment";
import { useToggleLike } from "./mutations/useToggleLike";

export const useForumActions = () => {
  const createPost = useCreatePost();
  const addComment = useAddComment();
  const toggleLike = useToggleLike();

  return {
    createPost,
    addComment,
    toggleLike,
  };
};