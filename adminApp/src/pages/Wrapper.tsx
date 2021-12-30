


//this is the wrapper for the app 

import { useEffect, useState } from 'react';

import React from 'react';
import App from '../App';
import { IonButton, IonIcon, IonInput, IonItem, IonLabel, IonSelect, IonSelectOption, useIonModal} from '@ionic/react';
import TeamSelector from '../components/TeamSelector';
import {db,store} from '../firebaseConfig';
import TwitterAdmin from '../components/TwitterAdmin';
import firebase from 'firebase';
import { dismiss } from '@ionic/core/dist/types/utils/overlays';
import { camera } from 'ionicons/icons';

const NewEvent: React.FC<{
  onDismiss: () => void;
  submit: (obj:any,date:Date) => void;
}> = ({ onDismiss, submit }) => {
  const [ partys, setPartys ] = useState<any[]>([]);
  const [ partyCount, setCount ] = useState<number>(0);
  const [ selected, setSelected ] = useState<any[]>([]);
  const [ date, setDate ] = useState<Date>(new Date());

  const updateArray = (e:any) =>{
    if(e.detail.value! > -1){
      setCount(parseInt(e.detail.value!));
      while(e.detail.value! > selected.length){
        selected.push(null);
      }
      while(e.detail.value! < selected.length){
        selected.pop();
      }
    }
  }
  const addParty = (i:number,d:any) =>{
    try{
      selected[i] = d.ref.path;
    }catch{}
  }

  useEffect(() => {
    /**runs get events and pulls all events that are available  */
    var tempArray: firebase.firestore.DocumentData[]=[];
    db.collection('teams').get().then(snapshot =>{
        snapshot.docs.map(doc => {
          let temp = doc;
          tempArray.push(temp);
        });
        setPartys((partys: any) => [...partys, ...tempArray]);        

    });
  },[])
  return(
  <div>
    <IonItem>
      <IonLabel>Event Date</IonLabel>
      <IonInput type="date" placeholder="Enter Date" ></IonInput>
    </IonItem>
    <IonItem>
      <IonLabel>Party Count</IonLabel>
      <IonInput type="number" value={partyCount} placeholder="Enter Number" onIonChange={e => updateArray(e) }></IonInput>
    </IonItem>

    {Array.from(Array(partyCount), (e, i) => {
    return (
      <IonItem >
      <IonLabel>Select Party {i+1}</IonLabel>
      <IonSelect value = {selected[i]} onIonChange={e =>{addParty(i,e.detail.value)}}>
        {partys.map(p=>{return(
          <IonSelectOption value={p}>{p.data().teamName}</IonSelectOption>)
        })}
      </IonSelect>
    </IonItem>)
  })}
  <IonButton expand="block" onClick={() => {submit(selected,date); onDismiss()}}>
      Submit
    </IonButton>
    <IonButton expand="block" onClick={() => onDismiss()}>
      Close
    </IonButton>
    
  </div>);
  
};

