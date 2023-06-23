import { Router } from 'express';

import { login,  authenticate } from '../controllers/authController';

const router = Router();

router.post("/login", login)
router.post("/authenticate", authenticate)


export default router;