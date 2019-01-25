// @flow
import keplerGlReducer from 'kepler.gl/reducers';
import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';
import _ from 'lodash';
import moment from 'moment';

const INITIAL_STATE ={
  fromDate: '24/09/2018', //moment().add(-2, 'days'),
  tillDate: '25/09/2018' //moment().add(-1, 'days')
};

const reducer = (state = INITIAL_STATE, action) => {

  switch( action.type ) {

    case 'FROM_DATE_CHANGED': {

      state = _.assign({}, state, {
        fromDate: action.data.date
      });

    }
    break;

    case 'TILL_DATE_CHANGED': {

      state = _.assign({}, state, {
        fromDate: action.data.date
      });

    }
    break;

  }

  return state;
}

const reducers = combineReducers({
  keplerGl: keplerGlReducer,
  app: reducer
});

const composedReducer = (state, action) => {
 switch (action.type) {
   case 'QUERY_SUCCESS':
     return {
       ...state,
       keplerGl: {
         ...state.keplerGl,

         // 'map' is the id of the keplerGl instance
         map: {
            ...state.keplerGl.map,
            visState: visStateUpdaters.updateVisDataUpdater(
              state.keplerGl.map.visState, {datasets: action.payload})
         }
       }
     };
 }
 return reducers(state, action);
};

export default composedReducer;
