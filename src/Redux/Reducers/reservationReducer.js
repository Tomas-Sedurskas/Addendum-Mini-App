import { ADD_RESERVATION, RESERVATION_FAILED, LOADING_RESERVATION, GET_RESERVATIONS, GET_PATIENT_RESERVATIONS } from '../Types/reservationTypes';

const initState = {
    reservations: [],
    patientReservations: []
}
export const reservationReducer = (state = initState, action) => {
    switch(action.type){
        case ADD_RESERVATION:
            return{
                ...state,
                loading: false
            }
        case GET_RESERVATIONS:
            return{
                ...state,
                reservations: action.payload,
                loading: false
            }
        case GET_PATIENT_RESERVATIONS:
            return{
                ...state,
                patientReservations: action.payload,
                loading: false
            }
        case LOADING_RESERVATION:
            return{
                ...state,
                loading: true
            }
        case RESERVATION_FAILED:
            return{
                ...state,
                loading: false
            }
        default:
            return { ...state }
    }
}