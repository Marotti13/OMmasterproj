import { IonContent, IonItem, IonLabel, IonSelect, IonSelectOption } from '@ionic/react';
import { Timeline } from 'react-twitter-widgets'
import db from '../firebaseConfig';
import { useEffect, useState } from 'react';
import firebase from 'firebase';

const Twitter: React.FC = () => {


  //scroll to top of page when using tab button (like twitter) for all tabs

  const [ feeds, setFeeds ] = useState<any>([]);
  const [ stateDataSouce, setStateDataSource ] = useState<any>({
    sourceType: 'profile',
    screenName: 'CNNPolitics'
  });


  const fetchDocs=async()=>{
    db.collection("feeds")
        .onSnapshot((e) => {

          let tempArrray: firebase.firestore.DocumentData[] = [];

          e.docs.map(doc => {
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
  }, [])
  
  
  return( // ion slect needs work, doesnt work right 
      <IonContent>
        <IonItem>
          <IonLabel>Twitter Feed</IonLabel>
          <IonSelect placeholder={stateDataSouce.screenName} onIonChange={e => handleSelection(e)}> 
            {feeds.map((element: any) => { 
              return (<IonSelectOption key={element.name}>{element.name}</IonSelectOption>)
              })
            }
          </IonSelect>
        </IonItem>
          <Timeline 
            dataSource={stateDataSouce}
            options={{
                theme:"dark",
                chrome:"noheader, transparent",
                conversation:"all"
            }}
          />
      </IonContent>


  );

};
  
export default Twitter;

