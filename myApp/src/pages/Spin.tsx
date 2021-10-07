import { IonContent, IonImg, IonPage, IonText } from "@ionic/react";
import { useState } from "react";


const Spin: React.FC= () => {

    const [temp, setTemp] = useState< 'go' | 'no' >('no'); 

    return (
      <IonPage>
            <IonContent class='ion-text-center'>
                <audio autoPlay onPlay={e=>setTemp('go')}>
                    <source src='https://firebasestorage.googleapis.com/v0/b/myapp-react-452d8.appspot.com/o/SpinTime.mp3?alt=media&token=efe5a00b-3c11-4b41-820e-cc265fd39d15'></source>
                </audio>
                {temp === 'go' ? <IonImg src='https://firebasestorage.googleapis.com/v0/b/myapp-react-452d8.appspot.com/o/b80qqczo4mxq.gif?alt=media&token=575c136b-0d59-428b-b6cc-6988e125a916'></IonImg>: <IonText class='ion-text-center'>Remember when the Internet was fun?</IonText> } 
          </IonContent>
      </IonPage>
    );
  
  };
  
  export default Spin;