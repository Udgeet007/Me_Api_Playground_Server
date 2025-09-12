import express from 'express';
import { createProfile, getAllProfiles, searchProfilesBySkills, updateProfile } from '../controllers/profile.controller.js';
const router = express.Router();


router.post('/create',createProfile);
router.get('/profiles',getAllProfiles);
router.put('/update/:id',updateProfile);
router.get('/search/skills', searchProfilesBySkills);


export default router;