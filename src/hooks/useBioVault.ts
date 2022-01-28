import { Capacitor } from "@capacitor/core";
import { BrowserVault, DeviceSecurityType, IdentityVaultConfig, Vault, VaultError, VaultType } from "@ionic-enterprise/identity-vault";
import { useMemo, useState } from "react";

const config: IdentityVaultConfig = {
    key: 'io.ionic.biovault',
    type: VaultType.DeviceSecurity,
    deviceSecurityType: DeviceSecurityType.Both,
    lockAfterBackgrounded: 2000,
    unlockVaultOnLoad: false,
};

const useBioVault = () => {
    const [bioVaultIsLocked, setBioVaultIsLocked] = useState<boolean>(false);
    const [bioVaultError, setBioVaultError] = useState<VaultError>();

    const vault = useMemo(() => {
        const vault =
            Capacitor.getPlatform() === 'web'
                ? new BrowserVault(config)
                : new Vault(config);

        vault.onLock(() => {
            setBioVaultIsLocked(true);
        });

        vault.onUnlock(() => setBioVaultIsLocked(false));

        vault.isLocked().then(setBioVaultIsLocked);
        
        vault.onError((bioVaultError) => setBioVaultError(bioVaultError));

        return vault;
    }, []);

    const lockBioVault = async (): Promise<void> => {
        await vault.lock();
    };

    const unlockBioVault = async (): Promise<void> => {
        await vault.unlock();
    };

    const clearbioVault = async (): Promise<void> => {
        await vault.clear();
    };


    return {
        bioVaultIsLocked,
        bioVaultError,
        lockBioVault,
        unlockBioVault,
        clearbioVault,
    };
};

export default useBioVault;
