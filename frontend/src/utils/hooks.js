// utils/hooks.js - Hook personalizado para manejar animaciones durante redimensionamiento
import { useEffect } from 'react';

export const useResizeAnimationStopper = () => {
  useEffect(() => {
    let resizeTimer;

    const handleResize = () => {
      // Agregar clase para detener animaciones
      document.body.classList.add('resize-animation-stopper');
      
      // Remover la clase después de que termine el redimensionamiento
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        document.body.classList.remove('resize-animation-stopper');
      }, 400);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, []);
};
