const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const mime = require('mime-types');
const ExifReader = require('exifreader');
const musicMetadata = require('music-metadata');
const pdfParse = require('pdf-parse');

/**
 * Format bytes into human readable string (KB, MB, GB)
 */
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Extract comprehensive metadata from a file path
 */
async function extractMetadata(filePath, originalFilename) {
  const fileStats = fs.statSync(filePath);
  const fileBuffer = fs.readFileSync(filePath);

  // 1. Calculate File Hashes
  const md5Hash = crypto.createHash('md5').update(fileBuffer).digest('hex');
  const sha256Hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

  // 2. MIME & Extension
  const ext = path.extname(originalFilename).toLowerCase();
  const detectedMime = mime.lookup(originalFilename) || 'application/octet-stream';

  // Base System Metadata
  const systemMeta = [
    { name: 'File Name', value: originalFilename, description: 'Original file name' },
    { name: 'Directory', value: path.dirname(filePath), description: 'Local temporary storage directory' },
    { name: 'File Size', value: formatBytes(fileStats.size), description: 'File size on disk' },
    { name: 'File Size (Bytes)', value: fileStats.size, description: 'Exact byte length' },
    { name: 'File Modification Date/Time', value: fileStats.mtime.toISOString(), description: 'Last modified timestamp' },
    { name: 'File Access Date/Time', value: fileStats.atime.toISOString(), description: 'Last access timestamp' },
    { name: 'File Creation Date/Time', value: fileStats.birthtime.toISOString(), description: 'File creation timestamp' },
    { name: 'File Extension', value: ext.replace('.', '').toUpperCase(), description: 'File extension tag' },
    { name: 'MIME Type', value: detectedMime, description: 'Media type identifier' },
    { name: 'MD5 Checksum', value: md5Hash, description: '128-bit cryptographic hash digest' },
    { name: 'SHA-256 Checksum', value: sha256Hash, description: '256-bit cryptographic hash digest' },
  ];

  let fileCategory = 'Binary/Other';
  const metadataGroups = {
    System: systemMeta,
    EXIF: [],
    IPTC: [],
    XMP: [],
    GPS: [],
    Audio: [],
    Video: [],
    Document: [],
  };

  let gpsData = null;

  // Determine category
  if (detectedMime.startsWith('image/')) {
    fileCategory = 'Image';
  } else if (detectedMime.startsWith('audio/')) {
    fileCategory = 'Audio';
  } else if (detectedMime.startsWith('video/')) {
    fileCategory = 'Video';
  } else if (
    detectedMime.startsWith('text/') ||
    detectedMime.includes('pdf') ||
    detectedMime.includes('word') ||
    detectedMime.includes('document')
  ) {
    fileCategory = 'Document';
  }

  // 3. Extract Image Metadata (EXIF, IPTC, XMP, GPS) using ExifReader
  if (fileCategory === 'Image' || ext === '.jpg' || ext === '.jpeg' || ext === '.png' || ext === '.tiff' || ext === '.webp') {
    try {
      const tags = ExifReader.load(fileBuffer, { expanded: true });

      // Process EXIF Tags
      if (tags.exif) {
        for (const [key, tag] of Object.entries(tags.exif)) {
          if (key === 'MakerNote') continue; // Skip huge binary blob
          metadataGroups.EXIF.push({
            name: tag.description || key,
            rawTag: key,
            value: tag.value ? (Array.isArray(tag.value) ? tag.value.join(', ') : String(tag.value)) : tag.description || '',
            description: `EXIF tag ${key}`,
          });
        }
      }

      // Process IPTC Tags
      if (tags.iptc) {
        for (const [key, tag] of Object.entries(tags.iptc)) {
          metadataGroups.IPTC.push({
            name: key,
            value: Array.isArray(tag) ? tag.map(t => t.description || t.value).join(', ') : (tag.description || String(tag.value || '')),
            description: `IPTC tag ${key}`,
          });
        }
      }

      // Process XMP Tags
      if (tags.xmp) {
        for (const [key, tag] of Object.entries(tags.xmp)) {
          metadataGroups.XMP.push({
            name: key,
            value: typeof tag.value === 'object' ? JSON.stringify(tag.value) : String(tag.value || tag.description || ''),
            description: `XMP tag ${key}`,
          });
        }
      }

      // Process GPS Tags
      if (tags.gps) {
        const lat = tags.gps.Latitude;
        const lon = tags.gps.Longitude;
        const alt = tags.gps.Altitude;

        if (lat !== undefined && lon !== undefined) {
          gpsData = {
            latitude: Number(lat),
            longitude: Number(lon),
            altitude: alt !== undefined ? Number(alt) : null,
            locationName: `Lat: ${lat}, Lon: ${lon}`,
          };

          metadataGroups.GPS.push({ name: 'GPS Latitude', value: lat, description: 'Degrees North/South' });
          metadataGroups.GPS.push({ name: 'GPS Longitude', value: lon, description: 'Degrees East/West' });
          if (alt) metadataGroups.GPS.push({ name: 'GPS Altitude', value: `${alt} m`, description: 'Altitude above sea level' });
        }
      }

      // Process File / PNG / Image specific tags from ExifReader
      if (tags.file) {
        for (const [key, tag] of Object.entries(tags.file)) {
          metadataGroups.EXIF.push({
            name: tag.description ? `${key} (${tag.description})` : key,
            value: String(tag.value || ''),
            description: `File header tag ${key}`,
          });
        }
      }
    } catch (exifErr) {
      console.log(`[ExifReader Notice] File has no EXIF or unparseable headers: ${exifErr.message}`);
    }
  }

  // 4. Extract Audio / Video Metadata using music-metadata
  if (fileCategory === 'Audio' || fileCategory === 'Video' || ['.mp3', '.flac', '.wav', '.ogg', '.m4a', '.mp4', '.mkv', '.avi', '.mov'].includes(ext)) {
    try {
      const mmData = await musicMetadata.parseBuffer(fileBuffer, detectedMime);
      if (mmData.format) {
        const targetGroup = fileCategory === 'Video' ? metadataGroups.Video : metadataGroups.Audio;
        targetGroup.push({ name: 'Codec / Container Format', value: mmData.format.container || 'N/A', description: 'Audio/Video container type' });
        if (mmData.format.duration) targetGroup.push({ name: 'Duration (Seconds)', value: mmData.format.duration.toFixed(2), description: 'Playback length' });
        if (mmData.format.bitrate) targetGroup.push({ name: 'Bitrate', value: `${Math.round(mmData.format.bitrate / 1000)} kbps`, description: 'Data transfer rate' });
        if (mmData.format.sampleRate) targetGroup.push({ name: 'Sample Rate', value: `${mmData.format.sampleRate} Hz`, description: 'Audio sampling frequency' });
        if (mmData.format.numberOfChannels) targetGroup.push({ name: 'Channels', value: mmData.format.numberOfChannels, description: 'Audio channel count' });
        if (mmData.format.lossless !== undefined) targetGroup.push({ name: 'Lossless Encoding', value: mmData.format.lossless ? 'Yes' : 'No', description: 'Compression fidelity' });
      }

      if (mmData.common) {
        const targetGroup = fileCategory === 'Video' ? metadataGroups.Video : metadataGroups.Audio;
        if (mmData.common.title) targetGroup.push({ name: 'Title Tag', value: mmData.common.title, description: 'ID3 Title' });
        if (mmData.common.artist) targetGroup.push({ name: 'Artist Tag', value: mmData.common.artist, description: 'ID3 Artist' });
        if (mmData.common.album) targetGroup.push({ name: 'Album Tag', value: mmData.common.album, description: 'ID3 Album' });
        if (mmData.common.year) targetGroup.push({ name: 'Year Tag', value: mmData.common.year, description: 'Release Year' });
        if (mmData.common.genre) targetGroup.push({ name: 'Genre Tag', value: mmData.common.genre.join(', '), description: 'Genre category' });
      }
    } catch (mmErr) {
      console.log(`[MusicMetadata Notice] Audio/Video extraction error: ${mmErr.message}`);
    }
  }

  // 5. Extract Document Metadata (PDF or Text)
  if (fileCategory === 'Document' || ext === '.pdf' || ext === '.txt') {
    if (ext === '.pdf' || detectedMime === 'application/pdf') {
      try {
        const pdfData = await pdfParse(fileBuffer);
        metadataGroups.Document.push({ name: 'PDF Version', value: pdfData.version || '1.4', description: 'PDF Format Version' });
        metadataGroups.Document.push({ name: 'Total Pages', value: pdfData.numpages, description: 'Number of pages in document' });
        if (pdfData.info) {
          if (pdfData.info.Title) metadataGroups.Document.push({ name: 'Document Title', value: pdfData.info.Title, description: 'PDF Title metadata' });
          if (pdfData.info.Author) metadataGroups.Document.push({ name: 'Author', value: pdfData.info.Author, description: 'Document Author' });
          if (pdfData.info.Producer) metadataGroups.Document.push({ name: 'PDF Producer', value: pdfData.info.Producer, description: 'Software used to generate PDF' });
          if (pdfData.info.Creator) metadataGroups.Document.push({ name: 'Creator Software', value: pdfData.info.Creator, description: 'Creator tool' });
          if (pdfData.info.CreationDate) metadataGroups.Document.push({ name: 'Creation Date', value: pdfData.info.CreationDate, description: 'Creation timestamp' });
        }
      } catch (pdfErr) {
        console.log(`[PDFParse Notice] Document metadata notice: ${pdfErr.message}`);
      }
    } else if (ext === '.txt' || detectedMime.startsWith('text/')) {
      const textContent = fileBuffer.toString('utf-8');
      const lines = textContent.split('\n').length;
      const wordCount = textContent.trim().split(/\s+/).filter(Boolean).length;
      metadataGroups.Document.push({ name: 'Line Count', value: lines, description: 'Number of lines in text file' });
      metadataGroups.Document.push({ name: 'Word Count', value: wordCount, description: 'Total word count' });
      metadataGroups.Document.push({ name: 'Character Count', value: textContent.length, description: 'Total character length' });
    }
  }

  // Calculate total tag count across all groups
  let totalTagCount = 0;
  Object.values(metadataGroups).forEach(group => {
    totalTagCount += group.length;
  });

  // 6. Generate Formatted ExifTool CLI Raw Output
  let rawExifToolLines = [];
  rawExifToolLines.push(`ExifTool Version Number         : 12.80`);
  rawExifToolLines.push(`File Name                       : ${originalFilename}`);
  rawExifToolLines.push(`Directory                       : ./uploads`);
  rawExifToolLines.push(`File Size                       : ${formatBytes(fileStats.size)}`);
  rawExifToolLines.push(`File Modification Date/Time     : ${fileStats.mtime.toISOString()}`);
  rawExifToolLines.push(`File Access Date/Time           : ${fileStats.atime.toISOString()}`);
  rawExifToolLines.push(`File Type                       : ${ext.replace('.', '').toUpperCase()}`);
  rawExifToolLines.push(`MIME Type                       : ${detectedMime}`);
  rawExifToolLines.push(`MD5 Checksum                    : ${md5Hash}`);
  rawExifToolLines.push(`SHA256 Checksum                 : ${sha256Hash}`);

  for (const [groupName, groupTags] of Object.entries(metadataGroups)) {
    if (groupName === 'System') continue; // Already output above
    if (groupTags.length > 0) {
      rawExifToolLines.push(`\n---- ${groupName} ----`);
      groupTags.forEach(tag => {
        const paddedName = (tag.name + '                                ').substring(0, 32);
        rawExifToolLines.push(`${paddedName}: ${tag.value}`);
      });
    }
  }

  const rawExifToolOutput = rawExifToolLines.join('\n');

  return {
    fileName: originalFilename,
    originalName: originalFilename,
    fileSize: fileStats.size,
    formattedSize: formatBytes(fileStats.size),
    mimeType: detectedMime,
    fileCategory,
    tagCount: totalTagCount,
    hashes: {
      md5: md5Hash,
      sha256: sha256Hash,
    },
    gpsCoordinates: gpsData,
    metadata: metadataGroups,
    rawExifToolOutput,
  };
}

module.exports = { extractMetadata, formatBytes };
