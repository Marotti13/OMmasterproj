import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { ellipse, home, logoTwitter, map, people, pulse, square, triangle } from 'ionicons/icons';
import Tab1 from './pages/Tab1';
import Tab2 from './pages/Tab2';
import Tab3 from './pages/Tab3';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

const App: React.FC<{
  team:string; //this is a prop it gets from the wrapper when a team is selcted
  //should i pass event as well?? i think this is passing team doc id
  event:string; 
}> = props => {
  
  const handleTabWillChange = (e: { detail: { tab: string; }; }) => {
    if (e.detail.tab === 'home') {
      window.location.reload();
    }
};
  return (
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/tab1">
            <Tab1 team={props.team} />
          </Route>
          <Route exact path="/tab2">
            <Tab2 team={props.team}/>
          </Route>
          <Route exact path="/tab3">
            <Tab3 team={props.team}/>
          </Route>
          <Route exact path="/">
            <Redirect to="/tab1" />
          </Route>
        </IonRouterOutlet>
        <IonTabBar slot="bottom" onIonTabsWillChange={handleTabWillChange}>
          <IonTabButton tab="tab1" href="/tab1">
            <IonIcon icon={logoTwitter} />
            <IonLabel>Twitter</IonLabel>
          </IonTabButton>
          <IonTabButton tab="tab2" href="/tab2">
            <IonIcon icon={people} />
            <IonLabel>Interactive</IonLabel>
          </IonTabButton>
          <IonTabButton tab="tab3" href="/tab3">
            <IonIcon icon={map} />
            <IonLabel>Map</IonLabel>
          </IonTabButton>
          <IonTabButton tab="home">
            <IonIcon icon={home} />
            <IonLabel>Home</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
  )};

export default App;
