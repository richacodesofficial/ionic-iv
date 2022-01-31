import { useEffect } from 'react';
import { IonButton, IonContent, IonItem, IonLabel } from '@ionic/react';
import './Register.css';
import useBioVault from '../../hooks/useBioVault';
import useCustomVault from '../../hooks/useCustomVault';
import { useHistory } from 'react-router';

const Register = (): JSX.Element => {
    const history = useHistory();
    const { unlockCustomVault, customVaultIsLocked, customVaultError, setCustomPasscode } = useCustomVault();
    const { unlockBioVault, bioVaultIsLocked, bioVaultError } = useBioVault();

    useEffect(() => {
        (async () => {
            if (bioVaultIsLocked) {
                // vault is locked
                console.log('Bio Vault is locked Register.tsx --->');
            } else {
                // vault is unlocked
                console.log('Bio Vault is unlocked Register.tsx --->');
                await unlockCustomVault();
            }
        })();
    }, [bioVaultIsLocked]);

    useEffect(() => {
        (async () => {
            if (customVaultIsLocked) {
                // vault is locked
                console.log('custom Vault is locked Register.tsx --->');
                await unlockCustomVault();
            } else {
                // vault is unlocked
                console.log('custom Vault is unlocked Register.tsx --->');
                // history.push('/home');
            }
        })();
    }, [customVaultIsLocked]);

    const handleUnlockCustomVault = async () => {
        setCustomPasscode(async () => {
            history.push('/home');
        });
    };

    useEffect(() => {
        if (customVaultError) {
            console.log('CustomVaultError errror ----->', customVaultError);
        }
    }, [customVaultError]);

    useEffect(() => {
        if (bioVaultError) {
            console.log('Biovault errror ----->', bioVaultError);
        }
    }, [bioVaultError]);


    useEffect(() => {
        unlockBioVault();
    }, []);

    return (
        <IonContent>
            <div className="register-page-wrapper">
                <div className="register-page-card">
                    <IonItem >
                        <IonButton onClick={handleUnlockCustomVault}>Unlock Vault</IonButton>
                    </IonItem>
                    <IonItem>
                        <IonLabel>Bio vault Error</IonLabel>
                        {JSON.stringify(bioVaultError)};
                    </IonItem>
                    <IonItem>
                        <IonLabel>Custom vault Error</IonLabel>
                        {JSON.stringify(customVaultError)};
                    </IonItem>
                </div>
            </div>
        </IonContent>
    );
};

export default Register;
