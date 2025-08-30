import express from 'express';
import { getThemes, getBranches } from '../controllers/lookupController.js';

const router = express.Router();
router.get('/themes', getThemes);
router.get('/branches', getBranches);

export default router;