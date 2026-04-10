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

// Registro
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    userDb.insert({ username, password: hashedPassword }, (err, newUser) => {
        if (err) return res.status(500).send("Error al registrar");
        res.status(201).send("Usuario creado");
    });
});

// Login
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