import { Express } from 'express';
import { IndexController } from '../../controllers/V1/index';
import { User } from '../../models/user';
import { generateToken, authenticateToken } from '../../auth';
import { getRepository } from 'typeorm';
import paymentRoutes from './payment';

export const setRoutes = (app: Express) => {
    const indexController = new IndexController();

    /**
     * @swagger
     * /v1/item:
     *   get:
     *     summary: Retrieve a list of items
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: A list of items
     */
    app.get('/v1/item', authenticateToken, (req, res) => {
        const showNewFeature = req.splitClient.getTreatment('user-key', 'show-new-feature');
        if (showNewFeature === 'on') {
            // New feature logic
            indexController.getItems(req, res);
        } else {
            // Old feature logic
            indexController.getItems(req, res);
        }
    });

    /**
     * @swagger
     * /v1/item:
     *   post:
     *     summary: Create a new item
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *               description:
     *                 type: string
     *     responses:
     *       200:
     *         description: The created item
     */
    app.post('/v1/item', authenticateToken, (req, res) => {
        indexController.createItem(req, res);
    });

    /**
     * @swagger
     * /v1/register:
     *   post:
     *     summary: Register a new user
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               username:
     *                 type: string
     *               password:
     *                 type: string
     *     responses:
     *       201:
     *         description: User registered successfully
     */
    app.post('/v1/register', async (req, res) => {
        const userRepository = getRepository(User);
        const user = new User();
        user.username = req.body.username;
        await user.setPassword(req.body.password);
        await userRepository.save(user);
        res.sendStatus(201);
    });

    /**
     * @swagger
     * /v1/login:
     *   post:
     *     summary: Log in a user
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               username:
     *                 type: string
     *               password:
     *                 type: string
     *     responses:
     *       200:
     *         description: User logged in successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 token:
     *                   type: string
     *       401:
     *         description: Invalid credentials
     */
    app.post('/v1/login', async (req, res) => {
        const userRepository = getRepository(User);
        const user = await userRepository.findOne({ username: req.body.username });
    if (!user || !(await user.validatePassword(req.body.password))) {
        return res.sendStatus(401);
    }
    const token = generateToken(user);
        res.json({ token });
    });

    app.use('/v1/payment', paymentRoutes);
};