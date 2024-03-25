import { useState } from 'react';

import { Provider } from '@finni-health/models';

export interface UserApiHookReturnProps {
  data: {
    isLoadingUser: boolean;
    user: Provider | null;
  };
  action: {
    getUserInfo: () => Promise<void>;
  };
}

function useUserApi(): UserApiHookReturnProps {
  const [user, setUser] = useState<Provider | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState<boolean>(false);

  const getUserInfo = async () => {
    try {
      setIsLoadingUser(true);

      const res = await fetch('http://127.0.0.1:3000/api/me');
      const data = await res.json();

      if (res.ok) {
        setUser({
          providerId: data.providerId,
          firstName: data.firstName,
          lastName: data.lastName,
        });
      }

      setIsLoadingUser(false);
    } catch (err) {
      setIsLoadingUser(false);
      console.error('Something happened while fetching the user data...', err);
    }
  };

  return {
    data: {
      isLoadingUser,
      user,
    },
    action: {
      getUserInfo,
    },
  };
}

export default useUserApi;
