import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonPage, IonRadio, IonRadioGroup, IonSelect, IonSelectOption, IonText, IonTitle, IonToolbar, useIonModal } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import SurveyContainer from '../components/SurveyContainer';
import SurveyContainerAdmin from '../components/SurveyContainerAdmin';
import { db } from '../firebaseConfig';
import ClientTab2 from './clientTab2';

const Tab2: React.FC<{
  team:string; 
}> = props => {

  const handleDismiss = () => {
    dismiss();
  };

  const handleSubmit = (doc:any) =>{
    db.collection('teams').doc(props.team).collection("interactive").add(doc);
  }

  const handleDismiss1 = () => {
    dismiss1();
  };


  const [ state, toggleState ] = useState<"admin" | 'user'>('admin');
  const [present, dismiss] = useIonModal(NewInter, {
    onDismiss: handleDismiss,
    submit:handleSubmit
  });
  const [present1, dismiss1] = useIonModal(EditInter, {
    onDismiss: handleDismiss1,
    team:props.team
  });

  const [ docs, setDocs ] = useState<any>([{
    question:'',
    control:'',
    id:'',
    type:''
  }]); 

  const [ control, setControl ] = useState<any>('');


  const handleSetControl =(id:any)=>{
    //push control id to firestore
    db.collection('teams').doc(props.team).collection("interactive").doc('control').set({showID:id});
    //update it here as well?
  }

  
  
  const toggle = () =>{
    if(state=='admin'){
      toggleState("user");
    }else{
      toggleState('admin');
    }

  }

  const handleDelete = (id:string)=>{
    //check if in use first 
    if(id==control){
      console.log('cant do that!');
      alert("Cannot delete a deployed module!");
    }else{
      console.log('you can delete');
      db.collection('teams').doc(props.team).collection('interactive').doc(id).delete().then(snap=>{
        alert("Success!");
      })
    }
    // then execute delete
  }

  useEffect(() => {
    db.collection('teams').doc(props.team).collection('interactive').onSnapshot(snap =>{
      let temparr: any =[];
      snap.docs.map(doc=>{
        if(doc.id != 'control'){
          let data = doc.data();
          data["id"]=doc.id;
          temparr.push(data);
        }
        else if(doc.id=='control'){
          setControl(doc.data().showID);
        }
      });
      setDocs(temparr);
    });

}, [])

  return (
    <IonPage>
      <IonHeader collapse="condense">
        <IonToolbar>
          <IonTitle>Interactive</IonTitle>
          <IonButton color='warning' slot="end" onClick={toggle}>Toggle</IonButton>
        </IonToolbar>
      </IonHeader>
        {state == 'admin' ?
        <IonContent fullscreen>
          <IonItem>
            <IonLabel>Current Interactive</IonLabel>
            <IonSelect onIonChange={e=>handleSetControl(e.detail.value)} value={control}>
            <IonSelectOption value="">---Show Nothing---</IonSelectOption>
              {docs.map((e: any,i:number)=>{
                return(
                <IonSelectOption value={e.id}>{e.question}</IonSelectOption>
              )
              })}
              
            </IonSelect>
          </IonItem>
          <IonItem>
            <IonLabel>Results</IonLabel>
            {/* if trivia display the names of people who were correct
            
            if survey display percentage of options 
            */}
          </IonItem>
            {docs.map((e: any,i:number)=>{ 
              return(
                <React.Fragment>
                  {e.type=='survey'?
                    <IonCard>
                      <IonButton onClick={d=>handleDelete(e.id)} size ='small' color='warning'>X</IonButton>
                      <IonCardHeader>
                        <IonCardTitle>{e.question}</IonCardTitle>
                        <IonCardSubtitle>Survey</IonCardSubtitle>
                      </IonCardHeader>
                      <IonCardContent>
                        <SurveyContainerAdmin docID={e.id} team={props.team}></SurveyContainerAdmin>
                      </IonCardContent>
                    </IonCard>
                  :null}
                  {e.type=='trivia'?
                    <IonCard>
                      <IonButton onClick={d=>handleDelete(e.id)} size ='small' color='warning'>X</IonButton>
                      <IonCardHeader>
                        <IonCardTitle>{e.question}</IonCardTitle>
                        <IonCardSubtitle>Trivia</IonCardSubtitle>
                      </IonCardHeader>
                      <IonCardContent>
                        <IonLabel>Correct Names: </IonLabel>
                        <IonLabel>{e.correctNames.map((e:any,i:number)=>{
                          if(i==0){
                            return(e)
                          }
                          else{
                            return(', ' + e)
                          }
                          })}</IonLabel>
                      </IonCardContent>
                    </IonCard>
                  :null}
                </React.Fragment>
              )
            
            })}
          
        
          <IonButton onClick={e=>present1()}>Edit</IonButton>
          <IonButton onClick={e=>present()}>Create</IonButton>
        </IonContent>
           
        :
        <IonContent fullscreen>
        <ClientTab2 team={props.team}/>
        </IonContent>}
      
    </IonPage>
  );
};

