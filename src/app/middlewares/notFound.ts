/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';

const notFound = (req: Request, res: Response, next: NextFunction) : any => {
  const error = new Error(`API Not Found ${req.url}`)
  return res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: error.message,
    error: error.stack,
  });
};

export default notFound;