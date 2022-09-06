import { requestMessage } from './authService';
import { NextFunction, Request, Response } from 'express';

export async function request(req: Request, res: Response, next: NextFunction) {
  try {
    const { address, chain, network } = req.body;

    const message = await requestMessage({
      address,
      chain,
      network,
    });

    res.status(200).json({ message });
  } catch (err) {
    next(err);
  }
}
