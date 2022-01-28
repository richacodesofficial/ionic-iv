import React from 'react';
import {
    isPlatform,
    IonContent,
    IonHeader,
    IonPage,
    IonToolbar,
    IonLabel,
} from '@ionic/react';
import './Home.css';

const Home: React.FC = () => {

    return (
        <IonContent>
            <IonLabel>
                Welcome User!!
            </IonLabel>
        </IonContent>
    );
};

export default Home;
