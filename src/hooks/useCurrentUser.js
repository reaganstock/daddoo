import { useEffect } from 'react';
import useUserStore from '../store/userStore';

export const useCurrentUser = () => {
  const { currentUser, setCurrentUser } = useUserStore();

  useEffect(() => {
    // For testing, set a mock user
    if (!currentUser) {
      setCurrentUser({
        id: 'test-user',
        name: 'Test User'
      });
    }
  }, [currentUser, setCurrentUser]);

  return currentUser;
};