import { IonAvatar, IonCard, IonCol, IonContent, IonGrid, IonHeader, IonImg, IonItem, IonItemDivider, IonPage, IonRow, IonText, IonTitle, IonToolbar } from "@ionic/react";
import { useEffect, useState } from "react";
import './ScoreAndTicker.css';
import db from '../firebaseConfig';


const ScoreAndTicker: React.FC= () => {

  const [ game, setGame ] = useState<string>("16q3qZGMrLLtVK3Wj1Ui");  //hardcoded which event to subscribe to,EVENTUALY this will be a varibale passed to the componenet as a prop
  const [ event, setEvent ] = useState<any>({   //the event details that are set from an api once a specific game has been selected
    homeTeam:'',
    visitorTeam:'',
    homeTeamPicture:'',
    visitorTeamPicture:'',
    homeTeamScore:'',
    visitorTeamScore:'',
    quarter:"", //what qtr it is 
    timeLeft:"", //time left in qtr
    homeTeamRecord:'',
    visitorTeamRecord:'',
    homeTeamQBName:'',
    visitorTeamQBName:'',
    homeTeamQBPicture:'',
    visitorTeamQBPicture:'',
    homeTeamQBPassing:'',
    visitorTeamQBPassing:''

    //need to figure out time stuff
    //stats for each team's QB
    //passing yards, completions, interceptions

  });


  /**
   * want to display score for game 
   *  will most likely use espn api
   *  will need a way for an admin to set he feed 
   * 
   * need a drop down at the top to switch to a stock market ticker 
   *  look for api 
   *  want this to be realtime 
   * 
   * 
   * possibly need a button that turn on the api calls as it has limited use per day 
   * 
   * 
   * soluton?
   *  has game started?
   *    if yes 
   *      game is about 3 hours - 4 max. so 240 min - can update scores every minute for a game 
   * 
   * might need to create a server like application that polls an api and sends it to firebase which in turn sends it to users 
   */
   

   const selectGame = () => {
    /**
     * once game has been slected this method will populate page with score information ---- might need another method
     * 
     *  willl be able to switch games with a dropdown???
     * 
     * after this fetch score is looped with a snpashot that keeps things updated 
     * 
     *  *********this might be done upon entire app startup so the entire expereince is tailored to a specific team******
     * 
     */
   }

   

   

  

   const fetchEventDetails = async() =>{
    /**
     * subscribe to snapshot (this wil be done through prop eventually)
     * 
     * change state upon anyhting changing 
     * 
     * thats really it honestly just read - no writing or updating
     */
    

     db.collection("games").doc(game)//will use prop later but hardcoded for now in state var
     .onSnapshot((doc) => {

      if(!doc.exists){ //prevents an error if survey gets deleted - snapshot doesnt exist but still triggers fetch
        return
    }
       console.log(doc.data()!.homeTeam);
       setEvent(doc.data()); //this could not work but we will see and its prob not secure

         
         

     });

   }

   useEffect(() => {
    fetchEventDetails(); //the snapshot subscribing to the game 
  }, [])


    return (
      
      /**
       * drop down nav bar thing
       *  options: ticker, score  -will set score for every app the same for now but users will have options later 
       * have another componenet that acts as a wrapper for the ticker and the score card and will toggle display for both
       * 
       * 
       * 
       * countdown until event??
       * 
       * 
       */
      <IonPage>
        <IonHeader>
        <IonToolbar>
          <IonTitle>Realtime Gamecast</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        
          <IonCard>
            <IonRow class="ion-align-items-center">
              <IonCol>
                <IonCol>
                  <IonRow>
                  <IonHeader class="ion-text-center">{event.visitorTeam}</IonHeader>
                  </IonRow>
                  <IonRow>
                    <IonHeader class="ion-text-center">{event.visitorTeamRecord}</IonHeader>
                  </IonRow>
                </IonCol>
              </IonCol>

              <IonCol>
                <IonImg src={event.visitorTeamPicture}></IonImg> {/* need a place holder image either through css or ngIF image is null */}
              </IonCol>

              {event.quarter != '' && ( //if the game has started show something else instead 
                <p>GAME HAS STARTED</p>
              )}

              {event.quarter == '' && ( //if the game has started show something else instead 
                <IonCol  class="ion-text-center"> {/* ngIF for if game has started to change html */}
                  <IonText >10/20</IonText><br></br>
                  <IonText>TBA</IonText>
                </IonCol>
              )}

              

              <IonCol>
              <IonImg src={event.homeTeamPicture}></IonImg>


              </IonCol>

              <IonCol>
              <IonCol>
                  <IonRow>
                    <IonHeader class="ion-text-center">{event.homeTeam}</IonHeader>
                  </IonRow>
                  <IonRow>
                    <IonHeader class="ion-text-center">{event.homeTeamRecord}</IonHeader>
                  </IonRow>
                </IonCol>
              </IonCol>
            </IonRow>
          </IonCard>

          
          
            <IonRow> 
              <IonCol>
                <IonImg class='qb' src="https://cdn2.iconfinder.com/data/icons/rcons-user/32/male-shadow-fill-circle-512.png"></IonImg> {/* might save picture on app client to be used as a placeholder */}
              </IonCol>

              <IonCol class='ion-text-center'>
                <p>Passing Yards</p>
                <p>{event.homeTeamQBPassing}</p>
              </IonCol>
              <IonCol class="ion-text-center">
                <p>Passing Yards</p>
                <p>{event.visitorTeamQBPassing}</p>
              </IonCol>

              <IonCol >
                <IonImg class='qb1' src="https://cdn2.iconfinder.com/data/icons/rcons-user/32/male-shadow-fill-circle-512.png"></IonImg>
              </IonCol>
            </IonRow>
            
          
        </IonContent>
      </IonPage>


    );
  
  };
  
  export default ScoreAndTicker;