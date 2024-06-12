import express from 'express';
import { authRouter } from './auth.router.js';
import { userRouter } from './users.router.js';
import { resumeRouter } from './resumes.router.js';
import { requireAccessToken } from '../middlewares/require-access-token.middleware.js';

const apiRouter = express.Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/users', requireAccessToken, userRouter);
apiRouter.use('/resumes', requireAccessToken, resumeRouter);

export { apiRouter };
