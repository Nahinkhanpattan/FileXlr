const fs = require('fs');
const ApiError = require('../utils/ApiError');
const { extractMetadata } = require('../utils/metadataExtractor');
const MetadataReport = require('../models/MetadataReport');

// Helper to check DB connection
const isDbConnected = () => MetadataReport.db && MetadataReport.db.readyState === 1;

// In-memory history store fallback if MongoDB is not running
const inMemoryHistory = [];

// @desc    Analyze a single file metadata
// @route   POST /api/metadata/analyze
// @access  Public
exports.analyzeSingleFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new ApiError(400, 'Please upload a file to analyze'));
    }

    const filePath = req.file.path;
    const originalName = req.file.originalname;

    const analysisResult = await extractMetadata(filePath, originalName);

    // Clean up temporary file asynchronously after extraction
    fs.unlink(filePath, (err) => {
      if (err) console.error(`[Cleanup Warning] Could not remove temp file ${filePath}: ${err.message}`);
    });

    return res.status(200).json({
      success: true,
      data: analysisResult,
    });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

// @desc    Analyze multiple files in batch
// @route   POST /api/metadata/analyze-batch
// @access  Public
exports.analyzeBatchFiles = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return next(new ApiError(400, 'Please upload at least one file for batch processing'));
    }

    const results = [];

    for (const file of req.files) {
      try {
        const result = await extractMetadata(file.path, file.originalname);
        results.push(result);
      } catch (err) {
        results.push({
          fileName: file.originalname,
          error: err.message || 'Extraction failed',
        });
      } finally {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      }
    }

    return res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Save metadata report to MongoDB
// @route   POST /api/metadata/save
// @access  Private / Optional Auth
exports.saveReport = async (req, res, next) => {
  try {
    const { metadataResult } = req.body;
    if (!metadataResult) {
      return next(new ApiError(400, 'Metadata analysis payload is required to save report'));
    }

    const userId = req.user ? req.user.id : null;

    if (isDbConnected()) {
      const report = await MetadataReport.create({
        user: userId,
        fileName: metadataResult.fileName,
        originalName: metadataResult.originalName,
        fileSize: metadataResult.fileSize,
        mimeType: metadataResult.mimeType,
        fileCategory: metadataResult.fileCategory,
        tagCount: metadataResult.tagCount,
        metadata: metadataResult.metadata,
        rawExifToolOutput: metadataResult.rawExifToolOutput,
        hashes: metadataResult.hashes,
        gpsCoordinates: metadataResult.gpsCoordinates,
      });

      return res.status(201).json({
        success: true,
        message: 'Metadata report saved successfully',
        data: report,
      });
    } else {
      // In-memory fallback
      const mockReport = {
        _id: 'report_' + Date.now(),
        user: userId || 'guest',
        fileName: metadataResult.fileName,
        originalName: metadataResult.originalName,
        fileSize: metadataResult.fileSize,
        mimeType: metadataResult.mimeType,
        fileCategory: metadataResult.fileCategory,
        tagCount: metadataResult.tagCount,
        metadata: metadataResult.metadata,
        rawExifToolOutput: metadataResult.rawExifToolOutput,
        hashes: metadataResult.hashes,
        gpsCoordinates: metadataResult.gpsCoordinates,
        createdAt: new Date().toISOString(),
      };
      inMemoryHistory.unshift(mockReport);

      return res.status(201).json({
        success: true,
        message: 'Metadata report saved successfully (In-Memory)',
        data: mockReport,
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's saved metadata history
// @route   GET /api/metadata/history
// @access  Private / Optional Auth
exports.getUserHistory = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : null;

    if (isDbConnected()) {
      const query = userId ? { user: userId } : {};
      const reports = await MetadataReport.find(query).sort({ createdAt: -1 }).limit(50);
      return res.status(200).json({
        success: true,
        count: reports.length,
        data: reports,
      });
    } else {
      // In-memory fallback
      const reports = userId 
        ? inMemoryHistory.filter(r => r.user === userId || r.user === 'guest')
        : inMemoryHistory;

      return res.status(200).json({
        success: true,
        count: reports.length,
        data: reports,
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get report by ID
// @route   GET /api/metadata/:id
// @access  Public
exports.getReportById = async (req, res, next) => {
  try {
    const reportId = req.params.id;

    if (isDbConnected()) {
      const report = await MetadataReport.findById(reportId);
      if (!report) {
        return next(new ApiError(404, `Metadata report not found with id ${reportId}`));
      }
      return res.status(200).json({ success: true, data: report });
    } else {
      const report = inMemoryHistory.find(r => r._id === reportId);
      if (!report) {
        return next(new ApiError(404, `Metadata report not found with id ${reportId}`));
      }
      return res.status(200).json({ success: true, data: report });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete saved report
// @route   DELETE /api/metadata/:id
// @access  Private / Optional Auth
exports.deleteReport = async (req, res, next) => {
  try {
    const reportId = req.params.id;

    if (isDbConnected()) {
      const report = await MetadataReport.findById(reportId);
      if (!report) {
        return next(new ApiError(404, `Report not found with id ${reportId}`));
      }
      await report.deleteOne();
      return res.status(200).json({
        success: true,
        message: 'Report deleted successfully',
      });
    } else {
      const index = inMemoryHistory.findIndex(r => r._id === reportId);
      if (index !== -1) {
        inMemoryHistory.splice(index, 1);
      }
      return res.status(200).json({
        success: true,
        message: 'Report deleted successfully (In-Memory)',
      });
    }
  } catch (error) {
    next(error);
  }
};
