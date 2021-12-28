import db from "../firebaseConfig";
import { useEffect, useState } from "react";
import { IonButton, useIonAlert } from "@ionic/react";
import { error } from "console";
import { warning } from "ionicons/icons";

const PublishEvent: React.FC<{
  state: "unpublished" | 'published';
  id: string;
}> = props => {

  const [ state, toggleState ] = useState<"unpublished" | 'published'>(props.state); //published vs unpublished


  const toggle = () => {
    console.log(props.id);

    let fromColl: string, toColl: string;
    if(state == 'published'){
      fromColl = 'events';
      toColl = 'temp';
    }else{
      fromColl = 'temp';
      toColl = 'events';
    }

    //get doc from its current location
    let dataObject;
    db.collection(fromColl).doc(props.id).get().then(doc =>{ 

      // //load it into an object
      dataObject = doc.data();
      console.log(dataObject);

      //pubish it to new location
      db.collection(toColl).add(dataObject!)
      .then(onfulfilled=>{

        //if successsful delete doc form old location
        db.collection(fromColl).doc(props.id).delete();


      })
      .catch(
        err=>console.log(err)
      );


    });


  }

  
  return(
    <IonButton color='warning' onClick={e=>toggle()}>{state == 'published'? 'X' : 'O'}</IonButton>
  );
    
         

};
  
export default PublishEvent;

/**
 * need to be able to see all published and unpublished events on main screen / show if some have a show date 
 * 
 * when selecting an event to view you can toggle if its viewable or not -> might need to do error checking on client side whne doc suddenly does not exist
 * 
 * work on error checking for wrapper -> so no dumb stuff gets submitted
 * 
 * be able to chnage event map/infographic
 * 
 * be able to create survey/trivia/other and be able to change what is being displayed on client side
 * 
 * needa  eturn to home button for admin app!
 * 
 */