import { IonAlert, IonCol, IonContent, IonGrid, IonHeader, IonLabel, IonPage, IonRow, IonSegment, IonSegmentButton, IonTitle, IonToolbar } from "@ionic/react";
import { useEffect, useState } from "react";
import ScoreContainer from "../components/ScoreContainer";
import TickerContainer from "../components/TickerContainer";



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
      <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Score and Ticker</IonTitle>
          </IonToolbar>
        </IonHeader>
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