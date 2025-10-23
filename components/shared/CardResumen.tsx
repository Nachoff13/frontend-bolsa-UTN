import React from 'react';
import { CardResumenProps } from '@/types/Components/CardResumenProps';

export default function CardResumen({ titulo, descripcion, cantidad, icono }: CardResumenProps) {
  return (
    <div className="rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-[#ecf4f4ff] dark:bg-[#1e1e1e] p-7 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col">
      {/* Header con título e ícono */}
      <div className="flex justify-between items-start mb-5">
        <h3 className="text-gray-700 dark:text-gray-200 font-semibold text-base">{titulo}</h3>
        <div className="text-gray-600 dark:text-gray-400 text-2xl">
          {icono}
        </div>
      </div>
      
      {/* Número principal */}
      <div className="text-4xl font-bold text-gray-800 dark:text-white mb-3">
        {cantidad}
      </div>
      
      {/* Descripción */}
      <p className="text-gray-500 dark:text-gray-400 text-base">
        {descripcion}
      </p>
    </div>
  );
}
