const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect, optionalAuth } = require('../middleware/authMiddleware');
const {
  analyzeSingleFile,
  analyzeBatchFiles,
  saveReport,
  getUserHistory,
  getReportById,
  deleteReport,
} = require('../controllers/metadataController');

// File Upload & Metadata Analysis routes
router.post('/analyze', upload.single('file'), analyzeSingleFile);
router.post('/analyze-batch', upload.array('files', 10), analyzeBatchFiles);

// User history & report CRUD routes
router.post('/save', optionalAuth, saveReport);
router.get('/history', optionalAuth, getUserHistory);
router.get('/:id', getReportById);
router.delete('/:id', optionalAuth, deleteReport);

module.exports = router;
