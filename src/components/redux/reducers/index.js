import currentSymbol from './currentSymbol'
import currentStrategies from './currentStrategies'
import isSumbit from './isSumbit'
import { combineReducers } from 'redux'

const rootReducer = combineReducers({
    currentSymbol,
    currentStrategies,
    isSumbit
})

export default rootReducer;