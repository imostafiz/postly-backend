import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { PostService } from './post.service';
import sendResponse from '../../utils/sendResponse';

const createPost = catchAsync(async (req: Request, res: Response) => {
  const result = await PostService.createPostIntoDb(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Post created successfully',
    data: result,
  });
});

const getAllPost = catchAsync(async (req: Request, res: Response) => {

  const { search, sortBy } = req.query;

  const result = await PostService.getAllPostFromDb(
    search as string,
    sortBy as string
  );
    sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'retrieved all post successfully',
    data: result,
  });
});

const updatePost = catchAsync(async (req: Request, res: Response) => {
  const postId = req.params.id;
  const result = await PostService.updatePostIntoDb(postId, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Successfully updated your post',
    data: result,
  });
});

const getMyPost = catchAsync(async(req:Request,res:Response)=>{
const userId = req.params.id;
const result = await PostService.getMyPostFromDb(userId)
sendResponse(res, {
  statusCode: 200,
  success: true,
  message: 'My all post is here',
  data: result,
});
})

const deletePost = catchAsync(async (req: Request, res: Response) => {
  const postId = req.params.id;
  const result = await PostService.deletePostFromDb(postId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Successfully deleted  your post',
    data: result,
  });
});

export const PostController = {
  createPost,
  getAllPost,
  updatePost,
  deletePost,
  getMyPost
};