const NewParty: React.FC<{
  onDismiss: () => void;
}> = ({ onDismiss }) => {

  const [ partyName, setPartyName ] = useState<string>("");
  const [ logo, setLogo ] = useState<File>();
  const [ leaderName, setLeaderName ] = useState<string>("");
  const [ leaderPicture, setLeaderPicture ] = useState<File>();
  const [ record, setRecord ] = useState<string>("");


  const handleSetPartyName = (e:any) => {
    if(e){
      setPartyName(e);
    }
  }
  const handleSetLeaderName = (e:any) => {
    if(e){
      setLeaderName(e);
    }
  }
  const handleSetRecord = (e:any) => {
    if(e){
      setRecord(e);
    }
  }

  const openFileDialogLogo = () => { //runs the non ionic code 
    (document as any).getElementById("file-upload").click();
 };
 const openFileDialogLeader = () => { //runs the non ionic code 
  (document as any).getElementById("file-upload-1").click();
};

 const handleSetLogo = (_event: any) => {
   let f = _event.target.files![0];
   setLogo(f);
 }
 const handleSetLeader = (_event: any) => {
  let f = _event.target.files![0];
  setLeaderPicture(f);
}

const submitNewParty = () => {

  if(logo && leaderPicture && partyName!="" && leaderName!="" && record!=""){

    var logoRef = store.ref(Date.now().toString()+1+logo.name);
    var leaderRef = store.ref(Date.now().toString()+2+leaderPicture.name);

    let logoURL: string;
    let leaderURL: string;

    logoRef.put(logo).then((snapshot) => {
      snapshot.ref.getDownloadURL().then(snap =>{
        logoURL = snap;
      }).then(()=>{
        leaderRef.put(leaderPicture).then((snapshot) => {
          snapshot.ref.getDownloadURL().then(snap=>{
            leaderURL = snap;
          }).then(()=>{
            console.log(logoURL);
            console.log(leaderURL);
            //now upload to firestore
            let partyObject = {
              logo: logoURL,
              qbName: leaderName,
              qbPicture: leaderURL,
              record: record,
              teamName:partyName
            }
            db.collection('teams').add(partyObject).then(snapshot=>{
              db.collection('teams').doc(snapshot.id).collection('interactive').doc('control').set({showID:''});
              alert("Success!");
              onDismiss();
            });


          })
        })
      })
    }).catch(e=>{
      logoRef.delete();
      leaderRef.delete();
      alert('Error!');
    });
   

  }else{
    alert("Form Error!");
  }



  //upload files to datastore and get their links 
  //try to create new Party with data and links 
    //success do nothing 

    //failure -> delete the 2 files
}
  return(<div>
    <IonItem>
      <IonLabel>Party Name</IonLabel>
      <IonInput placeholder="Ex: Ole Miss" onIonChange={e=>handleSetPartyName(e.detail.value)}></IonInput>
    </IonItem>
    <IonItem>
      <IonLabel>Logo</IonLabel>
      <IonLabel>{logo?.name}</IonLabel>
      <input
        type="file"
        id="file-upload"
        style={{ display: "none" }}
        onChange={handleSetLogo}
      />
      <IonButton onClick={openFileDialogLogo}>
        <IonIcon slot="icon-only" icon={camera}></IonIcon>
        Upload
      </IonButton>
    </IonItem>
    <IonItem>
      <IonLabel>Leader Name</IonLabel>
      <IonInput placeholder="Ex: Matt Corral" onIonChange={e=>handleSetLeaderName(e.detail.value)}></IonInput>
    </IonItem>
    <IonItem>
      <IonLabel>Leader Picture</IonLabel>
      <IonLabel>{leaderPicture?.name}</IonLabel>
      <input
        type="file"
        id="file-upload-1"
        style={{ display: "none" }}
        onChange={handleSetLeader}
      />
      <IonButton onClick={openFileDialogLeader}>
        <IonIcon slot="icon-only" icon={camera}></IonIcon>
        Upload
      </IonButton>
    </IonItem>
    <IonItem>
      <IonLabel>Record</IonLabel>
      <IonInput placeholder="Ex: 3-1" onIonChange={e=>handleSetRecord(e.detail.value)}></IonInput>
    </IonItem>
    <IonButton expand="block" onClick={() => submitNewParty()}>
      Submit
    </IonButton>
    <IonButton expand="block" onClick={() => onDismiss()}>
      Close
    </IonButton>
  </div>);

};

