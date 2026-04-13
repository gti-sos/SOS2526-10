import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import DataStore from "nedb";
import express from 'express';

import { SECRET_KEY } from './JWT_token.js';

let userDb = new DataStore({
    filename: './data/users/users.db',
    autoload: true
});

const router = express.Router();

router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    userDb.findOne({ username }, async (err, user) => {
        if (err)
            return res.status(500).send("Server error");
        if (user)
            return res.status(400).send("Username already in use");
        try {
            const hashedPassword = await bcrypt.hash(password, 10);

            userDb.insert({ username, password: hashedPassword }, (err, newUser) => {
                if (err)
                    return res.status(500).send("Error on sign in");
                res.status(201).send("New user created");
            });
        } catch (error) {
            return res.status(500).send("Error while parsing the password");
        }
    });
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    userDb.findOne({ username }, async (err, user) => {
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).send("Credenciales inválidas");
        }

        const token = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    });
});

export default router;