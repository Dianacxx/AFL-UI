import {ACTION_INITIALIZE_APP, ADD_QUOTELINE, 
    REMOVE_QUOTELINE, CLONE_QUOTELINE, 
    REORDER_QUOTELINE } from 'c/appConstant';

const addQuoteLine = content => {
    return (dispatch, getState) => {
        //call apex method to add the quoteline here with then and catch 
        //dispatching type and payload
        /* EXAMPLE: 
        export const addTodo = content => {
            return (dispatch, getState) => {
            addNewTodo({content: content})
            .then(result => {
            dispatch({
                type:ADD_TODO,
                payload: JSON.parse(JSON.stringify(result))
            });
            })
            .catch(error => {
                console.error(error);
            });
            }
        }
        https://github.com/chandrakiran-dev/lwc-redux/blob/master/examples/lwc/todoAppActions/todo.js
        */
    }
};

const removeQuoteLine = content => {
    return (dispatch, getState) => {
        //call apex method to delete the quoteline here with then and catch 
        //dispatching type and payload
    }
}

const cloneQioteLine = content => {
    return (dispatch, getState) => {
        //call apex method to clone + add the quoteline here with then and catch 
        //dispatching type and payload
    }
}

const reorderQuoteLine = content => {
    return (dispatch, getState) => {
        //call apex method to retrieve info reorder? the quoteline here with then and catch 
        //dispatching type and payload
    }
}