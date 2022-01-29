import { IonButton, IonInput, IonItem, IonLabel } from "@ionic/react";
import { map } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";

interface MapControl{
    initialCenter:{
        lat:string,
        lng:string
    },
    markers:any[],
    zoom:number

}

const MapAdmin: React.FC<{
  team:string; 
}> = props => {

    const [ mapInfo, setMapInfo ] = useState<MapControl>({
        initialCenter:{
            lat:"0",
            lng:"0"
        },
        markers:[],
        zoom:0
    
    });

    const handleSetIntialCenter = (lat: string, lng:string) =>{
        setMapInfo({
            initialCenter:{
                lat:lat,
                lng:lng
            },
            markers:mapInfo.markers,
            zoom:mapInfo.zoom
        
        });
    }

    const handleSetZoom = (zoom:number) =>{
        setMapInfo({
            initialCenter:mapInfo.initialCenter,
            markers:mapInfo.markers,
            zoom:zoom
        });
    }


    useEffect(() => {
        //grab control document from map collection and put it into state var
        db.collection('teams').doc(props.team).collection('maps').doc('lEfRsnwp5voZmCXfOAv7').onSnapshot(snap=>{
            let data = snap.data();
            if(data)
            setMapInfo({
                initialCenter:{
                    lat:data.initialCenter.lat,
                    lng:data.initialCenter.lng
                },
                markers:data.markers,
                zoom:data.zoom
            
            });
        })
    },[])

  return (
    <React.Fragment>
        <IonItem>
            <IonLabel>Map Center</IonLabel>
            <IonInput value={mapInfo.initialCenter.lat + ", "+mapInfo.initialCenter.lng}></IonInput>
        </IonItem>
        <IonItem>
            <IonLabel>Initial Zoom</IonLabel>
            <IonInput value={mapInfo.zoom}></IonInput>
        </IonItem>
        {mapInfo.markers.map((marker:any,index:number)=>{
            return(
                <IonItem>
                    <IonLabel>{marker.name}</IonLabel>
                    <IonButton slot="end">Remove</IonButton>
                </IonItem>
            )
        })}

        
    </React.Fragment>
  );
};

export default MapAdmin;
