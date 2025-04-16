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
    const scenarioId = Number(req.params.scenarioId);
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

const getScenarioFiles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const scenarioId = req.params.scenarioId;

    const files = await db.ScenarioFile.findAll({
      where: {
        scenarioId: scenarioId,
      },
      // Optional: You might want to exclude the large base64 field
      // if you only need metadata (like path or id) in some contexts.
      // attributes: { exclude: ['base64'] }
    });

    if (!files || files.length === 0) {
      return res.status(404).json({ message: 'No files found for this scenario.' });
    }

    // Send the array of found file records back to the client
    res.json(files);

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
  getScenarioFiles,
  getScenario,
  getAllScenarios,
};
