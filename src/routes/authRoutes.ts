import { Router } from 'express';

import { login,  authenticate, logout } from '../controllers/authController';

const router = Router();

router.post("/login", login)
router.post("/authenticate", authenticate)
router.post("/logout", logout)


export default router;

