import express from 'express';
import {  request } from './authController';

export const authRouter = express.Router();

authRouter.route('/request-message').post(request);
