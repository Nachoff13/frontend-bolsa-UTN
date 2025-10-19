import React from 'react';
import { FileText, Settings, Check, X } from 'lucide-react';
import CardResumen from './CardResumen';

interface ResumenPostulacionesProps {
  totalPostulaciones?: number;
  enRevision?: number;
  aprobadas?: number;
  rechazadas?: number;
}

export default function ResumenPostulaciones({ 
  totalPostulaciones = 0,
  enRevision = 0,
  aprobadas = 0,
  rechazadas = 0
}: ResumenPostulacionesProps) {
  const data = [
    { 
      titulo: 'Total postulaciones', 
      descripcion: 'Todas las aplicaciones', 
      cantidad: totalPostulaciones, 
      icono: <FileText size={20} /> 
    },
    { 
      titulo: 'En revisión', 
      descripcion: 'Pendientes de respuesta', 
      cantidad: enRevision, 
      icono: <Settings size={20} /> 
    },
    { 
      titulo: 'Aprobadas', 
      descripcion: 'Invitaciones a entrevista', 
      cantidad: aprobadas, 
      icono: <Check size={20} /> 
    },
    { 
      titulo: 'Rechazadas', 
      descripcion: 'No seleccionadas', 
      cantidad: rechazadas, 
      icono: <X size={20} /> 
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {data.map((item, index) => (
        <CardResumen
          key={index}
          titulo={item.titulo}
          descripcion={item.descripcion}
          cantidad={item.cantidad}
          icono={item.icono}
        />
      ))}
    </div>
  );
}
