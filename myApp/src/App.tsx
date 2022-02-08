import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonBadge,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { triangle, flame, map, logoTwitter, people, pulse} from 'ionicons/icons';
import Tab1 from './pages/Tab1';
import Tab2 from './pages/Tab2';
import Tab3 from './pages/Tab3';
import ScoreAndTicker from './pages/ScoreAndTicker';
import Map from './components/Map'

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
import './theme/variablesState.css'
import Twitter from './components/Twitter';
import { type } from 'os';
import { useState } from 'react';


const App: React.FC<{
  team:string; //this is a prop it gets from the wrapper when a team is selcted
  //should i pass event as well?? i think this is passing team doc id
  event:string; 
}> = props => {

  const [ badge, setBadge ] = useState<boolean>(false);
  
  const handleType = (type:string) => { //sets the badge -> need to have survey page load first so snapshot starts
    console.log(type+' was loaded ');
    setBadge(true)
  }
  const clearBadge = (tab:string) => {
    if(badge && tab=='tab1'){
      console.log('badge cleared');
      setBadge(false);
    }
  }
  
  return(
  <IonApp>
    <IonReactRouter>
      <IonTabs onIonTabsDidChange={e=>clearBadge(e.detail.tab)}>
        <IonRouterOutlet>
          <Route exact path="/" >
            <Redirect to="/tab1"/>
          </Route>
          <Route exact path="/tab1" >
            <Tab1 team ={props.team} handleType={handleType}/>
          </Route>
          <Route exact path="/tab2"> 
            <ScoreAndTicker event={props.event}/>
          </Route>
          <Route exact path="/tab3">
            <Map team = {props.team}></Map>
          </Route>
          <Route exact path="/tab4">
            <Twitter team = {props.team} />
          </Route>
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="tab1" href="/tab1">
            <IonIcon icon={people} />
            <IonLabel>Interactive</IonLabel>
            {badge? <IonBadge class='badge'>1</IonBadge>:null}
          </IonTabButton>
          <IonTabButton tab="tab2" href="/tab2">
            <IonIcon icon={pulse} />
            <IonLabel>Live</IonLabel>
          </IonTabButton>
          <IonTabButton tab="tab3" href="/tab3">
            <IonIcon icon={map} />
            <IonLabel>Map</IonLabel>
          </IonTabButton>
          <IonTabButton tab="tab4" href="/tab4"> 
            <IonIcon icon={logoTwitter} />
            <IonLabel>Twitter</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
  );
};

export default App;
