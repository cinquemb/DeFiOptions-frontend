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
        <div className="App" onInput={this.props.onChange.bind(this, store)} onMouseUp={this.props.onChange.bind(this, store)}>
          <Ticker underlyingDataProps={this.props.underlyingData}/>
          <AddClear />
          <StratContainer underlyingDataProps={this.props.underlyingData} loading={this.props.loading}/>
          <Chart underlyingDataProps={this.props.underlyingData}/>
        </div>
      </Provider>
    )
  }
  
}

export default OptionsVizualizer;