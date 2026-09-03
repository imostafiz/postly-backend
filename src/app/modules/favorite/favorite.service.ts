import prisma from '../../prisma';

const createFavoriteIntoDB = async (user: string, post: string) => {
  const existingFavorite = await prisma.favorite.findFirst({
    where: { userId: parseInt(user), postId: parseInt(post) },
  });

  if (existingFavorite) {
    throw new Error('Already saved this post');
  }

  const favorite = await prisma.favorite.create({
    data: {
      userId: parseInt(user),
      postId: parseInt(post),
    },
  });

  return favorite;
};

const getAllFavoriteFromDB = async (userId: string) => {
  const result = await prisma.favorite.findMany({
    where: { userId: parseInt(userId) },
    include: { post: true },
  });
  return result;
};

const deleteFavoriteFromDB = async (userId: string, postId: string) => {
  const result = await prisma.favorite.deleteMany({
    where: { userId: parseInt(userId), postId: parseInt(postId) },
  });
  return result;
};

const getAllMyFavoriteFromDB = async (userId: string) => {
  const result = await prisma.favorite.findMany({
    where: { userId: parseInt(userId) },
    include: { post: true },
  });
  return result;
};

export const FavoriteServices = {
  createFavoriteIntoDB,
  deleteFavoriteFromDB,
  getAllFavoriteFromDB,
  getAllMyFavoriteFromDB,
};
