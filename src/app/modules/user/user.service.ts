import config from '../../config';
import prisma from '../../prisma';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

interface DecodedToken {
  id: number;
}

const createUserIntoDb = async (user: {
  name: string;
  email: string;
  password: string;
  profileImage?: string;
  phone?: string;
  address?: string;
}) => {
  const hashedPassword = await bcrypt.hash(user.password, Number(config.bcrypt_salt_round));
  const newUser = await prisma.user.create({
    data: { ...user, password: hashedPassword },
  });
  const jwtPayload = newUser;

  const accessToken = jwt.sign(
    { id: jwtPayload.id, email: jwtPayload.email, role: jwtPayload.role, name: jwtPayload.name } as object,
    config.jwt_access_secret as string,
    { expiresIn: config.jwt_access_expires_in },
  );
  const { password: _, ...userWithoutPassword } = newUser;
  return {
    success: true,
    statusCode: 201,
    message: 'User is created successfully',
    data: userWithoutPassword,
    token: accessToken,
  };
};

const getAllUsersFromDb = async () => {
  const result = await prisma.user.findMany({
    include: {
      followers: {
        include: { following: true },
      },
    },
  });
  return result;
};

const updateUserFromDb = async (userId: string, userData: Record<string, unknown>) => {
  const result = await prisma.user.update({
    where: { id: parseInt(userId) },
    data: userData,
  });
  return result;
};

const deleteUserFromDb = async (userId: string) => {
  const result = await prisma.user.delete({
    where: { id: parseInt(userId) },
  });
  return result;
};

const followUser = async (followerId: string, followeeId: string) => {
  const followee = await prisma.user.findUnique({ where: { id: parseInt(followeeId) } });
  const follower = await prisma.user.findUnique({ where: { id: parseInt(followerId) } });

  if (!followee || !follower) {
    throw new Error('User not found');
  }

  const existingFollow = await prisma.userFollowing.findUnique({
    where: {
      followerId_followingId: {
        followerId: parseInt(followerId),
        followingId: parseInt(followeeId),
      },
    },
  });

  if (existingFollow) {
    await prisma.userFollowing.delete({
      where: { id: existingFollow.id },
    });
    return { message: 'User unfollowed successfully' };
  } else {
    await prisma.userFollowing.create({
      data: {
        followerId: parseInt(followerId),
        followingId: parseInt(followeeId),
      },
    });
    return { message: 'User followed successfully' };
  }
};

const getSingleUSerFromDb = async (token: string) => {
  try {
    const decodedInfo = jwt.verify(token, config.jwt_access_secret as string) as DecodedToken;
    const result = await prisma.user.findUnique({
      where: { id: decodedInfo.id },
    });
    if (!result) {
      throw new Error('user not found');
    }
    return result;
  } catch (err) {
    console.log(err);
  }
};

const getUpdatedUser = async (token: string, payload: Record<string, unknown>) => {
  try {
    const decodedInfo = jwt.verify(token, config.jwt_access_secret as string) as DecodedToken;
    const userId = decodedInfo.id;
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: payload,
    });
    return updatedUser;
  } catch (err) {
    console.log(err);
  }
};

export const UserServices = {
  createUserIntoDb,
  getAllUsersFromDb,
  updateUserFromDb,
  deleteUserFromDb,
  followUser,
  getSingleUSerFromDb,
  getUpdatedUser,
};
