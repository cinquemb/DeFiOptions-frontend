// eslint-disable-next-line no-unused-vars
import React from 'react';
import './StratBody.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import StratLeg from './StratLeg.js'
import { useSelector, useDispatch } from 'react-redux';
import allActions from '../../redux/actions'

function StratBody(props) {
  /*

  TODO: THIS IS THE DATA THAT WE NEED TO PASS UP INTO THE VUE COMPONENT
  {
  "strat": "Custom (1 Leg)",
  "legs": {
    "0": {
      "direction": "+",
      "type": "C",
      "strike": "1600",
      "premium": "1000",
      "quantity": "1"
    }
  }
}

*/
  const dispatch = useDispatch();
  const stratType = useSelector((state) => state.currentStrategies[props.id].strat)

  function handleSelectStract(event) {
    if (event.target.value === "---Select Strategy Type---") {
        dispatch(allActions.updateStrategies.clearStrategy(props.id))
    } else {
        dispatch(allActions.updateStrategies.updateStrategy(props.id, event.target.value))
    }
  }

  function handleDelete(event) {
    dispatch(allActions.updateStrategies.deleteStrategy(props.id))
    event.preventDefault()
  }

  return (
    <div className="StratBody-div"> 
      <Form>
          <Form.Group controlID="stratSelect">
              <Form.Label>Select Strategy</Form.Label>
              <Form.Control as="select" onChange={handleSelectStract} 
                value={typeof stratType == 'undefined' ? "---Select Strategy Type---" : stratType}>
                <option>---Select Strategy Type---</option>
                {Object.keys(props.table).map((strat) => <option>{strat}</option>)}
              </Form.Control>
          </Form.Group>
          <Form.Group controlID="stratLegs">
            {typeof stratType == 'undefined' ? (null) :
            props.table[stratType].map((leg, i) =>
                ([<Form.Label>Leg {i + 1}</Form.Label>,
                <StratLeg id={props.id} index={i} direction={leg.charAt(0)} type={leg.charAt(1)} 
                    newStrat={stratType} custom={stratType.startsWith('Custom')} underlyingDataProps={props.underlyingDataProps} loading={props.loading}/>])
            )}
          </Form.Group>
          <Button onClick={handleDelete}>Delete Strategy</Button>
      </Form>
    </div>
  );
}

export default StratBody; 