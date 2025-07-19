// src/reducer/sidebarReducer.js

const sidebarReducer = (state, action) => {
    switch(action.type){
        case "TOGGLE_SIDEBAR":
            return {
                ...state,
                isSidebarOpen: !state.isSidebarOpen // Invierte el valor actual
            }
        default:
            return state; // Siempre devuelve el estado si la acción no coincide
    }
}

export default sidebarReducer;