import { IonAlert, IonCol, IonContent, IonGrid, IonHeader, IonLabel, IonPage, IonRow, IonSegment, IonSegmentButton, IonTitle, IonToolbar } from "@ionic/react";
import { useEffect, useState } from "react";
import InputControls from "./InputControls";
import ScoreContainer from "./ScoreContainer";
import TickerContainer from "./TickerContainer";



const ScoreAndTicker: React.FC= () => {


  const [ select, setSelect ] = useState<string>('score');

  const inputChangeHandler = (event: CustomEvent) => {
    //props.onSelectedValue(event.detail.value);
    setSelect(event.detail.value);
    console.log(select);
}
  
  useEffect(() => {

  }, [])


    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Score and Ticker</IonTitle>
          </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonSegment value={select} onIonChange={inputChangeHandler}>
                <IonSegmentButton value='score'>
                  <IonLabel>Score</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value='ticker'>
                  <IonLabel>Ticker</IonLabel>
                </IonSegmentButton>
              </IonSegment>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              {select === 'ticker' ? <TickerContainer></TickerContainer> : <ScoreContainer></ScoreContainer>}
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
      </IonPage>

    );
  
  };
  
  export default ScoreAndTicker;