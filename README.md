# fileXlr - MERN Stack File Metadata Analyzer

> A deep, ExifTool-inspired web application built with the **MERN Stack** (MongoDB, Express, React, Node.js) featuring EXIF/IPTC/XMP tag inspection, side-by-side file comparison, GPS geolocation mapping, multi-format exports (JSON, CSV, XML), JWT authentication, and dual state management (**Context API** + **Redux Toolkit**).

---

## Table of Contents
1. [Introduction](#1-introduction)
2. [Key Features](#2-key-features)
3. [System Architecture](#3-system-architecture)
4. [Technologies Used](#4-technologies-used)
5. [Development Methodology](#5-development-methodology)
6. [Frontend Architecture](#6-frontend-architecture)
   - [Context API vs Redux Toolkit Split](#context-api-vs-redux-toolkit-split)
   - [Views & Tabs](#views--tabs)
   - [Component Breakdown](#component-breakdown)
7. [Backend Architecture & Modules](#7-backend-architecture--modules)
   - [Module Explanations](#module-explanations)
   - [Centralized Error Middleware](#centralized-error-middleware)
8. [API Documentation](#8-api-documentation)
9. [Installation & Setup Guide](#9-installation--setup-guide)
10. [Render Deployment Guide](#10-render-deployment-guide)

---

## 1. Introduction

**fileXlr** is an enterprise-grade file metadata extraction and analysis platform designed for digital forensics, media producers, developers, and security analysts. Inspired by Phil Harvey's renowned **ExifTool** CLI utility, **fileXlr** brings raw binary metadata parsing to the web with an interactive GUI, terminal output mode, GPS mapping, side-by-side comparison matrix, and persistent cloud storage via MongoDB Atlas.

Whether inspecting camera shutter speeds and lens models from raw JPEG images, ID3 track tags from MP3 audio files, structure metadata from PDF documents, or calculating cryptographic MD5/SHA-256 checksums, **fileXlr** processes files rapidly and presents tags in standard EXIF, IPTC, XMP, GPS, and System categories.

---

## 2. Key Features

- 📸 **Multi-Format Metadata Parsing**:
  - **Images** (JPEG, PNG, TIFF, WEBP): EXIF, IPTC, XMP, Camera Make/Model, Lens specification, Shutter speed, Aperture, ISO, Color profile, Focal length, Resolution.
  - **Audio/Video** (MP3, WAV, FLAC, MP4, MKV): Codec, Container format, Duration, Bitrate, Sample rate, Channels, ID3 Title/Artist/Album tags.
  - **Documents** (PDF, TXT): PDF version, Page count, Author, Title, Creator tool, Line/Word/Character counts.
  - **System & Security**: File size, MIME type, File extension, MD5 and SHA-256 cryptographic checksums.
- 💻 **ExifTool CLI Terminal View**: Toggle terminal mode to inspect formatted stdout output mimicking `exiftool -all:all -g file.ext`.
- 🗺️ **Interactive GPS Geolocation Map**: Automatically detects embedded GPS metadata coordinates and renders interactive maps with Google Maps links.
- 🔀 **Side-by-Side Metadata Comparer**: Diff matrix comparing two files simultaneously with highlighted attribute differences.
- 📤 **Multi-Format Export**: Export parsed metadata to `.json`, `.csv`, or `.xml` format for offline analysis.
- ⚡ **Instant 1-Click Test Demos**: Built-in sample triggers for DSLR photos with GPS and MP3 tracks to test extraction immediately without local uploads.
- 🔐 **JWT Authentication**: User registration and login powered by JSON Web Tokens and `bcryptjs` password hashing.
- 💾 **MongoDB History Persistence**: Save analysis reports to MongoDB Atlas for later inspection, filtering, and deletion.

---

## 3. System Architecture

```
                       ┌──────────────────────────────────────────┐
                       │          React 18 SPA (Vite)             │
                       │           (fileXlr Frontend)             │
                       └──────────────────┬───────────────────────┘
                                          │
                  ┌───────────────────────┴───────────────────────┐
                  │                                               │
        ┌─────────▼─────────┐                           ┌─────────▼─────────┐
        │   Context API     │                           │   Redux Toolkit   │
        │ - AuthContext     │                           │ - fileSlice       │
        │ - ThemeContext    │                           │ - historySlice    │
        └───────────────────┘                           └───────────────────┘
                                          │
                                   REST API / Axios
                                          │
                       ┌──────────────────▼───────────────────────┐
                       │       Express.js Server (Node.js)        │
                       │            (fileXlr Backend)             │
                       └──────────────────┬───────────────────────┘
                                          │
       ┌──────────────────────────────────┼──────────────────────────────────┐
       │                                  │                                  │
┌──────▼────────────────┐      ┌──────────▼───────────┐      ┌───────────────▼─────────┐
│ Centralized Error     │      │ Metadata Extractors  │      │ MongoDB Atlas Database  │
│ Middleware            │      │ (ExifReader, MM,     │      │ (User & MetadataReport  │
│ (ApiError Handler)    │      │  PDF-Parse, Crypto)  │      │  Schemas)               │
└───────────────────────┘      └──────────────────────┘      └─────────────────────────┘
```

---

## 4. Technologies Used

### Frontend Stack
- **React 18**: UI framework.
- **Vite 6**: Fast frontend build tool.
- **TailwindCSS**: Utility-first CSS styling with custom dark theme.
- **Redux Toolkit (`@reduxjs/toolkit`)**: Global state management for file analysis, comparison, search/filter, and DB history.
- **React Context API**: Lightweight context state for user JWT authentication and dark/CLI view mode toggles.
- **Lucide React**: Vector icons.
- **Axios**: HTTP client for API requests.
- **File-Saver**: Client-side file downloader for JSON/CSV/XML exports.

### Backend Stack
- **Node.js & Express.js**: Asynchronous RESTful backend server.
- **MongoDB & Mongoose**: NoSQL document database and Object Data Modeling (ODM).
- **ExifReader**: Full-featured EXIF, IPTC, and XMP image metadata parser.
- **Music-Metadata**: Audio/Video ID3 and container parser.
- **PDF-Parse**: PDF document header parser.
- **JSON Web Token (`jsonwebtoken`)**: Secure stateless authentication tokens.
- **Bcryptjs**: Password hashing algorithm.
- **Multer**: Multi-part file upload processing middleware.
- **Crypto & Mime-Types**: Node core crypto checksum calculation and MIME identification.

---

## 5. Development Methodology

**fileXlr** follows a **modular, component-driven design** paired with **layered separation of concerns**:

1. **State Management Isolation**: UI preferences (Dark mode, CLI view) and User Auth (JWT, tokens) are isolated in lightweight **React Contexts** (`AuthContext`, `ThemeContext`). Heavy application domain data (file upload metadata, search filters, side-by-side comparison state, MongoDB history) is managed in **Redux Toolkit slices** (`fileSlice`, `historySlice`).
2. **Defensive Error Handling**: Centralized error middleware ensures that every operational error (invalid payload, oversized file, expired JWT, Mongoose validation failure, or database timeout) returns a standardized JSON response format.
3. **In-Memory Fallback**: If MongoDB is temporarily unreachable, the application automatically switches to a degraded in-memory store so metadata analysis and guest exploration remain 100% functional.

---

## 6. Frontend Architecture

### Context API vs Redux Toolkit Split

| State Domain | Managed By | Rationale |
| :--- | :--- | :--- |
| User Session (JWT Token, User Profile, Auth Modal) | **Context API** (`AuthContext.jsx`) | Top-level auth state consumed universally across components without complex action dispatchers. |
| UI Theme & View Mode (Dark Mode, CLI Mode) | **Context API** (`ThemeContext.jsx`) | Presentational toggle affecting root DOM classes and view components. |
| Active File Metadata & Extraction State | **Redux Toolkit** (`fileSlice.js`) | Complex state involving single uploads, batch queues, active category tabs, search queries, and dual-file comparison state. |
| Database History & Saved Reports | **Redux Toolkit** (`historySlice.js`) | Async thunk workflows (`fetchHistory`, `saveReport`, `deleteReport`) with pending/fulfilled/rejected reducer cycles. |

---

### Views & Tabs

1. **Metadata Explorer (`activeTab = 'viewer'`)**: Main view containing the drag-and-drop file uploader, instant test demo triggers, category tab filters (EXIF, IPTC, XMP, GPS, System, Audio, Video, Document), search bar, GPS map, and raw CLI terminal viewer.
2. **Compare Files (`activeTab = 'compare'`)**: Dual-file inspector displaying File A vs File B in a side-by-side matrix with highlighted tag differences.
3. **Batch Processor (`activeTab = 'batch'`)**: Queue uploader allowing users to upload up to 10 files simultaneously for batch extraction.
4. **Saved History (`activeTab = 'history'`)**: Grid layout displaying saved metadata reports from MongoDB Atlas with full inspection and deletion options.

---

### Component Breakdown

#### `src/components/Navbar.jsx`
- **Purpose**: Top header bar containing brand logo (`fileXlr`), tab navigation buttons, Dark/Light mode toggle, ExifTool CLI view toggle, and user authentication status / login trigger.

#### `src/components/FileUpload.jsx`
- **Purpose**: Drag-and-drop upload zone supporting image, audio, video, document, and binary files up to 50MB. Dispatches `analyzeFile` or `analyzeBatch` Redux thunks.

#### `src/components/TagViewer.jsx`
- **Purpose**: Primary metadata explorer rendering file summary metrics (size, MIME, tag count, hashes), category pills filter, real-time tag search bar, grouped metadata tables, and copy-tag actions.

#### `src/components/ExifCliViewer.jsx`
- **Purpose**: Command-line interface view mimicking traditional ExifTool terminal output (`exiftool -all:all -g "image.jpg"`). Includes one-click copy stdout button.

#### `src/components/GpsMapView.jsx`
- **Purpose**: Displays embedded GPS coordinates (latitude, longitude, altitude) extracted from camera EXIF data using interactive maps and Google Maps links.

#### `src/components/FileComparer.jsx`
- **Purpose**: Side-by-side diff matrix comparing metadata tags between File A and File B with highlighted tag discrepancies.

#### `src/components/ExportModal.jsx`
- **Purpose**: Modal overlay allowing users to export extracted file metadata into JSON, CSV, or XML format.

#### `src/components/AuthModal.jsx`
- **Purpose**: Login and Registration modal powered by `AuthContext` supporting JWT authentication and form validation.

#### `src/components/HistoryView.jsx`
- **Purpose**: Database report management view rendering saved MongoDB reports with inspect and delete actions.

#### `src/components/DemoFiles.jsx`
- **Purpose**: Quick 1-click test file buttons (DSLR EXIF Photo with GPS, MP3 Track with ID3 tags) for instant evaluation without uploading local files.

---

## 7. Backend Architecture & Modules

### Module Explanations

- **`server.js`**: Application entry point configuring Express, CORS, body parsers, mounting API routes (`/api/auth`, `/api/metadata`), root welcome handler (`GET /`), and attaching centralized error middleware.
- **`config/db.js`**: Connects Mongoose to the MongoDB Atlas connection string with timeout parameters and fallback warning logs.
- **`utils/ApiError.js`**: Custom operational error class extending native `Error` with HTTP `statusCode` and structured error arrays.
- **`middleware/errorHandler.js`**: Centralized error middleware formatting standard JSON error payloads for operational, validation, JWT, and upload errors.
- **`middleware/authMiddleware.js`**: JWT verification middleware inspecting `Authorization: Bearer <token>` headers to protect authenticated endpoints.
- **`middleware/uploadMiddleware.js`**: Multer disk storage configuration handling temporary multi-part file uploads to `temp_uploads/`.
- **`models/User.js`**: Mongoose user schema with password encryption pre-save hook (`bcryptjs`) and `getSignedJwtToken()` helper.
- **`models/MetadataReport.js`**: Mongoose report schema storing parsed metadata, tag counts, category breakdown, hashes, and GPS coordinates.
- **`utils/metadataExtractor.js`**: Deep metadata parsing module extracting EXIF/IPTC/XMP (`exifreader`), Audio/Video (`music-metadata`), PDF documents (`pdf-parse`), MD5/SHA256 checksums (`crypto`), and generating raw ExifTool stdout text.
- **`controllers/authController.js`**: Handles user registration, login, token generation, and current profile fetching.
- **`controllers/metadataController.js`**: Handles single file analysis, batch processing, saving reports to MongoDB, history listing, and report deletion.
- **`routes/authRoutes.js`**: Express router mounting auth endpoints under `/api/auth`.
- **`routes/metadataRoutes.js`**: Express router mounting metadata endpoints under `/api/metadata`.

---

### Centralized Error Middleware

All backend operational errors flow through `errorHandler.js` to ensure consistent response structures:

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation Error",
  "errors": [
    "Please provide a valid email address"
  ]
}
```

---

## 8. API Documentation

### Root & Health Endpoints

#### 1. Root Welcome Route
- **Method**: `GET`
- **Endpoint**: `/`
- **Auth**: None
- **Description**: Returns API welcome message and documentation links.
- **Response**:
  ```json
  {
    "success": true,
    "message": "Welcome to fileXlr File Metadata Analyzer API",
    "status": "online",
    "version": "1.0.0"
  }
  ```

#### 2. Server Health Check
- **Method**: `GET`
- **Endpoint**: `/api/health`
- **Auth**: None
- **Description**: Checks backend service status and CORS origins.

---

### Authentication Endpoints (`/api/auth`)

#### 3. User Registration
- **Method**: `POST`
- **Endpoint**: `/api/auth/register`
- **Auth**: None
- **Body Payload**:
  ```json
  {
    "name": "Alex Mercer",
    "email": "alex@example.com",
    "password": "password123"
  }
  ```
- **Response**: Returns signed JWT token and user profile object.

#### 4. User Login
- **Method**: `POST`
- **Endpoint**: `/api/auth/login`
- **Auth**: None
- **Body Payload**:
  ```json
  {
    "email": "alex@example.com",
    "password": "password123"
  }
  ```
- **Response**: Returns signed JWT token and user profile object.

#### 5. Get Current Profile
- **Method**: `GET`
- **Endpoint**: `/api/auth/me`
- **Auth**: Required (`Bearer <token>`)
- **Response**: Returns authenticated user profile.

---

### Metadata Endpoints (`/api/metadata`)

#### 6. Analyze Single File
- **Method**: `POST`
- **Endpoint**: `/api/metadata/analyze`
- **Auth**: None
- **Content-Type**: `multipart/form-data`
- **Payload**: `file` (Binary file)
- **Description**: Extracts EXIF, IPTC, XMP, GPS, Audio, Document metadata, MD5, SHA256 hashes, and raw ExifTool stdout.

#### 7. Analyze Batch Files
- **Method**: `POST`
- **Endpoint**: `/api/metadata/analyze-batch`
- **Auth**: None
- **Content-Type**: `multipart/form-data`
- **Payload**: `files` (Array of up to 10 files)
- **Description**: Processes multiple files in batch and returns array of extracted metadata reports.

#### 8. Save Metadata Report
- **Method**: `POST`
- **Endpoint**: `/api/metadata/save`
- **Auth**: Optional (`Bearer <token>`)
- **Body Payload**:
  ```json
  {
    "metadataResult": { /* Extracted Metadata Object */ }
  }
  ```
- **Description**: Saves an extracted analysis report to MongoDB Atlas.

#### 9. Get User Saved History
- **Method**: `GET`
- **Endpoint**: `/api/metadata/history`
- **Auth**: Optional (`Bearer <token>`)
- **Description**: Fetches list of saved metadata reports from MongoDB Atlas sorted by newest first.

#### 10. Get Report by ID
- **Method**: `GET`
- **Endpoint**: `/api/metadata/:id`
- **Auth**: None
- **Description**: Retrieves a single metadata report by ID.

#### 11. Delete Saved Report
- **Method**: `DELETE`
- **Endpoint**: `/api/metadata/:id`
- **Auth**: Optional (`Bearer <token>`)
- **Description**: Deletes a saved report from MongoDB Atlas.

---

## 9. Installation & Setup Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **NPM**: v9.0.0 or higher
- **MongoDB**: Local MongoDB instance or MongoDB Atlas connection string

---

### Step 1: Clone Repository
```bash
git clone https://github.com/your-username/filexlr.git
cd filexlr
```

---

### Step 2: Configure Backend Environment
1. Navigate to backend directory:
   ```bash
   cd backend
   ```
2. Install backend dependencies:
   ```bash
   npm install
   ```
3. Verify `.env` file in `backend/.env`:
   ```env
   PORT=5001
   MONGO_URI=mongodb+srv://nahinkhanpattan:098765454@predpostai.pylpq7e.mongodb.net/filexlr?retryWrites=true&w=majority
   JWT_SECRET=exiftool_super_secret_jwt_key_987654321_secure
   FRONTEND_URL=http://localhost:5173
   NODE_ENV=development
   ```
4. Start backend development server:
   ```bash
   npm run dev
   ```

---

### Step 3: Configure Frontend Environment
1. Open a new terminal and navigate to frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Verify `.env` file in `frontend/.env`:
   ```env
   VITE_API_URL=http://localhost:5001/api
   ```
4. Start frontend development server:
   ```bash
   npm run dev
   ```
5. Open browser at `http://localhost:5173`.

---

## 10. Render Deployment Guide

The project includes a ready-to-use [`render.yaml`](file:///c:/Users/nben1/Documents/FileX/render.yaml) file for Render deployment.

### Deploying Frontend as a Static Site (Recommended)
1. On [Render Dashboard](https://dashboard.render.com/), click **New +** $\rightarrow$ **Static Site**.
2. Set **Root Directory**: `frontend`
3. Set **Build Command**: `npm run build`
4. Set **Publish Directory**: `dist`
5. Add Environment Variable:
   - `VITE_API_URL`: `https://your-backend-name.onrender.com/api`

### Deploying Backend as a Web Service
1. On Render Dashboard, click **New +** $\rightarrow$ **Web Service**.
2. Set **Root Directory**: `backend`
3. Set **Build Command**: `npm install`
4. Set **Start Command**: `node server.js`
5. Add Environment Variables:
   - `PORT`: `10000`
   - `MONGO_URI`: `mongodb+srv://nahinkhanpattan:098765454@predpostai.pylpq7e.mongodb.net/filexlr?retryWrites=true&w=majority`
   - `JWT_SECRET`: `your_random_secret_key`
   - `FRONTEND_URL`: `https://your-frontend-name.onrender.com`

---

## License

This project is open source and available under the [MIT License](LICENSE).
