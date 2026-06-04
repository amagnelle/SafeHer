import * as Location from 'expo-location';

import { addDoc, collection } from "firebase/firestore";

import { db } from "../src/models/firebaseConfig";

class SOSservice {

    async enviarSOS (): Promise<void> {

        const { status } =
          await Location.requestForegroundPermissionsAsync();

        if(status !== 'granted'){

            throw new Error('Permissão negada')
        }

        const location =
            await Location.getCurrentPositionAsync({});

        const latitude = location.coords.latitude;

        const longitude = location.coords.longitude;

        await addDoc(

            collection(db, 'sos_alerts'), 
            
            {
             
                latitude,
                
                longitude,

                status: 'ativo',

                createAt: new Date()

            }
        );
    }
}

export default new SOSservice();