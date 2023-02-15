// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import './Ticker.css';
import Button from 'react-bootstrap/Button';
import { useSelector } from 'react-redux';
import allActions from '../../redux/actions'
import { connect } from 'react-redux';

function Ticker(props) {
  const [curinput, setCurinput] = useState('');
  const [disabled, setDisabled] = useState(true);
  const [submit, setSubmit] = useState(false);
  const [symbols, setSymbols] = useState(new Set());
  const currSymbol = useSelector(state => state.currentSymbol)

  useEffect(() => {
    function getValidSymbols() {
      return Object.keys(props.underlyingDataProps);
    }

    let data = getValidSymbols();
    setSymbols(new Set(data.map(i => i))); 
  }, []);

  function handleChange(event) {
    const cleanInput = event.target.value.trim().toUpperCase();

    if (symbols.has(cleanInput)) {
      setDisabled(false);
    } else{ 
      setDisabled(true);
    }
    setCurinput(event.target.value);
  }

  function handleSubmit(event) {
    let cleanInput = curinput.trim().toUpperCase();
    if (cleanInput !== currSymbol) {
      props.dispatch(allActions.changeSymbol(cleanInput))
    }
    event.preventDefault();
  }

  function handleLimitOrderSubmit(event) {
    setSubmit(true);
    props.dispatch(allActions.updateSubmit(true))
    event.preventDefault();
  }

  return (
    <div className="Ticker-div"> 
      <div>
        Available Symbols: {Object.keys(props.underlyingDataProps).join(', ')}
      </div>
      <form onSubmit={handleSubmit}>
        <label style={{paddingRight:"5px"}}>
          <input type="text" placeholder="Enter Ticker Symbol Here" value={curinput} onChange={handleChange} className="Ticker-searchbar" />
        </label>
        <Button variant="outline-primary" type="submit" disabled={disabled} style={{float:"center", borderRadius: "0px"}}>Submit</Button>
      </form>
      <form onSubmit={handleLimitOrderSubmit}>
        <input type="hidden" placeholder="is submit" value={submit} />
        <Button variant="outline-primary" type="submit" style={{float:"center", borderRadius: "0px"}}>Place Limit Order</Button>
      </form>
    </div>
  );
}

export default connect()(Ticker);