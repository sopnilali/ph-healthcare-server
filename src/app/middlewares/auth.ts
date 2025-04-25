import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import config from '../config';
import AppError from '../errors/AppError';
import catchAsync from '../utils/catchAsync';
import verifyToken from '../utils/verifyToken';
import { UserRole, UserStatus } from '@prisma/client';
import prisma from '../utils/prisma';

const auth = (...roles: string[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    let token = null;
    // if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    //   token = req.headers.authorization.split(" ")[1];
    // }
    // // without Bearer 
    token = req.headers.authorization
    // checking if the token is missing
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
    }

    // checking if the given token is valid
    const decoded = await verifyToken(token, config.jwt.jwt_access_secret as string)


    const role = (decoded as JwtPayload).role

    if (roles && !roles.includes(role as UserRole)) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'You are not authorized!',
      );
    }
    req.user = decoded;
    next();
  });
};




export default auth;