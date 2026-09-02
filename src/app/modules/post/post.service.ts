import prisma from '../../prisma';

const createPostIntoDb = async (post: {
  title: string;
  content: string;
  image?: string[];
  userId: number;
  category: string;
  isPremium?: boolean;
}) => {
  const result = await prisma.post.create({
    data: post,
  });
  return result;
};

const updatePostIntoDb = async (postId: string, postData: Record<string, unknown>) => {
  const result = await prisma.post.update({
    where: { id: parseInt(postId) },
    data: postData,
  });
  return result;
};

const getMyPostFromDb = async (userId: string) => {
  const result = await prisma.post.findMany({
    where: { userId: parseInt(userId) },
    include: {
      user: true,
      comments: true,
    },
  });
  return result;
};

const deletePostFromDb = async (postId: string) => {
  const result = await prisma.post.delete({
    where: { id: parseInt(postId) },
  });
  return result;
};

const getAllPostFromDb = async (search: string, sortBy: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {};

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { content: { contains: search, mode: 'insensitive' } },
      { category: { contains: search, mode: 'insensitive' } },
    ];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let orderBy: any = { createdAt: 'desc' };

  if (sortBy === 'like') {
    orderBy = { likes: { _count: 'desc' } };
  } else if (sortBy === 'dislike') {
    orderBy = { dislikes: { _count: 'desc' } };
  } else if (sortBy === 'comments') {
    orderBy = { comments: { _count: 'desc' } };
  }

  const result = await prisma.post.findMany({
    where,
    include: {
      user: true,
      comments: {
        include: { author: true },
      },
      likes: {
        include: { user: true },
      },
      dislikes: {
        include: { user: true },
      },
    },
    orderBy,
  });

  return result;
};

export const PostService = {
  createPostIntoDb,
  getAllPostFromDb,
  updatePostIntoDb,
  deletePostFromDb,
  getMyPostFromDb,
};
