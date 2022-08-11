import express from 'express';
import { wodsController } from '../controllers/wods.controller.js';
import cors from 'cors';

const wodsRouter = express.Router();

var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

wodsRouter.get('/wods', cors(corsOptions), wodsController.getAll);

export default wodsRouter;
