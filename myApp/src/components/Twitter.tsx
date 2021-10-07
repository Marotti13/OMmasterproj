import { IonContent, IonHeader, IonItem, IonLabel, IonPage, IonSelect, IonSelectOption, IonTitle, IonToolbar } from '@ionic/react';
import { Timeline } from 'react-twitter-widgets'
import db from '../firebaseConfig';
import React, { useEffect, useState } from 'react';
import firebase from 'firebase';

const Twitter: React.FC<{
    team:string; 
  }> = props => {

  //get team doc id from prop. then subscribe to feeds from that doc id -> fetchDocs method 
  //try for changing feed and if doesnt work reset to default and then throw alert error?

  const [ feeds, setFeeds ] = useState<any>([]);
  const [ stateDataSouce, setStateDataSource ] = useState<any>({
    sourceType: 'profile',
    screenName: 'CNNPolitics'
  });


  const fetchDocs=async()=>{
    //db.collection("feeds") --------this is a chnage have not tested
    db.collection("teams").doc(props.team).collection('feeds')
        .onSnapshot((e) => {

          let tempArrray: firebase.firestore.DocumentData[] = [];

          e.docs.map(doc => {
            console.log(doc.data());
            //do something on first iteration, check to make sure if its populated
            tempArrray.push(doc.data());
          });
          setFeeds(tempArrray);
          });
        
  }
  const handleDefaultDataSource = (e: any) => { //chnage to set default vaule $$$$$$$$$$$$$$$$$$$$$$$$$
    let feedSelection = e;
    console.log(feedSelection);

    if(feedSelection.type === 'list') {
      let dataSource ={
        sourceType: 'list',
        ownerScreenName: feedSelection.ownerScreenName,
        slug: feedSelection.slug
      };
      setStateDataSource(dataSource);

    }
    else if(feedSelection.type === 'profile'){
      let dataSource ={
        sourceType: 'profile',
        screenName: feedSelection.screenName
      };
      setStateDataSource(dataSource);

    }
    else{
      console.log("error");
      return;
    }
   

}

  const handleSelection = (e: any) => {
    let value = e.detail.value;
    let feedSelection = feeds.find((x: { name: string; }) => x.name === value); //searches feeds for matching name and gets data 
    console.log(feedSelection);

    if(feedSelection.type === 'list') {
      let dataSource ={
        sourceType: 'list',
        ownerScreenName: feedSelection.ownerScreenName,
        slug: feedSelection.slug
      };
      setStateDataSource(dataSource);

    }
    else if(feedSelection.type === 'profile'){
      let dataSource ={
        sourceType: 'profile',
        screenName: feedSelection.screenName
      };
      setStateDataSource(dataSource);

    }
    else{
      console.log("error");
      return;
    }
   

  } 
  
  useEffect(() => {
    fetchDocs();
    console.log(props.team); //testing--------------
  }, [])
  
  
  return( 
    <IonPage>
      <IonHeader>
        {/* <IonToolbar> */}
          <IonItem>
            <IonLabel>Twitter Feed</IonLabel>
            <IonSelect placeholder={stateDataSouce.screenName} onIonChange={e => handleSelection(e)}>
              {feeds.map((element: any) => {
                return (<IonSelectOption key={element.name}>{element.name}</IonSelectOption>);
              })}
            </IonSelect>
          </IonItem>
        {/* </IonToolbar> */}
      </IonHeader>
      <IonContent>
        
        <Timeline
          dataSource={stateDataSouce}
          options={{
            //theme: "light",
            chrome: "noheader, transparent",
            conversation: "all"
          }} />
      </IonContent>
    </IonPage>
      


  );

};
  
export default Twitter;

