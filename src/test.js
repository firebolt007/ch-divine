import { useState } from "react";

const App = () => {
    const[step, setStep] = useState(0);
    const startScreen = () => {
        <Button 

      onClick={startDivination}

      >
        开始算命
      </Button>
    };
    const startDivination = () => {
        setStep(1);
    }
    
    const test = () => {
        if (step > 0)
        {
            const x = "right"
        }
    }
    return ( 
      <>
        {currentStep === 0 && startScreen ()}
        {currentStep === 1 && test ()}
      </>)
};