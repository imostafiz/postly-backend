import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { AuthService } from "./auth.service";


const userLogin = catchAsync(async(req:Request,res:Response)=>{
    const {email, password} = req.body;
    const result  = await AuthService.userLoginService(email,password)
    
    res.status(result.statusCode || 200).json({
        success: result.success,
        statusCode: result.statusCode,
        message: result.message,
        token: result.token, 
        data: result.data,
      });
  
})

const forgetPassword = catchAsync(async(req:Request,res:Response)=>{
const email = req.body.email;
const result = await AuthService.forgetPasswordIntoDb(email)
res.status(200).json({
    success: true,
    statusCode:200,
    message: "Reset token retrieved",
    data: result,
  })
})

const resetPassword = catchAsync(async(req:Request,res:Response)=>{
  const token = req.headers.authorization;

    const result = await AuthService.resetPasswordIntoDb(req.body, token!)
    res.status(200).json({
        success: true,
        statusCode:200,
        message: "Password reset successfully.",
        data: result,
      })
    })


export const AuthController = {
    userLogin,
    forgetPassword,
    resetPassword
}