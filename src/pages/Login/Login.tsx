import React, { useEffect, useState } from 'react';
import { IonButton, IonCol, IonContent, IonInput, IonLabel, IonRow } from '@ionic/react';
import './Login.css';
import { useHistory } from 'react-router';
import useBioVault from '../../hooks/useBioVault';
import useCustomVault from '../../hooks/useCustomVault';

interface LoginInterface {
    handleOnLogin: (loggedIn: boolean) => void;
};

const Login = (props: LoginInterface): JSX.Element => {
    const history = useHistory();
    const [password, setPassword] = useState('');
    const { unlockBioVault, bioVaultIsLocked, bioVaultError } = useBioVault();
    const { unlockCustomVault, customVaultIsLocked, customVaultError, setCustomPasscode } = useCustomVault();

    const handlePasswordOnChange = (event: any) => {
        const { value } = event.currentTarget;
        setPassword(value);
    };

    const handlePassowrdSubmit = () => {
        setCustomPasscode({
            data: password, callback: () => {
                props.handleOnLogin(true);
                history.push('/home');
            }
        });
    };

    useEffect(() => {
        (async () => {
            if (bioVaultIsLocked) {
                // vault is locked
                console.log('Bio Vault is locked Login.tsx --->');
            } else {
                // vault is unlocked
                console.log('Bio Vault is unlocked Login.tsx --->');
                await unlockCustomVault();
            }
        })();
    }, [bioVaultIsLocked]);


    useEffect(() => {
        (async () => {
            if (customVaultIsLocked) {
                // vault is locked
                console.log('Custom Vault is locked Login.tsx --->');
                await unlockCustomVault();
            } else {
                // vault is unlocked
                console.log('Custom Vault is unlocked Login.tsx --->');
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
            <div className="login-page-wrapper">
                <div className="login-page-card">
                    <IonRow>
                        <IonCol>
                            <IonLabel className="login-password-label">Enter password</IonLabel>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol>
                            <IonInput
                                className="login-password-input"
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

export default Login;
