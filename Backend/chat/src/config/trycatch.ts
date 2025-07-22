import { NextFunction, Request, RequestHandler, Response } from "express";

const Trycatch = (handler: RequestHandler): RequestHandler => {
  return async (req: Request, res: Response, Next: NextFunction) => {
    try {
      await handler(req, res, Next);
    } catch (error: any) {
      res.status(500).json({
        message: error.message,
      });
    }
  };
};

export default Trycatch;
