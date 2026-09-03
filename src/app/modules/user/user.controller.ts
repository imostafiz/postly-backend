import catchAsync from '../../utils/catchAsync';
import { Request, Response } from 'express';
import { UserServices } from './user.service';
import sendResponse from '../../utils/sendResponse';

const createUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.createUserIntoDb(req.body);
  console.log('result', result);
  res.status(result.statusCode || 201).json({
    success: result.success,
    statusCode: result.statusCode,
    message: result.message,
    token: result.token,
    data: result.data,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.getAllUsersFromDb();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All users retrieved successfully',
    data: result,
  });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.id;
  const result = await UserServices.updateUserFromDb(userId, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User updated successfully',
    data: result,
  });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.id;
  console.log('userId', userId);
  const result = await UserServices.deleteUserFromDb(userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User deleted successfully',
    data: result,
  });
});

const followOrUnFollow = catchAsync(async (req, res) => {
  const { followerId, followeeId } = req.body;

  try {
    const result = await UserServices.followUser(followerId, followeeId);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

const getSingleUSer = catchAsync(async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      statusCode: 401,
      message: 'You have no access to this route',
    });
  }
  const token = authHeader.split(' ')[1];
  const result = await UserServices.getSingleUSerFromDb(token);
  return res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'your decoded info',
    data: result,
  });
});

const updatedUSer = catchAsync(async (req, res) => {
  const payload = req.body;
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      statusCode: 401,
      message: 'You have no access to this route',
    });
  }
  const token = authHeader.split(' ')[1];
  const result = await UserServices.getUpdatedUser(token, payload);
  return res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'your decoded updated info',
    data: result,
  });
});

export const UserController = {
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,
  followOrUnFollow,
  getSingleUSer,
  updatedUSer,
};
