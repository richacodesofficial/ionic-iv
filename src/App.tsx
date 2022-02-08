import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonHeader, IonPage, IonRouterOutlet, IonToolbar } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';
import Register from './pages/Register';
import './App.css';


const App: React.FC = () => {
    return (
        <IonApp className="app-container">
            <IonPage>
                <IonHeader>
                    <IonToolbar />
                </IonHeader>
                <IonReactRouter>
                    <IonRouterOutlet>
                        <Route exact path="/home" component={Home} />
                        <Route exact path="/register" component={Register} />
                        <Redirect exact from="/" to="/register" />
                    </IonRouterOutlet>
                </IonReactRouter>
            </IonPage>
        </IonApp>
    );
};

export default App;