const NewInter: React.FC<{
  onDismiss: () => void;
  submit: (obj:any) => void;
}> = ({ onDismiss, submit }) => {

  const [ type, setType ] = useState<string>('trivia');
  const [ question, setQuestion ] = useState<string>('');
  const [ optionArray, setOptionArray ] = useState<any[]>([]); //might not need it as this tyoe of var
  const [ answer, setAnswer ] = useState<number>();

  

  const handleSelection = (selection:string)=> {
    setType(selection);
  }

  const handleSetQuestion = (text:any) =>{
    setQuestion(text);
  }

  const handleSetAnswer = (ans:number)=> {
    setAnswer(ans);
  }

  const handleSetOption = (index:number,optionString:any)=>{
    let tempArray = [...optionArray];
    tempArray[index] = optionString;
    setOptionArray(tempArray);
  }

  const handleAddOption = ()=>{
    setOptionArray((state: any) => [...state, null]);
  }
  
  const handleRemoveOption = (index:number)=>{
    let tempArray = [...optionArray];
    tempArray.splice(index,1);
    setOptionArray(tempArray);
  }

  const handleSubmit = () =>{
    
    if(type=='trivia'){
      let triviaObject = {
        answer:answer,
        options: [...optionArray],
        question: question,
        type: "trivia"
      };
      console.log(JSON.stringify(triviaObject));
      submit(triviaObject);
      
    }
    else if(type=='survey'){

      let surveyOps = optionArray.map((op:any) => {return({
        name:op,
        votes: 0
      })});

      let surveyObject = {
        complete:false,
        options:surveyOps,
        question:question,
        type:"survey"
      }
      console.log(JSON.stringify(surveyObject));
      submit(surveyObject);

    }
    onDismiss();
  }
  

  useEffect(() => {
    
  },[])
  return(
  <div>
    <IonItem>
      <IonSelect value={type} onIonChange={e=>handleSelection(e.detail.value)}>
        <IonSelectOption value='trivia'>Trivia</IonSelectOption>
        <IonSelectOption value='survey'>Survey</IonSelectOption>
      </IonSelect>
    </IonItem>
    
      <IonItem>
        <IonLabel>Question</IonLabel>
        <IonInput value={question} onIonChange={e=>{handleSetQuestion(e.detail.value)}} placeholder="Enter Question" ></IonInput>
      </IonItem>
      <IonItem>
        <IonLabel>Number of Options: {optionArray.length}</IonLabel>
        <IonButton onClick={e=>handleAddOption()}>Add</IonButton>
        {type=='trivia' ? <IonLabel slot='end'>Correct Answer</IonLabel>:null}
      </IonItem>

    <IonRadioGroup value={answer} onIonChange={e => handleSetAnswer(e.detail.value)}>
    {optionArray.map((op:any, index: any) => {return(
      <IonItem>
        <IonInput value={optionArray[index]} onIonChange={e=>handleSetOption(index,e.detail.value)}></IonInput>
        <IonButton onClick={e=>{handleRemoveOption(index)}}>remove</IonButton>
        {type=='trivia' ? <IonRadio slot="end" value={index} /> : null}
      </IonItem>)})}
    </IonRadioGroup>  

    <IonButton onClick={e=>{handleSubmit()}} expand="block">
      Submit
    </IonButton>
    <IonButton expand="block" onClick={() => onDismiss()}>
      Close
    </IonButton>
    
  </div>);
  
};

