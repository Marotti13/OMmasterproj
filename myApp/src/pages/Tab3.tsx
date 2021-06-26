import { IonAlert, IonCol, IonContent, IonGrid, IonHeader, IonInput, IonItem, IonLabel, IonPage, IonRow, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Tab3.css';

import { useRef, useState } from 'react';

import BmiControls from '../components/BmiControls';
import BmiResults from '../components/BmiResults';
import React from 'react';
import { EROFS } from 'constants';
import InputControls from '../components/InputControls';

const Tab3: React.FC = () => {
  const [ calculatedBMI, setCalculatedBMI ] = useState<number>();
  const [ error, setError ] = useState<string>();
  const [ calcUnits, setCalcUnits ] = useState<'mkg' | 'ftlbs'>('ftlbs');

  const weightInputRef = useRef<HTMLIonInputElement>(null);
  const heightInputRef = useRef<HTMLIonInputElement>(null);

  const calculateBMI = () => {
    const enteredWeight = weightInputRef.current!.value; //! means this code will never run without a value being stored in side .current ref (TS doesnt know react handles it) 
    const enteredHeight = heightInputRef.current!.value;

    if (!enteredHeight || !enteredWeight || +enteredHeight <= 0 || +enteredWeight <=0){
      setError('You Fucked Up! Stop Breaking Things');
      return;
    }

    const weightConversionFactor = calcUnits === 'ftlbs' ? 2.2 : 1;
    const heighConversionFactor = calcUnits === 'ftlbs' ? 3.28 : 1;

    const weight = +enteredWeight / weightConversionFactor;
    const height = +enteredHeight / heighConversionFactor;

    const bmi = weight / (height * height);

    setCalculatedBMI(bmi);
  };

  const resetInputs = () => {
    weightInputRef.current!.value = '';
    heightInputRef.current!.value = '';
  };

  const selectedCalcUnitHandler = (selectedValue: 'mkg' | 'ftlbs') => {
    setCalcUnits(selectedValue);
  } //name handler is used here but should be used for ither methods above but i didnt do it

  return (
    <React.Fragment>
    <IonAlert isOpen={!!error} message={error} buttons={[{text: 'Fine.', handler: () =>{
      setError("");
    }}]}/>
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>BMI Calculator</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">BMI Calculator</IonTitle>
          </IonToolbar>
        </IonHeader>
          <IonGrid>
            <IonRow>
              <IonCol>
                <InputControls 
                  selectedValue={calcUnits} 
                  onSelectedValue={selectedCalcUnitHandler}
                />
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonItem>
                  <IonLabel position='floating'>Your Height ({calcUnits === 'mkg' ? 'meters' : 'feet'})</IonLabel>
                  <IonInput type='number' ref={heightInputRef}></IonInput>
                </IonItem>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonItem>
                  <IonLabel position='floating'>Your Weight ({calcUnits === 'mkg' ? 'kg' : 'lbs'})</IonLabel>
                  <IonInput type='number' ref={weightInputRef}></IonInput>
                </IonItem>
              </IonCol>
            </IonRow>
            <BmiControls onCalculate={calculateBMI} onReset={resetInputs}/>
            {calculatedBMI && (
              <BmiResults result={calculatedBMI}/>
            )}
          </IonGrid>
      </IonContent>
    </IonPage>
    </React.Fragment>
  );
};

export default Tab3;
