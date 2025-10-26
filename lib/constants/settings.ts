/**
 * Constantes para las opciones de configuración del usuario
 */

export const BODY_TYPES = [
  { value: 'ectomorfo', label: 'Ectomorfo (Delgado, dificulta ganar peso)' },
  { value: 'mesomorfo', label: 'Mesomorfo (Atlético, gana músculo fácilmente)' },
  { value: 'endomorfo', label: 'Endomorfo (Robusto, tiende a acumular grasa)' },
] as const;

export const ACTIVITY_LEVELS = [
  { value: 'sedentario', label: 'Sedentario (Poco o ningún ejercicio)' },
  { value: 'ligero', label: 'Ligero (Ejercicio 1-3 días/semana)' },
  { value: 'moderado', label: 'Moderado (Ejercicio 3-5 días/semana)' },
  { value: 'activo', label: 'Activo (Ejercicio 6-7 días/semana)' },
  { value: 'muy_activo', label: 'Muy Activo (Ejercicio intenso diario)' },
] as const;

export const DIET_TYPES = [
  { value: 'normal', label: 'Normal (Sin restricciones)' },
  { value: 'vegetariana', label: 'Vegetariana' },
  { value: 'vegana', label: 'Vegana' },
  { value: 'cetogenica', label: 'Cetogénica (Baja en carbohidratos)' },
  { value: 'paleo', label: 'Paleo' },
  { value: 'mediterranea', label: 'Mediterránea' },
  { value: 'alta_proteina', label: 'Alta en Proteínas' },
  { value: 'baja_grasa', label: 'Baja en Grasas' },
] as const;

export const MEAL_SCHEDULES = [
  { value: '3_comidas', label: '3 Comidas Principales' },
  { value: '5_comidas', label: '5 Comidas Pequeñas' },
  { value: 'ayuno_intermitente', label: 'Ayuno Intermitente (16/8)' },
  { value: 'flexible', label: 'Flexible (Según el día)' },
] as const;

export const COMMON_ALLERGIES = [
  'Lactosa',
  'Gluten',
  'Frutos Secos',
  'Mariscos',
  'Huevo',
  'Soja',
  'Pescado',
  'Cacahuetes',
];
