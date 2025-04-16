import { Request, Response, NextFunction } from 'express';
import db from '../../database';


const createSimulation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const newScenario = await db.CoachonCueScenario.create(req.body);
        res.status(201).json(newScenario);
    } catch (error) {
        console.error(error);
        next(error);
    }
};


const getSimulation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const scenarioId = req.params.scenarioId; // Access the ID here
        const scenario = await db.CoachonCueScenario.findByPk(scenarioId);
        res.status(200).json(scenario);
    } catch (error) {
        console.error(error);
        next(error);
    }
};


const getAllSimulation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const scenarios = await db.CoachonCueScenario.findAll();
        res.json(scenarios);
    } catch (error) {
        console.error(error);
        next(error);
    }
};

export default {
    createSimulation,
    getSimulation,
    getAllSimulation,
};
