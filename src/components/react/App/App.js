import React from 'react';
import './App.css';
//components 
import Ticker from '../Ticker/Ticker';
import AddClear from '../AddClear/AddClear';
import Chart from '../Chart/Chart';
import StratContainer from '../Strategy_Form/StratContainer';
import {Provider} from 'react-redux';
import {createStore} from 'redux'
import rootReducer from '../../redux/reducers'

const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);


class OptionsVizualizer extends React.Component {
  render () {
    return (
      <Provider store={store}>
        <div className="App">
          <Ticker underlyingDataProps={this.props.underlyingData}/>
          <AddClear />
          <StratContainer />
          <Chart underlyingDataProps={this.props.underlyingData}/>
        </div>
      </Provider>
    )
  }
  
}

export default OptionsVizualizer;