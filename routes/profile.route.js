import express from 'express';
import { createProfile, getAllProfiles } from '../controllers/profile.controller.js';
const router = express.Router();


router.post('/create',createProfile);
router.get('/profiles',getAllProfiles);





export default router;