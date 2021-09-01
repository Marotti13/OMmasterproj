import { IonContent, IonItem, IonLabel, IonSelect, IonSelectOption } from '@ionic/react';
import { Timeline } from 'react-twitter-widgets'
import db from '../firebaseConfig';
import { useEffect, useState } from 'react';
import firebase from 'firebase';

const TwitterAdmin: React.FC = () => {

    
  //scroll to top of page when using tab button (like twitter) for all tabs
  /*
  error will do nothing 
  error could be it doesnt exist 
  already is in database
  */

  
  
  return(
    /*
      alert like box that pops out
        type selector - profile or list 
        name of list and/or  name of profile
        submit button 
      
      


    */
    <IonContent>
      
    </IonContent>
  );

};
  
export default TwitterAdmin;

