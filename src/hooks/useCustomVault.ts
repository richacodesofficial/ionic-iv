import { Capacitor } from '@capacitor/core';
import {
    BrowserVault,
    IdentityVaultConfig,
    Vault,
    VaultError,
    VaultType,
} from '@ionic-enterprise/identity-vault';
import { useMemo, useState } from 'react';

const config: IdentityVaultConfig = {
    key: 'io.ionic.customvault',
    type: VaultType.CustomPasscode,
    lockAfterBackgrounded: 2000,
    shouldClearVaultAfterTooManyFailedAttempts: true,
    customPasscodeInvalidUnlockAttempts: 30,
    unlockVaultOnLoad: false,
};
const key = 'sessionData';

/** Set a custom type to handle data coming back from the dismiss method */
type CustomPasscodeCallback = (opts: { data: any; role?: string, callback?: () => void }) => void;

/** We need to create a callback that gets invoked within the onPasscodeRequested event */
let passcodeRequestCallback: CustomPasscodeCallback = () => { };

const useCustomVault = () => {
    const [session, setSession] = useState<string | undefined>(undefined);
    const [customVaultIsLocked, setCustomVaultIsLocked] = useState<boolean>(false);
    const [customVaultExists, setCustomVaultExists] = useState<boolean>(false);
    const [customVaultError, setCustomVaultError] = useState<VaultError>();

    const [isSetPasscodeMode, setIsSetPasscodeMode] = useState<boolean>(false);


    const vault = useMemo(() => {
        const vault =
            Capacitor.getPlatform() === 'web'
                ? new BrowserVault(config)
                : new Vault(config);

        vault.onLock(() => {
            setCustomVaultIsLocked(true);
            setSession(undefined);
        });

        vault.onUnlock(() => setCustomVaultIsLocked(false));

        vault.isLocked().then(setCustomVaultIsLocked);
        vault.doesVaultExist().then(setCustomVaultExists);

        vault.onPasscodeRequested(async isSetPasscodeMode => {
            return new Promise(resolve => {
                /** Define our passcode request callback functionality. */

                passcodeRequestCallback = (opts: { data: any; role?: string, callback?: () => void }) => {
                    /** If the user cancelled the prompt we will pass in an empty string */
                    /** Otherwise, send over the passcode provided by the user */
                    if (opts.role === 'cancel') vault.setCustomPasscode('');
                    else vault.setCustomPasscode(opts.data);
                    setIsSetPasscodeMode(false);
                    if (opts?.callback) opts.callback();
                    resolve();
                };

                /** Update state variables so we can show the modal in it's correct mode */
                setIsSetPasscodeMode(isSetPasscodeMode);
            });
        });

        vault.onError((customVaultError) => setCustomVaultError(customVaultError));

        return vault;
    }, []);

    const storeSession = async (value: string): Promise<void> => {
        setSession(value);
        await vault.setValue(key, value);
        const exists = await vault.doesVaultExist();
        setCustomVaultExists(exists);
    };

    const restoreSession = async (): Promise<void> => {
        const value = await vault.getValue(key);
        setSession(value);
    };

    const lockCustomVault = async (): Promise<void> => {
        await vault.lock();
    };

    const unlockCustomVault = async (): Promise<void> => {
        await vault.unlock();
    };

    const clearCustomVault = async (): Promise<void> => {
        await vault.clear();
        setSession(undefined);
    };

    const setCustomPasscode = (opts: { data: any; role?: string, callback?: () => void }) => {
        passcodeRequestCallback(opts);
    }

    return {
        session,
        customVaultIsLocked,

        lockCustomVault,
        unlockCustomVault,

        storeSession,
        restoreSession,
        setCustomPasscode,
        customVaultExists,
        clearCustomVault,
        customVaultError,
        isSetPasscodeMode,
    };
};

export default useCustomVault;
