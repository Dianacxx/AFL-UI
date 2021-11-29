import {ACTION_INITIALIZE_APP, ADD_QUOTELINE, REMOVE_QUOTELINE, CLONE_QUOTELINE, REORDER_QUOTELINE } from 'c/appConstant';

const initialState ={
    quoteLines: [],    
}

const tableState = (state = initialState, action) => {
    switch (action.type){
        case ACTION_INITIALIZE_APP: {
            return {
                ...state,
                quoteLines: [...quoteLines],
            };
        }
        case ADD_QUOTELINE: {
            const payload = action.payload; 
            return {
                ...state,
                quoteLines: [...state.quoteLines, payload], //NOT SURE IF JUST ID OR ALL OBJECT
            }
        }
        case REMOVE_QUOTELINE: {
            const payload = action.payload; 
            state.quoteLines.splice(payload,1); 
            return {
                ...state,
                quoteLines: [...state.quoteLines], //NOT SURE IF JUST ID OR ALL OBJECT
            }
        }
        case CLONE_QUOTELINE: {
            const payload = action.payload; 
            state.quoteLines = [...state.quoteLines, payload];
            return {
                ...state,
                quoteLines: [...state.quoteLines], //NOT SURE IF JUST ID OR ALL OBJECT
            }

        }
        case REORDER_QUOTELINE:{
            const payload = action.payload; 
            return {
                ...state,
                quoteLines: [...state.quoteLines], //NOT SURE IF JUST ID OR ALL OBJECT
            }

        }
        default: return state; 
    }
}

export default tableState; 