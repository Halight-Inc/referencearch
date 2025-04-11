import { Request, Response, NextFunction } from 'express';
import db from '../../database';

const getAllScenarios = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const scenarios = await db.CoachonCueScenario.findAll();
        res.json(scenarios);
    } catch (error) {
        console.error(error);
        next(error);
    }
};

const createScenario = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const newScenario = await db.CoachonCueScenario.create(req.body);
        res.status(201).json(newScenario);
    } catch (error) {
        console.error(error);
        next(error);
    }
};

export default {
    getAllScenarios,
    createScenario,
};
