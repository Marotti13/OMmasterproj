import { IonBadge, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Tab1.css';
import ViewSurvey from '../components/viewSurvey';
import {db} from '../firebaseConfig';
import React, { useEffect, useState } from 'react';
import SurveyContainer from '../components/SurveyContainer';
import TriviaContainer from '../components/TriviaContainer';


const ClientTab2: React.FC<{
    team:string;
    //handleType: (type:string) => void;  gggggggggggggggggg
  }> = props => {

    var firstload=true;

    const [ control, setControl ] = useState<any>({doc:'',type:''});
    //subscribe to control doc, if empty string show nothing container
    //if not empty(docid) ->snapshot the doc, check type of doc -> load appropriate container with prop of doc id
    /**
     * if control (docid) not empty 
     *  subscribe to doc ->
     *    grab type
     *     then load in appropraite params into var
     *      pass var as prop to appropriate container
     */
    
    //maybe a loaded prop to activate notif?
    const fetchControl=async()=>{
      db.collection("teams").doc(props.team).collection('interactive').doc('control')
          .onSnapshot((e) => {
            
            if(e.exists){
              try{
                let showID:string;
                if(showID = e.data()!.showID){
                    console.log('doc to display: ' + showID);
                    /**
                     * time to grab doc type 
                     */
                    db.collection("teams").doc(props.team).collection('interactive').doc(showID).get().then(ret =>{
                      let temp ={doc:showID,type:ret.data()!.type}
                      setControl(temp);
                      if(firstload){
                        firstload=false;
                      }else{
                        // props.handleType(temp.type); ggggggggggggggggggg
                      }
                      
                    }).catch(e=>{
                      console.log(e);
                      setControl({doc:'',type:''});
                    });
                    /**
                     * this is where we pass a prop so a notification badge pops up
                     */
                }
                else{
                  console.log('field missing or empty!');
                  setControl({doc:'',type:''});
                }
              }catch(e){
                console.log('error: ' + e);
              }
              
            }else{
              console.log('control doc does not exist')
            }
            });
      
    }


  

  
  /**
   * going to have page (this one) that depending on what admin command sends will display - survey, trivia, and someother thing
   * 
   * page will be blank unless admin pushes something 
   * 
   * when something new loads the notification appears 
   * 
   * FLOW
   * 
   * use effect -> snapshot following a document from firestore state thing -> if not exist throw splash screen and await new command
   *    how to do this  -> command doc -> doc that tells client what thing to follow -> follow chnages on command doc to display/hide content
   *    might want two snapshot so we can see module doc update with votes and other things 
   */


  useEffect(() => {
    fetchControl();
  }, [])
  return (
    <React.Fragment>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Interactive</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Interactive</IonTitle>
          </IonToolbar>
        </IonHeader> 
        {control.type == 'trivia' && (
          <TriviaContainer docID={control.doc} team={props.team}></TriviaContainer>
        )}
        {control.type == 'survey' && (
          <SurveyContainer docID={control.doc} team={props.team}></SurveyContainer>
        )}
      </IonContent>
    </React.Fragment>
  );
};

export default ClientTab2;
