import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { useMap } from 'react-leaflet';

const ZoomControls: React.FC = () => {
  const map = useMap();

  return (
    <div className="absolute left-4 bottom-24 flex flex-col gap-2 z-[1100]">
      <button
        aria-label="Zoom in"
        className="w-10 h-10 flex items-center justify-center rounded-full shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-primary-100 dark:hover:bg-primary-900 text-primary-600 dark:text-primary-400 transition-colors"
        onClick={() => map.zoomIn()}
      >
        <Plus size={22} />
      </button>
      <button
        aria-label="Zoom out"
        className="w-10 h-10 flex items-center justify-center rounded-full shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-primary-100 dark:hover:bg-primary-900 text-primary-600 dark:text-primary-400 transition-colors"
        onClick={() => map.zoomOut()}
      >
        <Minus size={22} />
      </button>
    </div>
  );
};

export default ZoomControls;
