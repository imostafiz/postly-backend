import prisma from '../../prisma';

const createCommentIntoDB = async (
  postId: string,
  author: string,
  commentText: string,
  commentImage: string,
) => {
  const comment = await prisma.comment.create({
    data: {
      authorId: parseInt(author),
      postId: parseInt(postId),
      commentText,
      commentImage,
    },
  });

  await prisma.post.update({
    where: { id: parseInt(postId) },
    data: {
      comments: { connect: { id: comment.id } },
    },
  });

  return comment;
};

const updateCommentInDB = async (
  commentId: string,
  authorId: string,
  payload: { commentText?: string; commentImage?: string },
) => {
  const existingComment = await prisma.comment.findUnique({
    where: { id: parseInt(commentId) },
  });

  if (!existingComment) {
    throw new Error('Comment not found.');
  }

  if (existingComment.authorId !== parseInt(authorId)) {
    throw new Error('You are not authorized to update this comment.');
  }

  const updatedComment = await prisma.comment.update({
    where: { id: parseInt(commentId) },
    data: payload,
  });

  return updatedComment;
};

const deleteCommentInDB = async (commentId: string, authorId: string) => {
  const existingComment = await prisma.comment.findUnique({
    where: { id: parseInt(commentId) },
  });

  if (!existingComment) {
    throw new Error('Comment not found.');
  }

  if (existingComment.authorId !== parseInt(authorId)) {
    throw new Error('You are not authorized to delete this comment.');
  }

  await prisma.comment.delete({
    where: { id: parseInt(commentId) },
  });

  return { message: 'Comment successfully deleted.' };
};

const addReplyToComment = async (commentId: string, replyId: string) => {
  // Replies are not supported in the current schema - comments don't have nested replies
  // This is a no-op matching the original commented-out behavior
  console.log('Reply feature not implemented', commentId, replyId);
  return null;
};

const getCommentsByPostId = async (postId: string) => {
  const comments = await prisma.comment.findMany({
    where: { postId: parseInt(postId) },
  });
  return comments;
};

export const CommentServices = {
  createCommentIntoDB,
  updateCommentInDB,
  addReplyToComment,
  getCommentsByPostId,
  deleteCommentInDB,
};