const EditInter: React.FC<{
  onDismiss: () => void;
  team:string;
}> = ({ onDismiss, team }) => {

  const [ docs, setDocs ] = useState<any>([{
    question:'',
    control:'',
    id:'',
    type:'',
    options:[],
    answer:''
  }]); 
  
  const [inter, setInter] = useState<any>({
    type:'',
    question:'',
    optionArray:[],
    answer:null,
    id:''
  });

  const [interSurvey, setInterSurvey] = useState<any>({
    type:'',
    question:'',
    optionArray:[{name:'',votes:0}],
    id:''
  });

  const [humanCheck, setHumanCheck] = useState<boolean>(false);

  const handleSetInterToEdit =(index:number)=>{
   
    setHumanCheck(false);

    //check type and set state accordingly chekc type to see which state 
    if(docs[index].type =='trivia'){
      setInterSurvey({
        type:'',
        question:'',
        optionArray:[{name:'',votes:''}],
        id:''
      });
      setInter({
        type:docs[index].type,
        question:docs[index].question,
        optionArray:docs[index].options,
        answer:docs[index].answer,
        id:docs[index].id
      });
    }else if(docs[index].type =='survey'){
      setInter({
        type:'',
        question:'',
        optionArray:[],
        answer:null,
        id:''
      });
      setInterSurvey({
        type:docs[index].type,
        question:docs[index].question,
        optionArray:docs[index].options,
        id:docs[index].id
      });
    }

    
    setHumanCheck(true);
  }


  const handleSetQuestion = (text:any) =>{
    if(humanCheck){ //might be problem later lol
      console.log("question chnaged " + text);
      setInter({
        type:inter.type,
        question:text,
        optionArray:inter.optionArray,
        answer:inter.answer,
        id:inter.id
      });
      
    }else if(!humanCheck){
    }
  }

  const handleSetAnswer = (ans:number)=> { //method run for every radio button that changes (all of them doesnt seem to affect mihc but annoyinh)
     //true
    if(humanCheck && !isNaN(ans)){ //check type? might need to make whole other state var
      console.log('answer chnaged to ' + ans);
      setInter({
        type:inter.type,
        question:inter.question,
        optionArray:inter.optionArray,
        answer:ans,
        id:inter.id
      });
      
    }else if(!humanCheck){
    }
  }

  const handleSetOption = (index:number,optionString:any)=>{
    let tempArray = inter.optionArray;
    tempArray[index] = optionString;
  
    setInter({
      type:inter.type,
      question:inter.question,
      optionArray:tempArray,
      answer:inter.answer,
      id:inter.id
    });
    console.log(index + " " + optionString);
  }

  const handleAddOption = ()=>{
    let tempArr = inter.optionArray;
    if(inter.type =='trivia'){
      tempArr.push("");
    }
    
    setInter({
      type:inter.type,
      question:inter.question,
      optionArray:tempArr,
      answer:inter.answer,
      id:inter.id
    });
  }
  
  const handleRemoveOption = (index:number)=>{
    let tempArray = inter.optionArray;
    tempArray.splice(index,1);
    setInter({
      type:inter.type,
      question:inter.question,
      optionArray:tempArray,
      answer:inter.answer,
      id:inter.id
    });
  }

  const handleSubmitTrivia = () =>{ 
    if(inter.type){
      let triviaObject = {
        answer:inter.answer,
        options:inter.optionArray,
        question:inter.question,
        type:inter.type
      };
      console.log(JSON.stringify(triviaObject));
      console.log('id: ' +inter.id);
      db.collection('teams').doc(team).collection('interactive').doc(inter.id).update(triviaObject);
    }
    onDismiss();
  }

//////////////////////////////////

  const handleSetQuestionSurvey = (text:any) =>{
    if(humanCheck){ //might be problem later lol
      console.log("question chnaged " + text);
      setInterSurvey({
        type:interSurvey.type,
        question:text,
        optionArray: interSurvey.optionArray,
        id:interSurvey.id
      });
      
    }else if(!humanCheck){
    }
  }

  const handleAddOptionSurvey = ()=>{
    let tempArr = interSurvey.optionArray;
    if(interSurvey.type =='survey'){
      tempArr.push({name:"",votes:0});////check later if needs to be empty string or not
    }
    
    setInterSurvey({
      type:interSurvey.type,
      question:interSurvey.question,
      optionArray:tempArr,
      id:interSurvey.id
    });
  }

  const handleSetName = (index:number,optionString:any)=>{
    let tempArray = interSurvey.optionArray;
    tempArray[index].name = optionString;
  
    setInterSurvey({
      type:interSurvey.type,
      question:interSurvey.question,
      optionArray:tempArray,
      id:interSurvey.id
    });
    console.log(index + " " + interSurvey.optionArray[index].name);
  }

  const handleSubmitSurvey = () =>{ 
    if(interSurvey.type == 'survey'){
      let surveyObject = {
        options:interSurvey.optionArray,
        question:interSurvey.question,
        type:interSurvey.type
      };
      console.log(JSON.stringify(surveyObject));
      console.log('id: ' +interSurvey.id);
      db.collection('teams').doc(team).collection('interactive').doc(interSurvey.id).update(surveyObject);
    }
    
    onDismiss();
  }

  const handleRemoveOptionSurvey = (index:number)=>{
    let tempArray = interSurvey.optionArray;
    tempArray.splice(index,1);
    setInterSurvey({
      type:interSurvey.type,
      question:interSurvey.question,
      optionArray:tempArray,
      id:interSurvey.id
    });
  }
  

  useEffect(() => {
    db.collection('teams').doc(team).collection('interactive').onSnapshot(snap =>{
      let temparr: any =[];
      snap.docs.map(doc=>{
        if(doc.id != 'control'){
          let data = doc.data();
          data["id"]=doc.id;
          temparr.push(data);
        }
      });
      setDocs(temparr);
    });
    
  },[])
  return(
  <div>
    <IonItem>
            <IonLabel>Edit</IonLabel>
            <IonSelect onIonChange={e=>handleSetInterToEdit(e.detail.value)}>
              {docs.map((e: any,i:number)=>{
                return(
                <IonSelectOption key={i} value={i}>{e.question}</IonSelectOption>
              )
              })}
              
            </IonSelect>
      </IonItem>
      {interSurvey.type=='survey'?
      
      <div>
      <IonItem>
        <IonLabel>Question</IonLabel>
        <IonInput onIonChange={e=>handleSetQuestionSurvey(e.detail.value)} value={interSurvey.question}></IonInput>
      </IonItem>
      <IonItem>
        <IonLabel>Number of Options: {interSurvey.question==''?0:interSurvey.optionArray.length}</IonLabel>
        {interSurvey.question==''?null:<IonButton onClick={e=>handleAddOptionSurvey()}>Add</IonButton>}
      </IonItem>
      {interSurvey.optionArray.map((op:any, index: number) => {
        return(
      <IonItem key={index}>
        <IonInput onIonChange={e=>handleSetName(index,e.detail.value)} value={op.name} ></IonInput>
        <IonInput value={op.votes} ></IonInput>
        <IonButton onClick={e=>{handleRemoveOptionSurvey(index)}}>Remove</IonButton>
      </IonItem>)})}
      <IonButton expand="block" onClick={e=>handleSubmitSurvey()}>
      Submit
    </IonButton>
    </div>
      
      
      :<div>
      <IonItem>
        <IonLabel>Question</IonLabel>
        <IonInput value={inter.question} onIonChange={e=>handleSetQuestion(e.detail.value)}></IonInput>
      </IonItem>
      <IonItem>
        <IonLabel>Number of Options: {inter.question==''?0:inter.optionArray.length}</IonLabel>
        {inter.question==''?null:<IonButton onClick={e=>handleAddOption()}>Add</IonButton>}
        <IonLabel slot='end'>Correct Answer</IonLabel>
      </IonItem>
      <IonRadioGroup value={inter.answer}  onIonChange={e => { 
      if((e.target as Element).getAttribute('role') == 'radiogroup'){
        handleSetAnswer(e.detail.value)
      }
        }} > 
      {inter.optionArray.map((op:any, index: number) => {
        return(
      <IonItem key={index}>
        <IonInput value={op} onIonChange={e=>handleSetOption(index,e.detail.value)}></IonInput>
        <IonButton onClick={e=>{handleRemoveOption(index)}}>Remove</IonButton>
        <IonRadio id='radio' slot="end" value={index} />
      </IonItem>)})}
    </IonRadioGroup> 
    <IonButton expand="block" onClick={e=>handleSubmitTrivia()}>
      Submit
    </IonButton></div>}
    <IonButton expand="block" onClick={() => onDismiss()}>
      Close
    </IonButton>
    
  </div>);
  
};


export default Tab2;
