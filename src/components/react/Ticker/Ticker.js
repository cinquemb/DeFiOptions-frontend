// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import './Ticker.css';
import allActions from '../../redux/actions'
import { connect } from 'react-redux';
import Form from 'react-bootstrap/Form';


function Ticker(props) {
  const [symbols, setSymbols] = useState(new Set());

  useEffect(() => {
    function getValidSymbols() {
      return Object.keys(props.underlyingDataProps);
    }

    let data = getValidSymbols();
    setSymbols(new Set(data.map(i => i))); 
  }, []);

  function handleSymbolChange(event) {
    const cleanInput = event.target.value.trim().toUpperCase();

    if (symbols.has(cleanInput)) {
      props.dispatch(allActions.changeSymbol(cleanInput));
      //setCursym(event.target.value);
    }
  }

  return (
    <div className="Ticker-div"> 
      <Form>
        <Form.Label>Available Symbols:</Form.Label>
        <Form.Control
          as="select"
          onChange={handleSymbolChange}>
          <option value="N/A">Please Select Symbol</option>
          {Object.keys(props.underlyingDataProps).map((symbol, i) => <option value={symbol} id={i}>{symbol}</option>)}
        </Form.Control>
      </Form>
        
    </div>
  );
}

export default connect()(Ticker);