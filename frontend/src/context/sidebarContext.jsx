import React, { createContext, useReducer } from "react";
import reducer from "../reducer/sidebarReducer"; // Ruta correcta al reducer
import PropTypes from 'prop-types'; // Para validación de props

const initialState = {
    isSidebarOpen: false // Estado inicial del sidebar (cerrado)
}

export const SidebarContext = createContext({});
export const SidebarProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    // Función para alternar el estado del sidebar
    const toggleSidebar = () => {
        dispatch({ type: "TOGGLE_SIDEBAR" })
    }

    return (
        <SidebarContext.Provider value = {{
            ...state, // Expone el estado actual (isSidebarOpen)
            toggleSidebar // Expone la función para cambiar el estado
        }}>
            { children }
        </SidebarContext.Provider>
    )
}

SidebarProvider.propTypes = {
    children: PropTypes.node // Validar que children sea un nodo de React
}