import { IonButton, IonCard, IonCol, IonGrid, IonHeader, IonInput, IonItem, IonLabel, IonRow, IonTitle } from "@ionic/react";
import { map } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import './MapAdmin.css'

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

    const handleSetIntialCenter = (input:any) =>{

        if(input && input != mapInfo.initialCenter.lat + ", " + mapInfo.initialCenter.lng){

            let cords = input.split(", ");

            let LAT = cords[0];
            let LNG = cords[1];

            setMapInfo({
                initialCenter:{
                    lat:LAT,
                    lng:LNG
                },
                markers:mapInfo.markers,
                zoom:mapInfo.zoom
            
            });

            
            console.log("initial center: LAT:" + LAT +" LNG:" + LNG);
        }
    }

    const handleSetZoom = (input:any) =>{
        if(input && parseInt(input) != mapInfo.zoom){
            let zoom = parseInt(input);
            setMapInfo({
                initialCenter:mapInfo.initialCenter,
                markers:mapInfo.markers,
                zoom:zoom
            });
            console.log('zoom set ' + zoom);
        }
        
    }

    const handleSetMarkerName =(input:any, index:number) =>{

        if(input && input != mapInfo.markers[index].name){

            let tempMarkers = mapInfo.markers;
            tempMarkers[index].name = input;

            setMapInfo({
                initialCenter:mapInfo.initialCenter,
                markers:tempMarkers,
                zoom:mapInfo.zoom
            });
            console.log("marker " + index + " " + input);
        }
    }

    const handleSetMarkerCords =(input:any, index:number) =>{

        if(input && input.includes(", ") &&input != mapInfo.markers[index].position.lat + ", " + mapInfo.markers[index].position.lng){

            let tempMarkers = mapInfo.markers;
            
            let cords = input.split(", ");

            let LAT = cords[0];
            let LNG = cords[1];

            tempMarkers[index].position.lat = LAT;
            tempMarkers[index].position.lng = LNG;

            setMapInfo({
                initialCenter:mapInfo.initialCenter,
                markers:tempMarkers,
                zoom:mapInfo.zoom
            });
            console.log("marker " + index + "  LAT:" + LAT +" LNG:" + LNG);
        }
    }

    const handleRemoveMarker = (index:number) =>{
        
        let tempMarkers = mapInfo.markers;
        tempMarkers.splice(index,1);

        setMapInfo({
            initialCenter:mapInfo.initialCenter,
            markers:tempMarkers,
            zoom:mapInfo.zoom
        });
    }

    const handleAddMarker = () => {

        let tempMarkers=mapInfo.markers;
        tempMarkers.push({
            name:"Enter Name",
            position:{
                lat:"LAT",
                lng:"LNG"
            }
        });
        setMapInfo({
            initialCenter:mapInfo.initialCenter,
            markers:tempMarkers,
            zoom:mapInfo.zoom
        });
        
    }

    const handleSubmit =()=>{

        let updatedMap={
            initialCenter:mapInfo.initialCenter,
            markers:mapInfo.markers,
            zoom:mapInfo.zoom
        };
        db.collection('teams').doc(props.team).collection('maps').doc('control').update(updatedMap).then(e=>{
            alert("Map Revision Successfull")
            console.log(JSON.stringify(updatedMap));
        }).catch(error=>{
            console.log(error);
        });
    }


    useEffect(() => {
        //grab control document from map collection and put it into state var
        db.collection('teams').doc(props.team).collection('maps').doc('control').onSnapshot(snap=>{
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
            <IonLabel>Map Details</IonLabel>
        </IonItem>
        <IonCard>
            <IonItem>
                <IonLabel>Map Center</IonLabel>
                <IonInput value={mapInfo.initialCenter.lat + ", "+mapInfo.initialCenter.lng} onIonChange={e=>handleSetIntialCenter(e.detail.value)}></IonInput>
            </IonItem>
        </IonCard>
        <IonCard>
            <IonItem>
                <IonLabel>Initial Zoom</IonLabel>
                <IonInput type='number' onIonChange={e=>handleSetZoom(e.detail.value)} value={mapInfo.zoom}></IonInput>
            </IonItem>
        </IonCard>
        <IonItem>
            <IonLabel>Map Markers</IonLabel>
        </IonItem>
        {mapInfo.markers.map((marker:any,index:number)=>{
            return(
                <IonCard>
                <IonItem>
                    <IonInput onIonChange={e=>handleSetMarkerName(e.detail.value,index)} value={marker.name}></IonInput>
                    <IonInput onIonChange={e=>handleSetMarkerCords(e.detail.value,index)} value={mapInfo.markers[index].position.lat + ", " + mapInfo.markers[index].position.lng}></IonInput>
                    <IonButton color="secondary" onClick={e=>handleRemoveMarker(index)} slot="end">Remove</IonButton>
                </IonItem>
                </IonCard>
            )
        })}
            <IonButton expand="block" color="secondary" onClick={e=>handleAddMarker()}>Add</IonButton>
            <IonButton class='button1' expand="block" onClick={e=>handleSubmit()}>Submit Changes</IonButton>
        
    </React.Fragment>
  );
};

export default MapAdmin;
