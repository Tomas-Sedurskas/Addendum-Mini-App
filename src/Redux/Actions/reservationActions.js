import { ADD_RESERVATION, RESERVATION_FAILED, LOADING_RESERVATION, GET_RESERVATIONS, GET_PATIENT_RESERVATIONS } from '../Types/reservationTypes';
import { axios } from '../../axios';

export const addReservation = (newReservation) => dispatch => {
    dispatch(setReservationLoading)
    axios.post('/add-reservation', { ...newReservation })
        .then(res => {
            dispatch({
                type: ADD_RESERVATION,
                payload: res.data
            })
        })
        .catch(res => dispatch({
            type: RESERVATION_FAILED,
            payload: res.data
        }));
}

export const getReservations = (date) => dispatch => {
    dispatch(setReservationLoading)
    axios.get('/get-reservations', { params: { date } })
        .then(res => {
            dispatch({
                type: GET_RESERVATIONS,
                payload: res.data
            })
        })
        .catch(res => dispatch({
            type: RESERVATION_FAILED,
            payload: res.data
        }));
}

export const getPatientReservations = (patient) => dispatch => {
    
    dispatch(setReservationLoading)
    axios.get('/get-patient-reservations', { params: { firstName: patient.firstName, lastName: patient.lastName } })
        .then(res => {
            dispatch({
                type: GET_PATIENT_RESERVATIONS,
                payload: res.data
            })
        })
        .catch(res => dispatch({
            type: RESERVATION_FAILED,
            payload: res.data
        }));
}

export const setReservationLoading = () => {
    return {
        type: LOADING_RESERVATION
    }
}