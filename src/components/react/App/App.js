//import React from 'react';
import './App.css';
//components 
import Ticker from '../Ticker/Ticker';
import AddClear from '../AddClear/AddClear';
import Chart from '../Chart/Chart';
import StratContainer from '../Strategy_Form/StratContainer';

function OptionsVizualizer() {
  return (
    <div className="App">
      <div>
          Options Visualizer    
      </div>
      <Ticker/>
      <AddClear />
      <StratContainer />
      <Chart />
    </div>
  );
}

export default OptionsVizualizer;