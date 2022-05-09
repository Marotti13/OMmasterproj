import {db} from '../firebaseConfig';
import firebase from 'firebase';
import React, { useEffect, useState } from 'react';
import { IonButton, IonContent, IonItem, IonLabel, IonList, IonListHeader, IonPage, useIonAlert } from '@ionic/react';


const TwitterAdmin: React.FC<{
  team:string; 
}> = props => {


  const [ feeds, setFeeds ] = useState<any>([]);
  const [present] = useIonAlert();

  const fetchDocs=async()=>{
    //db.collection("feeds") --------this is a chnage have not tested
    db.collection("teams").doc(props.team).collection('feeds')
        .onSnapshot((e) => {

          let tempArrray: firebase.firestore.DocumentData[] = [];

          e.docs.map(doc => {
            console.log(doc);
            //do something on first iteration, check to make sure if its populated
            tempArrray.push(doc);
          });
          setFeeds(tempArrray);
          });
        
  }

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
    user = user.toLowerCase();
    return user;
  }

  const handleSlug = (slug: string) => {

    /**
     * remove symbols from name aka # from NFLRebels
     * all to lowercase 
     * transform string to replace spaces with dashes
     * 
     * 
     */
    slug = slug.trim()

    console.log("before: " + slug);
    slug = slug.replace(/[^\w\s]/gi, ''); //symbols present will mess up the current method. will handle this in future. cant use twitter api in client side bc its per device
    console.log("after: " + slug);

    slug = slug.toLowerCase();

    slug = slug.replace(/ /g, "-");
    console.log("final: " + slug);

    return slug;
  }

  const submitFeed = (object: any) => {
    db.collection("teams").doc(props.team).collection('feeds').doc().set(object).then(() => {
      console.log("Document successfully written!");
    });
    //do something if error 
  }

  const checkExists = async (object:any) => {
    //check name has bee used and same list/profile has been used
    /**
     * want this to check firebase for if combination has been used 
     * 
     * also would be nice to see if the profile/list combination works - no simple way found yet without doing some get/post request trickery that im too lazy to do
     * 
     * using map pull all documetns in database 
     *  LIST ROUTE 
     *  for every object check if slug exists 
     *    if it does check to see if it matches one being added 
     *    if yes then check if profile namesa re the same 
     *    if yes then error it already exists 
     * 
     *  Profile Route 
     *  for ever object check for screenName exists - might have to check for type 
     *    if profile see if screen name matches 
     *    if yes then it already exists
     */

    let exists = false; //HAS TO ITERATE THROUGH EVERY INSTANCE SO NOT OPTIMAL - WORST AND BEST CASE RUNTIME ARE THE SAME NEED TO FIX

    await db.collection("teams").doc(props.team).collection('feeds').get().then(snapshot => {
      snapshot.forEach(doc => {
          if(object.type === 'list'){
            if(object.slug === doc.data().slug && object.ownerScreenName === doc.data().ownerScreenName){
              //make error!
              exists = true; 
            }
          }
          else if(object.type === 'profile'){
            if(object.screenName === doc.data().screenName){
              //make error!
              exists = true; 
              console.log(object.screenName);
            }
          }
          else{
            //need to throw some sort of error 
            exists = true; 
          } 
      });
    })
    .catch((err: any) => {
        console.log('Error getting documents', err);
    });
    return exists; //does not already exist and can add new instance
  }

  const handleOK = async (inputs: any) => {
    
    if(inputs.username === "" || inputs.type === "" || inputs.name === ""){
      console.log("contains null value");
      //fails generate message nned to tell users to try again 
      return;
    }

    let type =  handleType(inputs.type);
    let username =  handleUsername(inputs.username);

    //check to see if exists probably before each submit feed call
  
   let object ={};

    if(type === 'list'){
      object = {
        name: inputs.name,
        type: 'list',
        ownerScreenName: username,
        slug:  handleSlug(inputs.slug)
      }
      let exists = await checkExists(object);

      if(!exists){
        submitFeed(object);
      }
      

    }
    
    else if(type === 'profile'){
      object = {
        name: inputs.name,
        type: 'profile',
        screenName: username
      }

      let exists = await checkExists(object);

      if(!exists){
        submitFeed(object);
      }
    }

    else{
      console.log('No valid type given')
    }
    
  }

  const deleteFeed = (docID: any) => {
    // db.collection("cities").doc("DC").delete().then(() => {
    //   console.log("Document successfully deleted!");
    //   }).catch((error) => {
    //       console.error("Error removing document: ", error);
    //   });
    present({
      cssClass: 'my-css',
      header: 'Are Your Sure?',
      message: 'Deleting a feed is a permanent action.',
      buttons: [
        'Cancel',
        { text: 'Delete', handler: (d) => {
           db.collection("teams").doc(props.team).collection('feeds').doc(docID).delete().then(() => {
              console.log("Document successfully deleted!");
              }).catch((error) => {
                  console.error("Error removing document: ", error);
            });
        }},
      ],
      //onDidDismiss: (e) => checkExists(d),
    })
    console.log(docID);
  }

  useEffect(() => {
    fetchDocs();
  }, [])
  

  return(
        <React.Fragment>
           {/* TO DO: LIST OF FEEDS HERE-> ABLE TO DELETE THEM WITH BUTTON */}
           <IonList>
             <IonListHeader>Current Feeds</IonListHeader>
              {feeds.map((element: any) => {
                return (
                  <IonItem key={element.data().name}>
                    <IonLabel>{element.data().name}</IonLabel>
                    <IonButton onClick={e =>deleteFeed(element.id)} color='danger'>X</IonButton>
                  </IonItem>
                );
              })}

            </IonList>
          <IonButton size='small' shape="round"
            expand="block"
            onClick={() =>
              present({
                cssClass: 'my-css',
                header: 'Add Feed',
                message: 'Enter the information of the feed you wish to add. Be careful to use proper spelling',
                inputs: [
                  {type:'textarea',placeholder: "Display Name of Feed", name:'name'}, //might remove this in favor of using slug/profile instead.
                  {type:'textarea',placeholder: "Username", name:"username"},
                  {type:'textarea',placeholder: "List or Profile", name:"type"},
                  {type:'textarea',placeholder: "Name of List (If Applicable)", name:'slug'}
                ],
                buttons: [
                  'Cancel',
                  { text: 'Ok', handler: (d) => handleOK(d)},
                ],
                //onDidDismiss: (e) => checkExists(d),
              })
            }
          >
            Add Feed
          </IonButton>
        </React.Fragment>
  );

};
  
export default TwitterAdmin;

