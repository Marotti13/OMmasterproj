import db from '../firebaseConfig';
import { useEffect, useState } from 'react';
import { IonButton, IonContent, IonPage, useIonAlert } from '@ionic/react';


const TwitterAdmin: React.FC = () => {

    
  //scroll to top of page when using tab button (like twitter) for all tabs
  /*
  error will do nothing 
  error could be it doesnt exist 
  already is in database
  */

  
  const [present] = useIonAlert();

  const handleType = (type: string) => {

    type = type.toLowerCase().trim().charAt(0);

      if(type === "l"){
        console.log("its a list");
        //make type list
        return 'list';

      }else if(type === "p"){
        console.log("its a profile");
        //make type profile
        return 'profile'

      }else{
        console.log("not a valid type");
      }
      return false;
  }

  const handleUsername = (user: string) => {
    user = user.trim()
    return user;
  }

  const handleSlug = (slug: string) => {
    //might need to do soem checking
    slug = slug.trim()
    return slug;
  }

  const submitFeed = (object: any) => {
    db.collection("feeds").doc().set(object).then(() => {
      console.log("Document successfully written!");
    });
    //do something if error 
  }

  const handleOK = (inputs: any) => {
    
    if(inputs.username === "" || inputs.type === "" || inputs.name === ""){
      console.log("contains null value");
      //fails generate message 
    }

    let type = handleType(inputs.type);
    let username = handleUsername(inputs.username);
  
   let object ={};
    if(type === 'list'){
      object = {
        name: inputs.name,
        type: 'list',
        ownerScreenName: username,
        slug: handleSlug(inputs.slug)
      }
      submitFeed(object);
    }else if(type === 'profile'){
      object = {
        name: inputs.name,
        type: 'profile',
        screenName: username
      }
      submitFeed(object);
    }else{
      console.log('No valid type given')
    }
    console.log(object);
    
  }
  

  return(
    
          <IonButton size='small' shape="round"
            expand="block"
            onClick={() =>
              present({
                cssClass: 'my-css',
                header: 'Alert',
                message: 'alert from hook',
                inputs: [
                  {type:'textarea',placeholder: "Display Name of Feed", name:'name'},
                  {type:'textarea',placeholder: "Username", name:"username"},
                  {type:'textarea',placeholder: "List or Profile", name:"type"},
                  {type:'textarea',placeholder: "slug (name of list)", name:'slug'}
                ],
                buttons: [
                  'Cancel',
                  { text: 'Ok', handler: (d) => handleOK(d)},
                ],
                //onDidDismiss: (e) => console.log("alert complete"),
              })
            }
          >
            Add Feed
          </IonButton>
  );

};
  
export default TwitterAdmin;

