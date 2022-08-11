import pgdb from '../model/postgres.js';
import { NextFunction, Request, Response } from 'express';

class WodsController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const word = await pgdb.query('SELECT * FROM wods');
      if (word.rows) {
        res.json(word.rows);
      }
    } catch (error: any) {
      res.send(error.message);
    }
  }
}

export const wodsController = new WodsController();
