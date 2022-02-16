import readline from 'readline';
import firebase from 'firebase'
import { exit } from 'process';

const firebaseConfig = {
    apiKey: "AIzaSyC0Az7OML03rK3K41QnwdBRImD2GvXNVqo",
    authDomain: "myapp-react-452d8.firebaseapp.com",
    projectId: "myapp-react-452d8",
    storageBucket: "myapp-react-452d8.appspot.com",
    messagingSenderId: "793700872338",
    appId: "1:793700872338:web:127b2d91f67da1c0c5b64b",
    measurementId: "G-RH6JTFPYBB"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db=firebase.firestore();

function intervalF(docId,object){
  db.collection('events').doc(docId).update(object);
}


async function setUp(){
  return await firebase.auth().signInWithEmailAndPassword('temp@temp.edu','temp123');
}

let events =[];

function docMenu(){
  // also specify the input and output sources
  const commandLineIO = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  // show a question to the user
  commandLineIO.question("Which event?\n" + events.map((value,index)=>{return (index+": "+value +'\n')}).join("") +"\nRELOAD: R\nBACK: B\n", (answer) => {
    

    // stop accepting the input
    commandLineIO.close();
    if(answer=='B'){
      console.log('\n\n\n');
      mainMenu();
    }else if(answer=='R'){
      console.log('\n\n\n');
      docMenu();
    }else{
      //grab all event info from specific doc
      let docID = events[answer];

      //return back here after chnage until input quit 

      db.collection('events').doc(docID).get().then(snap=>{
        let keys = Object.keys(snap.data());
       

        //sim a qtr
        let gameStart=snap.data();
        gameStart.time = "15:00";
        gameStart.qtr = "1";
        gameStart.homeTeamPassingYards = '0';
        gameStart.visitorTeamPassingYards= '0';
        gameStart.visitorTeamScore = '0';
        gameStart.homeTeamScore='0'
        gameStart.down = "1";
        gameStart.distance = "10";
        intervalF(docID,gameStart); //so can see instantly

        //home team has ball 0:home 1:vis
        let hasBall = 0;
        //score are preprogramed at certain times
        
        let inter = setInterval(callBack=>{
          intervalF(docID,gameStart);
          
          //if time 0? end loop
          if(gameStart.time == '00:00'){
            clearInterval(inter);
            console.log('Game Complete!');
            exit();
          }else{

            //dec time
            let time = gameStart.time.replace(":","");
            time = (+time-100).toString();
            if(time.length==4){
              time = time.substring(0, 2) + ":" + time.substring(2, time.length);
            }else if(time.length==3){
              time = "0"+time.substring(0, 1) + ":" + time.substring(1, time.length);
            }else{
              time ="00:00";
            }
            gameStart.time = time;
            gameStart.distance = (Math.floor(Math.random() * (10 - 1) ) + 10).toString();


            //still have ball? 
            //Math.floor(Math.random() * (max - min) ) + min; 0-4 yes 5-10 not
            if(Math.floor(Math.random() * (9 - 0) ) + 0 >= 5){
              console.log('lost ball!')
              if(hasBall==0)
              hasBall=1;
              else
              hasBall=0;
              console.log(hasBall +" now gets it");
              //  if not reset all downs 
              gameStart.down = (Math.floor(Math.random() * (4 - 2) ) + 2).toString();
              let dis =  Math.floor(Math.random() * (10 - 5) ) + 5;
              gameStart.distance = dis;

            }else{
              console.log("kept ball");
              //  if yes 
              //    if score?
              if(Math.floor(Math.random() * (100 - 1) ) + 1 >85){
              //   if yes happns one 10% of the time 
              //   add points to team and switch team
                console.log("score");
                if(hasBall==0){
                  gameStart.homeTeamScore= (+gameStart.homeTeamScore +7).toString();
                }else{
                  gameStart.visitorTeamScore= (+gameStart.visitorTeamScore +7).toString();
                }

              }else{
              //   if no
              console.log("no score")
              }
              //    random down 
              gameStart.down = (Math.floor(Math.random() * (4 - 2) ) + 2).toString();

              //    add pass yards? between 10 and 30
              if(hasBall==0){
                gameStart.homeTeamPassingYards = (+gameStart.homeTeamPassingYards + (Math.floor(Math.random() * (25 - 20) ) + 20)).toString();
              }else{
                gameStart.visitorTeamPassingYards = (+gameStart.visitorTeamPassingYards + (Math.floor(Math.random() * (25 - 20) ) + 20)).toString();

              }

              //    random distance if not first between 1 and 10
              let dis =  Math.floor(Math.random() * (10 - 5) ) + 5;
              gameStart.distance = dis;
              console.log(hasBall +" gained yrds: " + dis);
              
           
              
            }
          }

        },1000) //every minute
        
      });
    }
  });

}
function mainMenu(){
  // also specify the input and output sources
  const commandLineIO = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  // show a question to the user
  commandLineIO.question("What would you like to do? \n0. Simulate Game\n1. Quit\n", (answer) => {
   

    // stop accepting the input
    commandLineIO.close();
    if(answer==0){
      db.collection('events').get().then(snap=>{
        events=[];
        snap.docs.map(e=>{
          //e is a event doc
          events.push(e.id);
        });
        docMenu();
  
      });

    }else{
      exit();
    }
  });

}


async function main (){


  setUp().then(something =>{

    mainMenu()
    
  });
  
}



main();