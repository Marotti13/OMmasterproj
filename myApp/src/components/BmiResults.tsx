import { IonRow, IonCol, IonCard, IonCardContent } from "@ionic/react";
import { attachProps } from "@ionic/react/dist/types/components/utils";

const BmiResults: React.FC<{result: number}> = props => {
    return (
        <IonRow>
            <IonCol>
                <IonCard>
                    <IonCardContent className='ion-text-center'>
                        <h2>Your Body-Mass-Index</h2>
                        <h2>{props.result.toFixed(2)}</h2>
                    </IonCardContent>
                </IonCard>
            </IonCol>
        </IonRow>
    );
  
  };
  
  export default BmiResults;