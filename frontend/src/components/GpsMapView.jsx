import React from 'react';
import { MapPin, ExternalLink, Navigation } from 'lucide-react';

export default function GpsMapView({ gpsData, fileName }) {
  if (!gpsData || gpsData.latitude === undefined || gpsData.longitude === undefined) {
    return null;
  }

  const { latitude, longitude, altitude, locationName } = gpsData;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 rounded-xl border border-rose-200 dark:border-rose-900/40">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              GPS Geolocation Metadata
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Embedded EXIF coordinates extracted from <span className="font-semibold text-slate-700 dark:text-slate-300">{fileName}</span>
            </p>
          </div>
        </div>

        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/60 rounded-xl border border-rose-200 dark:border-rose-900/60 transition-colors"
        >
          <span>Open in Google Maps</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Coordinate Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
        <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/60 dark:border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Latitude</span>
          <p className="text-sm font-bold font-mono text-slate-800 dark:text-slate-100 mt-0.5">
            {latitude}° N
          </p>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/60 dark:border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Longitude</span>
          <p className="text-sm font-bold font-mono text-slate-800 dark:text-slate-100 mt-0.5">
            {longitude}° W
          </p>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/60 dark:border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Altitude</span>
          <p className="text-sm font-bold font-mono text-slate-800 dark:text-slate-100 mt-0.5">
            {altitude ? `${altitude} meters` : 'N/A'}
          </p>
        </div>
      </div>

      {/* Embedded Map Iframe */}
      <div className="h-64 w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 relative">
        <iframe
          title="GPS Map Location"
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          marginHeight="0"
          marginWidth="0"
          src={`https://maps.google.com/maps?q=${latitude},${longitude}&z=14&output=embed`}
          className="w-full h-full filter contrast-[1.05]"
        />
      </div>
    </div>
  );
}
