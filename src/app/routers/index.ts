import { Router } from 'express';
import { AuthRouter } from '../modules/auth/auth.route';
import { UserRouter } from '../modules/user/user.route';
import { PostRouter } from '../modules/post/post.route';
import { PostCommentRouter } from '../modules/comment/commnet.route';
import { FavoritePostRouter } from '../modules/favorite/favorite.route';
import { LikeRoutes } from '../modules/like/like.route';
import { DisLikeRoutes } from '../modules/disLike/disLike.route';
import { PaymentRouters } from '../modules/payment/payment.route';

const router = Router();

const moduleRoute = [
  {
    path: '/api/auth',
    router: AuthRouter,
  },
  {
    path: '/api/auth',
    router: UserRouter,
  },
  {
    path:'/api/post/favorite',
    router:FavoritePostRouter
  },
  {
    path: '/api/post',
    router: PostRouter,
  },
  {
    path: '/api/comment',
    router: PostCommentRouter,
  },
  {
    path: "/api/likes",
    router: LikeRoutes,
  },
  {
    path: "/api/dislikes",
    router: DisLikeRoutes,
  },
  {
    path:'/api/payment',
    router:PaymentRouters
  }
];

moduleRoute.forEach((route) => router.use(route.path, route.router));

export default router;
