import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { fullname, email, password } = req.body;
        const user = await prisma.user.create({
            data: {
                fullname,
                email,
                password,
            },
        });

        res.json({ user });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export const signUpController = router;