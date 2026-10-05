const mongoose = require('mongoose');

const metadataReportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // Can be anonymous if guest saves or saved in guest session
    },
    fileName: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    fileCategory: {
      type: String,
      enum: ['Image', 'Audio', 'Video', 'Document', 'Binary/Other'],
      default: 'Binary/Other',
    },
    tagCount: {
      type: Number,
      default: 0,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    rawExifToolOutput: {
      type: String,
    },
    hashes: {
      md5: String,
      sha256: String,
    },
    gpsCoordinates: {
      latitude: Number,
      longitude: Number,
      altitude: Number,
      locationName: String,
    },
    starred: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('MetadataReport', metadataReportSchema);
