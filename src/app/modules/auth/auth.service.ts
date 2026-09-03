import config from '../../config';
import { sendEmail } from '../../utils/sendEmail';
import prisma from '../../prisma';
import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const userLoginService = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { success: false, statusCode: 401, message: 'Invalid email or password' };
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return { success: false, statusCode: 401, message: 'Invalid email or password' };
  }
  const jwtPayload = user;
  const accessToken = jwt.sign(
    { id: jwtPayload.id, email: jwtPayload.email, role: jwtPayload.role, name: jwtPayload.name } as object,
    config.jwt_access_secret as string,
    { expiresIn: config.jwt_access_expires_in },
  );
  return {
    success: true,
    statusCode: 200,
    message: 'User login successfully',
    data: jwtPayload,
    token: accessToken,
  };
};

const forgetPasswordIntoDb = async (email: string) => {
  const user = await prisma.user.findFirst({ where: { email } });
  if (!user) {
    throw new Error('User does not exist!');
  }
  const accessToken = jwt.sign(
    { email: user.email, id: user.id },
    config.jwt_access_secret as string,
    { expiresIn: '10min' },
  );

  const link = `${config.reset_pass_ui_link}/api/auth/reset-password/${accessToken}/${user.id}`;

  sendEmail(user.email, link);
  console.log('link', link);
};

const resetPasswordIntoDb = async (
  payload: { email: string; newPassword: string },
  token: string,
) => {
  const decoded = jwt.verify(
    token,
    config.jwt_access_secret as string,
  ) as JwtPayload;
  if (decoded) {
    const hashedPassword = await bcrypt.hash(payload.newPassword, Number(config.bcrypt_salt_round));
    await prisma.user.update({
      where: { email: payload.email },
      data: { password: hashedPassword },
    });

    return 'Password Updated';
  }
};

export const AuthService = {
  userLoginService,
  forgetPasswordIntoDb,
  resetPasswordIntoDb,
};