const EditParty: React.FC<{
  onDismiss: () => void;
}> = ({ onDismiss }) => {

  const [ partyName, setPartyName ] = useState<string>("");
  const [ logo, setLogo ] = useState<File>();
  const [ leaderName, setLeaderName ] = useState<string>("");
  const [ leaderPicture, setLeaderPicture ] = useState<File>();
  const [ record, setRecord ] = useState<string>("");

  const [ partys, setPartys ] = useState<any[]>([]);
  const [ editFlag, setEditFlag ] = useState<boolean>(false);
  const [ selected, setSelected ] = useState<any>();




  const handleSetPartyName = (e:any) => {
    if(e){
      setPartyName(e);
    }
  }
  const handleSetLeaderName = (e:any) => {
    if(e){
      setLeaderName(e);
    }
  }
  const handleSetRecord = (e:any) => {
    if(e){
      setRecord(e);
    }
  }

  const openFileDialogLogo = () => { //runs the non ionic code 
    (document as any).getElementById("file-upload").click();
 };
 const openFileDialogLeader = () => { //runs the non ionic code 
  (document as any).getElementById("file-upload-1").click();
};

 const handleSetLogo = (_event: any) => {
   let f = _event.target.files![0];
   setLogo(f);
 }
 const handleSetLeader = (_event: any) => {
  let f = _event.target.files![0];
  setLeaderPicture(f);
}

const handleSelectParty = (selection:any) =>{

  setEditFlag(true); 
  setSelected(selection);
  
  handleSetPartyName(selection.data().teamName);
  handleSetLeaderName(selection.data().qbName);
  handleSetRecord(selection.data().record);

}

const submitEdit = ()=>{

  if(editFlag&& 
    (selected.data().teamName!=partyName || selected.data().qbName != leaderName || selected.data().record != record)
  ){
    db.collection('teams').doc(selected.id).update({
      qbName: leaderName,
      record: record,
      teamName:partyName
    }).then(snapshot =>{
      //if needed we can do something here with snapshot 

      alert("Complete!");
      onDismiss();
    }).catch(e=>{
      alert("Something went wrong!");
    })

  }else{
    alert("Select a Party Before Trying to Submit Changes");
  }

}

const deleteParty = ()=>{
  // first need to check for  events thatare using this party
  let partyInUse = false;
  db.collection('events').get().then(snapshot=>{
    snapshot.docs.map(doc=>{
      //console.log(doc.data().homeTeamRef.id+" and " + doc.data().visitorTeamRef.id);
      if(selected.id == doc.data().homeTeamRef.id || selected.id == doc.data().visitorTeamRef.id){
        console.log('party/team is in an event!');
        partyInUse=true;
      }else{
        //console.log('safe to delete?');
      }
    });
  }).then(snap=>{

    db.collection('temp').get().then(snapshot=>{
      snapshot.docs.map(doc=>{
        //console.log(doc.data().homeTeamRef.id+" and " + doc.data().visitorTeamRef.id);
        if(selected.id == doc.data().homeTeamRef.id || selected.id == doc.data().visitorTeamRef.id){
          console.log('party/team is in an event!');
          partyInUse=true;
        }else{
          //console.log('safe to delete?');
        }
      });
    }).then(snap=>{

      //if these events exist do not let them delete the team 
      //only whne the team is not in use on the system for temp and live events can it be deleted
      if(!partyInUse){
        //alert("You can delete!");
        db.collection('teams').doc(selected.id).delete().then(snap=>{
          alert("Deletion Complete!");
          onDismiss();
        });
      }else{
        alert("Not safe to delete");
      }
  
    });

  });
  
}


useEffect(() => {
  /**runs get events and pulls all events that are available  */
  var tempArray: firebase.firestore.DocumentData[]=[];
  db.collection('teams').get().then(snapshot =>{
      snapshot.docs.map(doc => {
        let temp = doc;
        tempArray.push(temp);
      });
      setPartys((partys: any) => [...partys, ...tempArray]);        

  });
},[])

  return(<div>
    {/* drop down selector 
    when selected options a bunch of text boxes pop up with all the informtion populated 
    can chnage this info and then send back */}
    <IonItem >
      <IonLabel>Select Party to Edit</IonLabel>
      <IonSelect  onIonChange={e=>handleSelectParty(e.detail.value)}>
        {partys.map(p=>{return(
          <IonSelectOption key={p.id} value={p}>{p.data().teamName}</IonSelectOption>)
        })}
      </IonSelect>
    </IonItem>

    <IonItem>
      <IonLabel>Party Name</IonLabel>
      <IonInput value={partyName} onIonChange={e=>handleSetPartyName(e.detail.value)}></IonInput>
    </IonItem>
    <IonItem>
      <IonLabel>Logo</IonLabel>
      <IonLabel>{logo?.name}</IonLabel>
      <input
        type="file"
        id="file-upload"
        style={{ display: "none" }}
        onChange={handleSetLogo}
      />
      <IonButton onClick={openFileDialogLogo}>
        <IonIcon slot="icon-only" icon={camera}></IonIcon>
        Upload
      </IonButton>
    </IonItem>
    <IonItem>
      <IonLabel>Leader Name</IonLabel>
      <IonInput value={leaderName} onIonChange={e=>handleSetLeaderName(e.detail.value)}></IonInput>
    </IonItem>
    <IonItem>
      <IonLabel>Leader Picture</IonLabel>
      <IonLabel>{leaderPicture?.name}</IonLabel>
      <input
        type="file"
        id="file-upload-1"
        style={{ display: "none" }}
        onChange={handleSetLeader}
      />
      <IonButton onClick={openFileDialogLeader}>
        <IonIcon slot="icon-only" icon={camera}></IonIcon>
        Upload
      </IonButton>
    </IonItem>
    <IonItem>
      <IonLabel>Record</IonLabel>
      <IonInput value={record} onIonChange={e=>handleSetRecord(e.detail.value)}></IonInput>
    </IonItem>
    <IonButton expand="block" onClick={()=>submitEdit()}>
      Submit
    </IonButton>
    <IonButton expand="block" onClick={() => onDismiss()}>
      Close
    </IonButton>
    {editFlag ? 
      <IonButton expand="block" color='danger' onClick={() => deleteParty()}>
        Delete
      </IonButton>
      : 
      null}
    

  </div>);
};

