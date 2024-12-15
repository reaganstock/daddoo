import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export const useAnimation = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      mirror: false,
      disable: window.innerWidth < 768
    });

    return () => {
      AOS.refresh();
    };
  }, []);
};

export default useAnimation;