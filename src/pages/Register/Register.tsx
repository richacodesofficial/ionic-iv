import React, { useEffect, useState } from 'react';
import { IonButton, IonCol, IonContent, IonInput, IonLabel, IonRow } from '@ionic/react';
import './Register.css';
import useBioVault from '../../hooks/useBioVault';
import useCustomVault from '../../hooks/useCustomVault';
import { useHistory } from 'react-router';
import useLogin from '../../hooks/useLogin';

const Register: React.FC = () => {
    const history = useHistory();
    const [, setRegistered] = useLogin();
    const [password, setPassword] = useState('');
    const { unlockBioVault, bioVaultIsLocked, bioVaultError } = useBioVault();
    const { unlockCustomVault, customVaultIsLocked, customVaultError, setCustomPasscode } = useCustomVault();

    const handlePasswordOnChange = (event: any) => {
        const { value } = event.currentTarget;
        setPassword(value);
    };

    const handlePassowrdSubmit = () => {
        setCustomPasscode({
            data: password, callback: async () => {
                await setRegistered();
                history.push('/home');
            }
        });
    };
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
                console.log('Custom Vault is locked Register.tsx --->');
                await unlockCustomVault();
            } else {
                // vault is unlocked
                console.log('Custom Vault is unlocked Register.tsx --->');
            }
        })();
    }, [customVaultIsLocked]);

    useEffect(() => {
        if (bioVaultError) {
            console.log('Biovault errror ----->', bioVaultError);
        }
    }, [bioVaultError]);

    useEffect(() => {
        if (customVaultError) {
            console.log('CustomVaultError errror ----->', customVaultError);
        }
    }, [customVaultError]);

    useEffect(() => {
        unlockBioVault();
    }, []);

    return (
        <IonContent>
            <div className="register-page-wrapper">
                <div className="register-page-card">
                    <IonRow>
                        <IonCol>
                            <IonLabel className="register-password-label">Set password</IonLabel>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol>
                            <IonInput
                                className="register-password-input"
                                type="password"
                                autofocus={true}
                                value={password}
                                onChange={handlePasswordOnChange}
                            />
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol>
                            {customVaultError || bioVaultError}
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol>
                            <IonButton onClick={handlePassowrdSubmit}>Submit</IonButton>
                        </IonCol>
                    </IonRow>
                </div>
            </div>
        </IonContent>
    );
};

export default Register;