const Wrapper: React.FC = () => {

  const hnadleSubmitNewEvent = (obj:Array<string>,date:Date) => {
    console.log(obj);
    submitTemp(obj,date);
  };

  const handleDismiss = () => {
    dismiss();
  };

  const hnadleSubmitNewParty = () => {
    
  };

  const handleDismiss1 = () => {
    dismiss1();
  };
  const handleDismiss2 = () => {
    dismiss2();
  };

  const [ team, setTeam ] = useState<string>(''); //need to export team to other containers
  const [ event, setEvent ] = useState<string>(''); //need exact event possibly? will just be event id. containers will subscribe to data 
  const [present, dismiss] = useIonModal(NewEvent, {
    onDismiss: handleDismiss,
    submit: hnadleSubmitNewEvent,
  });
  const [present1, dismiss1] = useIonModal(NewParty, {
    onDismiss: handleDismiss1,
    //submit: hnadleSubmitNewParty,
  });
  const [present2, dismiss2] = useIonModal(EditParty, {
    onDismiss: handleDismiss2,
    //submit: hnadleSubmitNewParty,
  });



  const handleSelection = (team:string, event:string) => {
    console.log("team "+team);
    document.body.classList.toggle(team); //css selector
    setTeam(team);
    setEvent(event);
    //need to set event and pass it from selection
  }

  /**
   * create new event method 
   * name of event 
   * event type
   * how many partys
   * name parties 
   * 
   * publish this to a temp place -> when ready to publish copy it to proper place(this will be somewere else)
   * load in app like normal with temp address
   *    method as prop that once team has been published goes back to team select 
   */

  const handleNewEvent = () =>{
    present();
  }

  const submitTemp = (d: Array<string>, date:Date) => {
    let object = {
      distance:"",
      down:"",
      eventDate:date,
      homeTeamPassingYards:"",
      homeTeamRef:db.doc(d[0]),
      homeTeamScore:"",
      qtr:"",
      time:"",
      visitorTeamPassingYards:"",
      visitorTeamRef: db.doc(d[1]),
      visitorTeamScore: ""
    };
    db.collection("temp").doc().set(object).then(() => {
      console.log("Document successfully written!");
    });
    //do something if error 
  }
  const handleNewParty = () =>{
    present1();
  }
  const handleEditParty = () =>{
    present2();
  }

  return(
    <>{team && event != '' ? <App event={event} team={team}/>: <TeamSelector handleEditParty={handleEditParty} handleNewParty={handleNewParty} handleNewEvent={handleNewEvent} onSelection={handleSelection}></TeamSelector>}</>
  );
};

export default Wrapper;
