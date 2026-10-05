import React from 'react';
import { useDispatch } from 'react-redux';
import { setDirectAnalysis, setActiveTab } from '../store/fileSlice';
import { Camera, Music, FileText, Sparkles } from 'lucide-react';

export default function DemoFiles() {
  const dispatch = useDispatch();

  const demoPhotoMetadata = {
    fileName: 'sample_canon_eos_gps.jpg',
    originalName: 'sample_canon_eos_gps.jpg',
    fileSize: 3450200,
    formattedSize: '3.29 MB',
    mimeType: 'image/jpeg',
    fileCategory: 'Image',
    tagCount: 28,
    hashes: {
      md5: 'e2fc714c4727ee9395f324cd2e7f331f',
      sha256: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
    },
    gpsCoordinates: {
      latitude: 37.774929,
      longitude: -122.419416,
      altitude: 45,
      locationName: 'San Francisco, CA (37.7749° N, 122.4194° W)',
    },
    metadata: {
      System: [
        { name: 'File Name', value: 'sample_canon_eos_gps.jpg', description: 'Original file name' },
        { name: 'File Size', value: '3.29 MB', description: 'File size on disk' },
        { name: 'MIME Type', value: 'image/jpeg', description: 'Media type' },
        { name: 'MD5 Checksum', value: 'e2fc714c4727ee9395f324cd2e7f331f', description: 'MD5 checksum' },
        { name: 'SHA-256 Checksum', value: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4', description: 'SHA-256 hash' },
      ],
      EXIF: [
        { name: 'Make', value: 'Canon', description: 'Camera Manufacturer' },
        { name: 'Model', value: 'Canon EOS 5D Mark IV', description: 'Camera Model' },
        { name: 'LensModel', value: 'EF24-70mm f/2.8L II USM', description: 'Lens specification' },
        { name: 'ExposureTime', value: '1/500 sec', description: 'Shutter speed' },
        { name: 'FNumber', value: 'f/2.8', description: 'Aperture' },
        { name: 'ISO', value: '100', description: 'ISO Speed' },
        { name: 'FocalLength', value: '70 mm', description: 'Focal length' },
        { name: 'DateTimeOriginal', value: '2026:08:15 14:32:10', description: 'Photo capture date' },
        { name: 'ColorSpace', value: 'sRGB', description: 'Color profile' },
        { name: 'ImageWidth', value: '6720 pixels', description: 'Width' },
        { name: 'ImageHeight', value: '4480 pixels', description: 'Height' },
        { name: 'BitsPerSample', value: '8, 8, 8', description: 'Color depth' },
        { name: 'Flash', value: 'Flash did not fire', description: 'Flash mode' },
        { name: 'White Balance', value: 'Auto', description: 'White balance setting' },
      ],
      IPTC: [
        { name: 'By-line (Author)', value: 'Alex Mercer', description: 'Photographer name' },
        { name: 'Copyright Notice', value: '© 2026 Alex Mercer Photography. All rights reserved.', description: 'Copyright' },
        { name: 'Caption/Abstract', value: 'Golden Gate Bridge sunset taken during clear sky evening.', description: 'Description' },
        { name: 'Keywords', value: 'Landscape, San Francisco, Sunset, Canon EOS', description: 'Tags' },
      ],
      XMP: [
        { name: 'CreatorTool', value: 'Adobe Photoshop Lightroom Classic 13.2', description: 'Editing suite' },
        { name: 'Rating', value: '5 Stars', description: 'User rating' },
        { name: 'Format', value: 'image/jpeg', description: 'MIME' },
      ],
      GPS: [
        { name: 'GPS Latitude', value: '37.774929 N', description: 'Degrees North' },
        { name: 'GPS Longitude', value: '-122.419416 W', description: 'Degrees West' },
        { name: 'GPS Altitude', value: '45 m', description: 'Altitude above sea level' },
      ],
      Audio: [],
      Video: [],
      Document: [],
    },
    rawExifToolOutput: `ExifTool Version Number         : 12.80
File Name                       : sample_canon_eos_gps.jpg
Directory                       : ./samples
File Size                       : 3.29 MB
File Modification Date/Time     : 2026:08:15 14:32:10+00:00
File Type                       : JPEG
MIME Type                       : image/jpeg
MD5 Checksum                    : e2fc714c4727ee9395f324cd2e7f331f
SHA256 Checksum                 : 8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4

---- EXIF ----
Make                            : Canon
Camera Model Name               : Canon EOS 5D Mark IV
Lens Model                      : EF24-70mm f/2.8L II USM
Exposure Time                   : 1/500
F Number                        : 2.8
ISO                             : 100
Focal Length                    : 70.0 mm
Date/Time Original              : 2026:08:15 14:32:10
Color Space                     : sRGB
Image Width                     : 6720
Image Height                    : 4480

---- IPTC ----
By-line                         : Alex Mercer
Copyright Notice                : © 2026 Alex Mercer Photography. All rights reserved.
Caption-Abstract                : Golden Gate Bridge sunset taken during clear sky evening.

---- GPS ----
GPS Latitude                    : 37 deg 46' 29.74" N
GPS Longitude                   : 122 deg 25' 9.90" W
GPS Altitude                    : 45 m Above Sea Level`,
  };

  const demoAudioMetadata = {
    fileName: 'cyberpunk_synthwave_theme.mp3',
    originalName: 'cyberpunk_synthwave_theme.mp3',
    fileSize: 8450120,
    formattedSize: '8.06 MB',
    mimeType: 'audio/mpeg',
    fileCategory: 'Audio',
    tagCount: 16,
    hashes: {
      md5: 'a1b2c3d4e5f67890123456789abcdef0',
      sha256: '99887766554433221100aabbccddeeff99887766554433221100aabbccddeeff',
    },
    metadata: {
      System: [
        { name: 'File Name', value: 'cyberpunk_synthwave_theme.mp3', description: 'Audio file name' },
        { name: 'File Size', value: '8.06 MB', description: 'Disk size' },
        { name: 'MIME Type', value: 'audio/mpeg', description: 'Media type' },
        { name: 'MD5 Checksum', value: 'a1b2c3d4e5f67890123456789abcdef0', description: 'Hash' },
      ],
      EXIF: [],
      IPTC: [],
      XMP: [],
      GPS: [],
      Audio: [
        { name: 'Codec / Container Format', value: 'MPEG-1 Audio Layer 3 (MP3)', description: 'Container' },
        { name: 'Duration (Seconds)', value: '211.45 sec (3m 31s)', description: 'Length' },
        { name: 'Bitrate', value: '320 kbps', description: 'VBR/CBR Bitrate' },
        { name: 'Sample Rate', value: '44100 Hz', description: 'Sampling rate' },
        { name: 'Channels', value: '2 (Stereo)', description: 'Channel count' },
        { name: 'Title Tag', value: 'Neon Skyline Horizon', description: 'Track Title' },
        { name: 'Artist Tag', value: 'Kavinsky & Gridline', description: 'Artist' },
        { name: 'Album Tag', value: 'Synthwave Odyssey 2088', description: 'Album' },
        { name: 'Year Tag', value: '2026', description: 'Release Year' },
        { name: 'Genre Tag', value: 'Synthwave, Electronic, Cyberpunk', description: 'Genre' },
      ],
      Video: [],
      Document: [],
    },
    rawExifToolOutput: `ExifTool Version Number         : 12.80
File Name                       : cyberpunk_synthwave_theme.mp3
Directory                       : ./samples
File Size                       : 8.06 MB
MIME Type                       : audio/mpeg

---- ID3 / Audio ----
MPEG Audio Version              : 1.0
Audio Layer                     : 3
Audio Bitrate                   : 320 kbps
Sample Rate                     : 44100 Hz
Channel Mode                    : Joint Stereo
Track Title                     : Neon Skyline Horizon
Artist                          : Kavinsky & Gridline
Album                           : Synthwave Odyssey 2088
Genre                           : Synthwave`,
  };

  const loadDemo = (type) => {
    if (type === 'image') dispatch(setDirectAnalysis(demoPhotoMetadata));
    if (type === 'audio') dispatch(setDirectAnalysis(demoAudioMetadata));
    dispatch(setActiveTab('viewer'));
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-5 border border-slate-700/60 shadow-xl mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-500/20 text-blue-400 rounded-xl border border-blue-500/30">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wide text-white flex items-center gap-2">
              Instant ExifTool Test Demos
            </h3>
            <p className="text-xs text-slate-400">
              Try deep EXIF, GPS map, and ID3 Audio extraction with 1-click sample files!
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={() => loadDemo('image')}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30 transition-all hover:scale-[1.02]"
          >
            <Camera className="w-4 h-4" />
            DSLR EXIF + GPS Photo
          </button>

          <button
            onClick={() => loadDemo('audio')}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-600/30 transition-all hover:scale-[1.02]"
          >
            <Music className="w-4 h-4" />
            MP3 Audio ID3 Track
          </button>
        </div>
      </div>
    </div>
  );
}
