

import React, {Component} from 'react'
import {Map, InfoWindow, Marker, GoogleApiWrapper, mapEventHandler, markerEventHandler} from 'google-maps-react';
import './Map.css' //for popup text to be black looks liek this is gloabl for some reason lol
import db from '../firebaseConfig';
import { IonButton, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';


export class MapContainer extends Component<{google: any, team:string}>{

    state = {
        test:'',
        showingInfoWindow: false,
        activeMarker: {},
        selectedPlace: {
            name:''
        },
        markers:[],
        zoom:20,
        initialCenter:{
            lat:0,
            lng:0
        }
      };

   componentDidMount = ()=>{
       if(this.state.test == ''){    //makes it so this doesnt run more than once (only need one listener)
        db.collection('teams').doc(this.props.team).collection('maps').doc('control').onSnapshot(snapshot=>{
                let data = snapshot.data();
                if(data)
                this.setState({
                    test:'g',
                    markers:data.markers,
                    zoom:data.zoom,
                    initialCenter: data.initialCenter
                })
    
        })
      }
   }
    
      onMarkerClick = (props: any, marker: any, e: any) =>
        this.setState({
          test:this.state.test,
          selectedPlace: props,
          activeMarker: marker,
          showingInfoWindow: true,
          markers:this.state.markers
        });
    
      onMapClicked = (props: any) => {
        if (this.state.showingInfoWindow) {
          this.setState({
            test:this.state.test,
            showingInfoWindow: false,
            activeMarker: null,
            markers:this.state.markers,
          })
        }
        }
    render() {
        return (
        <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>Map</IonTitle>
                    </IonToolbar>
                </IonHeader>
                    <Map 
                        onClick={this.onMapClicked}
                        /** @ts-ignore */
                        zoom={this.state.zoom} 
                        google={this.props.google} 
                        center={this.state.initialCenter}
                    >
                        {this.state.markers.map((mark: any)=>{
                            return(
                                <Marker
                                    onClick={this.onMarkerClick}
                                    /**@ts-ignore */
                                    name={mark.name}
                                    position={mark.position}
                                    
                                ></Marker>
                            );
                        })}
                        
                        {/** @ts-ignore */}
                        <InfoWindow
                            marker={this.state.activeMarker}
                            visible={this.state.showingInfoWindow}>

                            <div>
                                <h1 id='infoWindow'>{this.state.selectedPlace.name}</h1>
                            </div>
                        </InfoWindow>
                        
                    
                    </Map>
        </IonPage>
        );
      }
}

const GoogleMap = GoogleApiWrapper({
    apiKey: 'AIzaSyC4Z5Qz97EWcoCczNn2IcYvaYG0L9pe6Rk'
})(MapContainer)


export default GoogleMap
