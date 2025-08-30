import express from 'express';
import { auth } from '../middleware/auth.js';
import { listTeams, getTeam, createTeam, joinTeam, leaveTeam, deleteTeam } from '../controllers/teamController.js';

const router = express.Router();
router.use(auth);
router.get('/', listTeams);
router.get('/:id', getTeam);
router.post('/', createTeam);
router.put('/:id/join', joinTeam);
router.put('/:id/leave', leaveTeam);
router.delete('/:id', deleteTeam);

export default router;