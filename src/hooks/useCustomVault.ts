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
    key: 'io.ionic.getstartedivreact',
    type: VaultType.CustomPasscode,
    lockAfterBackgrounded: 2000,
    shouldClearVaultAfterTooManyFailedAttempts: true,
    customPasscodeInvalidUnlockAttempts: 30,
    unlockVaultOnLoad: false,
};

const key = 'sessionData';

/** Set a custom type to handle data coming back from the dismiss method */
type CustomPasscodeCallback = (callback?: () => void) => void;

/** We need to create a callback that gets invoked within the onPasscodeRequested event */
let passcodeRequestCallback: CustomPasscodeCallback = () => { };

const useCustomVault = () => {
    const [session, setSession] = useState<string | undefined>(undefined);
    const [customVaultIsLocked, setCustomVaultIsLocked] = useState<boolean>(false);
    const [vaultExists, setVaultExists] = useState<boolean>(false);
    const [customVaultError, setCustomVaultError] = useState<VaultError>();

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

        vault.onPasscodeRequested(async (isPasscodeSetRequest) => {

            return new Promise(resolve => {
                /** Define our passcode request callback functionality. */

                passcodeRequestCallback = async (callback?: () => void) => {
                    const message = isPasscodeSetRequest
                        ? 'Setup Passcode' // passcode is being set for first time
                        : 'Enter passcode'; // passcode is being asked for unlock
                    // async yourGetPasscodeFromUser() returns a string of the users entry or null if canceled.
                    const passcode = window.prompt(message) || '';
                    /** If the user cancelled the prompt we will pass in an empty string */
                    /** Otherwise, send over the passcode provided by the user */
                    if (passcode) {
                        await vault.setCustomPasscode(passcode);
                        // if (callback) callback();
                    }
                    resolve();
                };

            });
        });

        vault.onError((customVaultError) => {
            setCustomVaultError(customVaultError);
        });

        return vault;
    }, []);

    const storeSession = async (value: string): Promise<void> => {
        setSession(value);
        await vault.setValue(key, value);
        const exists = await vault.doesVaultExist();
        setVaultExists(exists);
    };

    const restoreCustomVaultSession = async (): Promise<void> => {
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
        const exists = await vault.doesVaultExist();
        setVaultExists(exists);
    };

    const setCustomPasscode = (callback?: () => void) => {
        passcodeRequestCallback(callback);
    }

    return {
        session,
        customVaultIsLocked,

        lockCustomVault,
        unlockCustomVault,

        storeSession,
        restoreCustomVaultSession,

        vaultExists,
        clearCustomVault,
        customVaultError,
        setCustomPasscode,
    };
};

export default useCustomVault;
