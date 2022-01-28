import { Storage } from '@capacitor/storage';
import { useEffect, useState } from 'react';

const IS_REGISTERED = 'IS_REGISTERED';

const useLogin = (): any => {
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    (async () => {
      const { value } = await Storage.get({ key: IS_REGISTERED });
      setIsRegistered(value === 'true');
    })();
  }, []);

  const setRegistered = async ():Promise<void> => {
    await Storage.set({
      key: IS_REGISTERED,
      value: 'true',
    });
  };

  const resetRegistered = async () => {
    await Storage.remove({ key: IS_REGISTERED });
  };

  return [isRegistered, setRegistered, resetRegistered]
};

export default useLogin;
