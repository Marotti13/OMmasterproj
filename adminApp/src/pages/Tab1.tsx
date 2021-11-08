import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import TwitterAdmin from '../components/TwitterAdmin';
import './Tab1.css';

const Tab1: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        {/* in every header have a publish/unpublish toggle that migrates app as it stands between temp place and live place and updates event select */}
        <IonToolbar>
          <IonTitle>Tab 1</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 1</IonTitle>
          </IonToolbar>
        </IonHeader>
        <TwitterAdmin></TwitterAdmin>
        {/* button to toggle show view or not  */}
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
