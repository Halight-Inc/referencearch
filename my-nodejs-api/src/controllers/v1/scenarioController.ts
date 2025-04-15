import { Request, Response, NextFunction } from 'express';
import db from '../../database';

const createScenario = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const newScenario = await db.CoachonCueScenario.create(req.body);
        res.status(201).json(newScenario);
    } catch (error) {
        console.error(error);
        next(error);
    }
};

const addScenarioFile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const scenarioId = req.params.scenarioId;
    await db.ScenarioFile.create({
      scenarioId: scenarioId,
      path: null,
      base64: req.body.base64,
    });
    res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};


const getScenario = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const scenarioId = req.params.scenarioId;
        const scenario = await db.CoachonCueScenario.findByPk(scenarioId);
        res.status(200).json(scenario);
    } catch (error) {
        console.error(error);
        next(error);
    }
};

const getAllScenarios = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const scenarios = await db.CoachonCueScenario.findAll();
        res.json(scenarios);
    } catch (error) {
        console.error(error);
        next(error);
    }
};

export default {
    createScenario,
    addScenarioFile,
    getScenario,
    getAllScenarios,
};
