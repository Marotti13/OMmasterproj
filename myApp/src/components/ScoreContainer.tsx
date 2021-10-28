import { IonAvatar, IonCard, IonCol, IonHeader, IonImg, IonRow, IonText, } from "@ionic/react";
import { useEffect, useState } from "react";
import './ScoreAndTicker.css';
import db from '../firebaseConfig';
import React from "react";

type Event ={
  date: Date,
  htPassingYards: string,
  htScore: string,
  vtPassingYards: string,
  vtScore: string,
  time:string,
  qtr:string,
  down:string,
  distance:string
  //other event stats related info
  /**
   * 
   * need to add score
   */
}

type Team = {
  QBPictre: string,
  logo: string,
  QBName: string,
  TeamName:string,
  record:string
}


const ScoreContainer: React.FC<{
  event:string;
  }> = props => {

  const [ home, setHome ] = useState<Team>();
  const [ visitor, setVisitor ] = useState<Team>();
  const [ event, setEvent ] = useState<Event>();


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
   * 
   * 
   * 
   * TODO:
   * make live timing and score interface - just front end 
   * qb pictures 
   * format time stuff 
   * score notification?
   */
  

   const fetchEventDetails = async() =>{
    /**
     * subscribe to snapshot (this wil be done through prop eventually)
     * 
     * change state upon anyhting changing 
     * 
     * thats really it honestly just read - no writing or updating
     */
    

     db.collection("events").doc(props.event)//will use prop later but hardcoded for now in state var
     .onSnapshot((doc) => {

      if(!doc.exists){ //prevents an error if survey gets deleted - snapshot doesnt exist but still triggers fetch
        console.log("does not exist");
        
      }else{

        doc.data()!.homeTeamRef.get().then((team:any) =>{ //do this in its own method so doesnt have toi be called every update!
          let homeTeam:Team ={
            QBPictre: team.data()!.qbPicture,
            logo: team.data()!.logo,
            QBName: team.data()!.qbName,
            TeamName: team.data()!.teamName,
            record: team.data()!.record
          }
          setHome(homeTeam);
         });


         doc.data()!.visitorTeamRef.get().then((team:any) =>{ //do this in its own method so doesnt have toi be called every update!
          let visitorTeam:Team ={
            QBPictre: team.data()!.qbPicture,
            logo: team.data()!.logo,
            QBName: team.data()!.qbName,
            TeamName: team.data()!.teamName,
            record: team.data()!.record
          }
          setVisitor(visitorTeam);
         });


        let event:Event = {
          date: doc.data()!.eventDate.toDate(),
          htPassingYards: doc.data()!.homeTeamPassingYards,
          htScore: doc.data()!.homeTeamScore,
          vtPassingYards: doc.data()!.visitorTeamPassingYards,
          vtScore: doc.data()!.visitorTeamScore,
          time: doc.data()!.time,
          qtr: doc.data()!.qtr,
          down: doc.data()!.down,
          distance: doc.data()!.distance
        }
        console.log(event);
        setEvent(event);


      }
       
         
         

     });
   }

   useEffect(() => {
     console.log("event "+props.event);
    fetchEventDetails(); //the snapshot subscribing to the game 
  }, [])


    return (
      
      <React.Fragment>
        
          <IonCard>
            <IonRow class="ion-align-items-center">
                <IonCol>
                  <IonRow class="nameRecord">
                    {visitor?.TeamName}
                  </IonRow>
                  <IonRow class="nameRecord">
                    {visitor?.record}
                  </IonRow>
              </IonCol>

              <IonCol>
                <IonImg src={visitor?.logo}></IonImg> {/* need a place holder image either through css or ngIF image is null */}
              </IonCol>

              

              {event?.qtr != "" && ( //IF QTR HAS STARTED THEN SHOW

                <><IonCol>
                    <IonRow class='score'>
                    <h2>{event?.vtScore}</h2>
                    </IonRow>
                  </IonCol>

                  <IonCol > {/* ngIF for if game has started to change html */}

                    <IonRow class="score">
                      9:34
                    </IonRow >
                    <IonRow class="score">
                      QTR 1
                    </IonRow>
                    <IonRow class="score">
                      4th 5
                    </IonRow>                    
                  </IonCol>

                <IonCol >
                  <IonRow class='score'>
                   <h2>{event?.htScore}</h2>
                 </IonRow>
                </IonCol>

                </>
              )}

              {event?.qtr == "" &&  ( //CHECK IF QTR EXISTS TO TELL IF GAME HAS STARTED 
                <IonCol> {/* ngIF for if game has started to change html */}
                  {/* {event?.date.toUTCString()} */}
                  <IonRow class="dateTime">
                    {event?.date.toLocaleDateString()}
                  </IonRow>
                  <IonRow class="dateTime">
                    {event?.date.getHours()+':'+event?.date.getMinutes()}
                  </IonRow>
                </IonCol>
              )}

              <IonCol>
                <IonImg src={home?.logo}></IonImg>
              </IonCol>

              <IonCol >
                  <IonRow class='nameRecord'>
                    {home?.TeamName}
                  </IonRow>
                  <IonRow class='nameRecord'>
                    {home?.record}
                  </IonRow>
                </IonCol>
            </IonRow>
          </IonCard>

          
          
            <IonRow> 
              <IonCol>
                <IonRow class='qb'>
                  <IonAvatar >
                    <IonImg src={visitor?.QBPictre}></IonImg> {/* might save picture on app client to be used as a placeholder */}
                  </IonAvatar>
                </IonRow>
                <IonRow class='qb'>
                  {visitor?.QBName}
                </IonRow>
              </IonCol>

              <IonCol class="ion-text-center">
                <h6>{event?.htPassingYards}</h6>
              </IonCol>
              <IonCol class="ion-text-center">
                <h6>Passing Yards</h6>
              </IonCol>
              <IonCol class="ion-text-center">
                <h6>{event?.vtPassingYards}</h6>
              </IonCol>

              <IonCol >
                <IonRow class='qb1'>
                  <IonAvatar >
                    <IonImg src={home?.QBPictre}></IonImg>
                  </IonAvatar>
                </IonRow>
                <IonRow class='qb1'>
                  {home?.QBName}
                </IonRow>
              </IonCol>
            </IonRow>
            
          </React.Fragment>


    );
  
  };
  
  export default ScoreContainer;