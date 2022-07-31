import express from 'express';
import { wodsController } from '../controllers/wods.controller.js';

const wodsRouter = express.Router();

wodsRouter.get('/wods', wodsController.getAll);

export default wodsRouter;
