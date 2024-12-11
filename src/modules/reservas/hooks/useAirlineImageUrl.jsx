// hooks/useAirlineImageUrl.jsx
import { useMemo } from 'react';

export const useAirlineImageUrl = (carrierCode) => {
    if (!carrierCode) return ''; // Validación por si no se recibe el código
    return `https://pics.avs.io/60/60/${carrierCode}.png`;
};