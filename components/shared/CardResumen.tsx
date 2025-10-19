import React from 'react';
import { CardResumenProps } from '@/types/Components/CardResumenProps';

export default function CardResumen({ titulo, descripcion, cantidad, icono }: CardResumenProps) {
  return (
    <div className="rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-shadow duration-200 flex flex-col" style={{ backgroundColor: '#ecf4f4ff' }}>
      {/* Header con título e ícono */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-gray-700 font-semibold text-sm">{titulo}</h3>
        <div className="text-gray-600">
          {icono}
        </div>
      </div>
      
      {/* Número principal */}
      <div className="text-3xl font-bold text-gray-800 mb-2">
        {cantidad}
      </div>
      
      {/* Descripción */}
      <p className="text-gray-500 text-sm">
        {descripcion}
      </p>
    </div>
  );
}
