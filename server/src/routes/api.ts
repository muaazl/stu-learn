import express from 'express';
import multer from 'multer';
import { uploadFile, getNotes, searchNotes, getGraphData } from '../controllers/upload-controller';

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Temp storage

router.post('/upload', upload.single('file'), uploadFile);
router.get('/notes', getNotes);
router.get('/search', searchNotes);
router.get('/graph', getGraphData);

export default router;