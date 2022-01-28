import React, { useState } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonHeader, IonPage, IonRouterOutlet, IonToolbar } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';

import useLogin from './hooks/useLogin';
import './App.css';
import Login from './pages/Login';
import Register from './pages/Register';


const App: React.FC = () => {
    const [isRegistered] = useLogin();
    const [isOnboarded, setInOnboarded] = useState(false);

    console.log(isRegistered, isOnboarded);

    return (
        <IonApp className="app-container">
            <IonPage>
                <IonHeader>
                    <IonToolbar />
                </IonHeader>
                <IonReactRouter>
                    <IonRouterOutlet>
                        <Route exact path="/home"
                            render={() => isRegistered && isOnboarded ?
                                (<Home />) : (<Redirect to="/" />)}
                        />
                        <Route exact path="/login" render={() => <Login handleOnLogin={setInOnboarded} />} />
                        <Route exact path="/register" render={() => isRegistered && !isOnboarded ? (
                            <Redirect to="/login" />
                        ) : (<Register />
                        )} />
                        <Redirect exact from="/" to="/register" />
                    </IonRouterOutlet>
                </IonReactRouter>
            </IonPage>
        </IonApp>
    );
};

export default App;
