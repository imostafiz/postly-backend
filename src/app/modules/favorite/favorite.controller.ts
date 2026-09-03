/* eslint-disable @typescript-eslint/no-unused-vars */

import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { FavoriteServices } from "./favorite.service";


// Create Favorite
const createFavorite = catchAsync(async (req, res) => {
  const { user, post} = req.body;
 

  const result = await FavoriteServices.createFavoriteIntoDB(user, post);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Successfully added post to favorites",
    data: result,
  });
});

const getAllFavorite = catchAsync(async (req, res) => {
  const { userId } = req.params;

  const result = await FavoriteServices.getAllFavoriteFromDB(userId);

  if (!result || result.length === 0) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "not found favorite posts",
      data: result,
    });
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Successfully Retrieved favorites post",
    data: result,
  });
});

// Delete Favorite
const deleteFavorite = catchAsync(async (req, res, next) => {
  const { user, post } = req.body;

  const result = await FavoriteServices.deleteFavoriteFromDB(user, post);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Successfully removed post from favorites",
    data: result,
  });
});

const getAllMyFavorite = catchAsync(async (req, res) => {
  const { userId } = req.params;  // Get userId from params

  const result = await FavoriteServices.getAllFavoriteFromDB(userId);

  if (!result || result.length === 0) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "No favorite posts found",
      data: result,
    });
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Successfully retrieved favorite posts",
    data: result,
  });
});


export const FavoriteControllers = {
  createFavorite,
  deleteFavorite,
  getAllFavorite,
  getAllMyFavorite
};
