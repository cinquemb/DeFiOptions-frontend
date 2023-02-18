// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import './StratLeg.css';
import { Col } from "react-bootstrap"
import Form from 'react-bootstrap/Form';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import allActions from '../../redux/actions';
import DateTimePicker from 'react-datetime-picker';
import bs from 'black-scholes';
import Button from 'react-bootstrap/Button';


function StratLeg(props) {
    console.log(props)
    const [hidden, setHidden] = useState("hidden");
    const symbol = useSelector(state => state.currentSymbol);
    const thisLeg = useSelector((state) => state.currentStrategies[props.id].legs == null ? null : state.currentStrategies[props.id].legs[props.index])
    const dispatch = useDispatch();


    useEffect(() => {
        setHidden((props.loading == true) ? "true" : "hidden")
    }, [props.loading]);

    useEffect(() => {
        dispatch(allActions.updateStrategies.updateLeg(props.id, props.index, "direction", props.direction))
        dispatch(allActions.updateStrategies.updateLeg(props.id, props.index, "type", props.type))
        dispatch(allActions.updateStrategies.updateLeg(props.id, props.index, "strike", 0.00))
        dispatch(allActions.updateStrategies.updateLeg(props.id, props.index, "premium", 0.00))
        dispatch(allActions.updateStrategies.updateLeg(props.id, props.index, "premium1", 0.00))
        dispatch(allActions.updateStrategies.updateLeg(props.id, props.index, "quantity", 0))
        dispatch(allActions.updateStrategies.updateLeg(props.id, props.index, "expiration", Number(Math.floor(Date.now() / 1000))))
    }, [dispatch, props.id, props.index, props.direction, props.type, props.newStrat]);

    function handleDirectionChange(event) {
        const newDir = (event.target.value === '+') ? '+' : '-'
        dispatch(allActions.updateStrategies.updateLeg(props.id, props.index, "direction", newDir))            
    }

    function handleTypeChange(event) {
        const newType = (event.target.value === 'P') ? 'P' : 'C'
        dispatch(allActions.updateStrategies.updateLeg(props.id, props.index, "type", newType))
        computePremium()         
    }

    function handleStrikeChange(event) {
        dispatch(allActions.updateStrategies.updateLeg(props.id, props.index, "strike", event.target.value))
        computePremium()
    }

    function handlePremiumChange(event) {
        dispatch(allActions.updateStrategies.updateLeg(props.id, props.index, "premium", event.target.value))
    }

    function handleQuantityChange(event) {
        dispatch(allActions.updateStrategies.updateLeg(props.id, props.index, "quantity", event.target.value))
    }

    function handleExpirationChange(date) {
        dispatch(allActions.updateStrategies.updateLeg(props.id, props.index, "expiration", Number(Math.floor(date / 1000))))
        computePremium()
    }

    function computePremium(){
        if (thisLeg["strike"] !=0 && symbol != "" && props.underlyingDataProps[symbol]["currentPrice"] != null && props.underlyingDataProps[symbol]["realizedVol"] !== null && thisLeg['expiration'] != 0 && thisLeg['type'] != null) {
            let rvol = props.underlyingDataProps[symbol]["realizedVol"] / props.underlyingDataProps[symbol]["currentPrice"] * 20;
            let dt = (thisLeg['expiration'] - Number(Math.floor(Date.now() / 1000))) / (60 * 60 * 24 * 365);
            let dt1 = (60 * 60 * 24) / (60 * 60 * 24 * 365);
            let computedPremium = bs.blackScholes(
                parseFloat(props.underlyingDataProps[symbol]["currentPrice"]),
                parseFloat(thisLeg["strike"]),
                dt,
                rvol,
                0,
                (thisLeg['type'] === 'P') ? 'put' : 'call'
            );

            let computedPremium1 = bs.blackScholes(
                parseFloat(props.underlyingDataProps[symbol]["currentPrice"]),
                parseFloat(thisLeg["strike"]),
                dt1,
                rvol,
                0,
                (thisLeg['type'] === 'P') ? 'put' : 'call'
            );

            console.log(parseFloat(props.underlyingDataProps[symbol]["currentPrice"]))
            console.log(    parseFloat(thisLeg["strike"]))
            console.log(    dt)
            console.log(    rvol)
            console.log(    0)
            console.log(    (thisLeg['type'] === 'P') ? 'put' : 'call')
            console.log(computedPremium)
            dispatch(allActions.updateStrategies.updateLeg(props.id, props.index, "premium", computedPremium));
            dispatch(allActions.updateStrategies.updateLeg(props.id, props.index, "premium1", computedPremium1));
        }
    }

      function handleLimitOrderSubmit(event) {
        dispatch(allActions.updateSubmit(true))
        event.preventDefault();
      }

      function killCLick(event) {
        event.preventDefault();
      }

    return (
    <div className="StratLeg-div">
        <Button onClick={killCLick} onMouseDown={handleLimitOrderSubmit} variant="outline-primary" type="submit" style={{float:"center", borderRadius: "0px"}}>
            
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" style={{visibility: hidden}}></span>
            Place Limit Order
        </Button>
        <Form>
            <Form.Row>
                <Form.Group as={Col} controlID="legDirection">
                    <Form.Check type="radio" name="dir" label="Long" value='+'
                        checked={thisLeg == null ? props.direction ==='+' : thisLeg["direction"] ==='+'}
                        disabled={props.direction !=='+' && !props.custom} onChange={handleDirectionChange}/>
                    <Form.Check type="radio" name="dir" label="Short" value='-'
                        checked={thisLeg == null ? props.direction ==='-' : thisLeg["direction"] ==='-'}
                        disabled={props.direction !=='-' && !props.custom} onChange={handleDirectionChange}/>    
                </Form.Group>
                <Form.Group as={Col} controlID="legType">
                    <Form.Check type="radio" name="pc" label="Put" value='P'
                        checked={thisLeg == null ? props.type === 'P' : thisLeg["type"] ==='P'}
                        disabled={props.type !=='P' && !props.custom} onChange={handleTypeChange}/>
                    <Form.Check type="radio" name="pc" label="Call" value='C'
                        checked={thisLeg == null ? props.type === 'C' : thisLeg["type"] ==='C'}
                        disabled={props.type !=='C' && !props.custom} onChange={handleTypeChange}/>    
                </Form.Group>
                <Form.Group as={Col} controlID="legStrike">
                    <Form.Label>Strike</Form.Label>
                    <Form.Control value={thisLeg == null ? 0.00 : thisLeg["strike"]} onChange={handleStrikeChange}/>  
                </Form.Group>
                <Form.Group as={Col} controlID="legPremium">
                    <Form.Label>Premium</Form.Label>
                    <Form.Control value={thisLeg == null ? 0.00 : thisLeg["premium"]} onChange={handlePremiumChange}/>
                </Form.Group>
                <Form.Group as={Col} controlID="legQuantity">
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control value={thisLeg == null ? 0.00 : thisLeg["quantity"]} onChange={handleQuantityChange}/>
                </Form.Group>
                <Form.Group as={Col} controlID="legExpiration">
                    <Form.Label>Expiration</Form.Label>
                    <span></span>
                    <DateTimePicker onChange={handleExpirationChange} style="color: inherit !important;"/>
                </Form.Group>
            </Form.Row>
        </Form>
    </div>
    );
}

export default StratLeg; 