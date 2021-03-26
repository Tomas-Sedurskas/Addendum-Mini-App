import React, { useState, useEffect } from 'react'
import { Grid, FlexboxGrid, Row, Col, Button, Calendar, Panel, Divider, Message, RadioGroup, Radio, List } from 'rsuite';
import './reservation.scss';
import { connect } from 'react-redux';
import { addReservation, getReservations, getPatientReservations } from '../Redux/Actions/reservationActions';

const mapStateToProps = state => {
    return {
        reservationReducer: state.reservationReducer
    }
}

const mapDispatchToProps = dispatch => {
    return {
        addReservation: (newReservation) => dispatch(addReservation(newReservation)),
        getReservations: (date) => dispatch(getReservations(date)),
        getPatientReservations: (patient) => dispatch(getPatientReservations(patient))
    }
}

function Reservation(props) {

    const [ form, setForm ] = useState({
        firstName: 'empty',
        lastName: 'empty',
        date: new Date(),
        time: 'empty'
    });
    const [ match, setMatch ] = useState([]);
    const [ availableTimes ] = useState(['09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00'])
    const [ reservationCreated, setReservationCreated ] = useState(false);
    const [ errors, setErrors ] = useState([]);

    const handleInput = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
        
    }

    const handleCalendar = (e) => {
        props.getReservations(e)
        
        setForm({
            ...form,
            date: e
        })
    }
    const handleTime = (e) => {
        setForm({
            ...form,
            time: e
        });
    }

    const findErrors = () => {
        var errorsArr = [];
        var currentReservationWeek = getWeekNumber(new Date(form.date));

        if(form.firstName === '') errorsArr.push("Pamiršote įvesti vardą. ");
        if(form.lastName === '') errorsArr.push("Pamiršote įvesti pavardę. ");
        if(form.time === '') errorsArr.push("Pamiršote pasirinkiti laiką. ");
        props.reservationReducer.patientReservations.forEach(reservation => {
            if(getWeekNumber(new Date(reservation.date)) === currentReservationWeek){ 
                errorsArr.push("Galite turėti tik vieną rezervaciją per savaitę. ")
            }
        })
        setErrors(errorsArr);
        return errorsArr;
    }
    
    const handleSubmit = () => {
        if(findErrors().length == 0){
            props.addReservation(form);
            setReservationCreated(true);
        }
    }

    const checkPatient = () => {
        var availabilityMatch = props.reservationReducer.patientReservations.filter(reservation => reservation.firstName === form.firstName && reservation.lastName === form.lastName)
        if(availabilityMatch.length > 0){
            setMatch(availabilityMatch)
        } else if(match.length !== 0){
            setMatch([])
        }
    }

    function ShowMessage(){
         
        if(match.length > 0){
        let allMesssages = []
        for(let i=0; i<match.length; i++){
            let message = ` ${match[i].firstName} ${match[i].lastName} - ${match[i].date.split('T')[0]} (${match[i].time}) | `;
            allMesssages.push(message);
            console.log(message)
        }
        console.log(allMesssages)
        
        return <Message className="remove-animation" type="success" title="Jūsų rezervacijos" description={allMesssages}/>  
        } else {
            return <Message className="remove-animation" type="info" title="Rezervacijų šiuo vardu nerasta" description="Pasirinkite datą ir laiką puslapio apačioje." />
        }
        
    }

    function ReservationCreated(){
        if(reservationCreated && errors.length === 0){
            return <Message className="remove-animation" type="success" title="Rezervacija sėkmingai sukurta." description="Lauksime jūsų."/>
        } else {
            return null
        }
    }

    function ReservationErrors(){
        if(errors.length > 0){
            let text = errors.map(error => {

                })
            
            return(
                <Message className="remove-animation" type="error" title="Rezervacijos napavyko sukurti..." description={errors}/>
            )
        } else {
            return null
        }
            
    }

    const removeMessage = () => {
        setReservationCreated(false)
    }

    function getWeekNumber(d) {
    // This week finding code is from here: 
    //https://stackoverflow.com/questions/6117814/get-week-of-year-in-javascript-like-in-php

    // Copy date so don't modify original
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
    // Get first day of year
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    // Calculate full weeks to nearest Thursday
    var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
    // Return array of year and week number
    return weekNo;
}

    useEffect(() => {        
        props.getReservations(new Date())
    },[])

    useEffect(() => {   
        let patient = {firstName: form.firstName, lastName: form.lastName}
        props.getPatientReservations(patient)
        findErrors();
        if(reservationCreated){
            removeMessage()
        }
    },[form])

    

    return (
        <Grid fluid className="container">
            <Row gutter={16}>
                <Col sm={24}>
                    <h2 className="reservation__title" >Gydytojo rezervacija</h2>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col md={6} sm={12}>
                    <input onChange={handleInput} name="firstName" placeholder="Vardas" className="reservation__input"/>
                </Col>
                <Col md={6} sm={12}>
                    <input onChange={handleInput} name="lastName" placeholder="Pavardė" className="reservation__input"/>
                </Col>
                <Col md={6} sm={24}>
                    <Button block className="reservation__button" onClick={checkPatient}>Ar turiu rezervacijų šiuo vardu?</Button>
                </Col>
                <Col sm={24}>
                    <ShowMessage  />
                    
                    
                </Col>
            </Row> 

            <Divider /> 
            
            <FlexboxGrid className="align-item-stretch">
                <FlexboxGrid.Item  componentClass={Col} colspan={24} md={16} >
                    <Panel bordered className="reservation__panel__guttered">
                        <Calendar isoWeek onChange={handleCalendar} />
                    </Panel>
                </FlexboxGrid.Item>
                <FlexboxGrid.Item componentClass={Col} colspan={24} md={8}>
                    <Panel bordered className="reservation__panel">
                        <Row>
                            <Col sm={24}> 
                                <h4 className="timepicker__title">Pasirinktos dienos grafikas</h4>
                                <p className="timepicker__main-text">
                                    Pasirinkite jums patogų laiką.<br></br>
                                    Jei nerandate patogaus laiko, pasirinkitę kitą dieną.<br></br>
                                    
                                </p>
                                <p className="timepicker__main-text">
                                    <i>Pacientas gali turėti tik vieną rezervaciją per savaitę.</i>
                                </p>
                            </Col>
                        </Row>
                        <Row>
                        <Col sm={12}>
                            <h6 className="timepicker__title">Laisva</h6>
                            <RadioGroup name="time" onChange={handleTime}>
                               {
                                    availableTimes.map((time) => {
                                        if(props.reservationReducer.reservations.filter(reservation => reservation.time === time).length > 0){
                                            return null
                                        } else {
                                            return <Radio key={time} value={time}>{time}</Radio>
                                        }
                                    })
                                }            
                            </RadioGroup>
                        </Col>
                        <Col sm={12}>
                            <h6 className="timepicker__title">Užimta</h6>
                            <RadioGroup>
                                {
                                    props.reservationReducer.reservations.map((reservation) => {
                                        return <Radio key={reservation.time} value={reservation.time} disabled>{reservation.time}</Radio>
                                    })
                                }
                            </RadioGroup>
                        </Col>
                    </Row>
                    <Divider></Divider>
                    <Row className="align-self-bottom">
                        <Col sm={24}>
                            <h4 className="endcard__title">Patvirtinkite rezervaciją</h4>
                            <List className="endcard__list">
                                <List.Item key="1" ><b>Vardas:</b> {form.firstName} {form.lastName}</List.Item>
                                <List.Item key="2" ><b>Data:</b> {form.date.toISOString().split('T')[0]}</List.Item>
                                <List.Item key="3" ><b>Laikas:</b> {form.time}</List.Item>
                            </List>
                            <Button onClick={handleSubmit} appearance='primary' block >Rezervuoti</Button>
                        </Col>
                    </Row>
                    </Panel>
                </FlexboxGrid.Item>
            </FlexboxGrid>
            <Row >
                <Col sm={24}>
                    <ReservationCreated />
                    <ReservationErrors />
                </Col>
            </Row>
            <Row >
                <Col className="footer" sm={24} align="middle">
                    <h6>Made by Tomas Šedurskas - March 2021</h6>
                </Col>
            </Row>
        </Grid>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(Reservation)