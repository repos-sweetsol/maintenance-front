import { useState, useEffect } from "react"
import axios from "axios"
import styled from "styled-components"
import "./App.css"
import SweetsolLogo from "./assets/sweetsol_logo.png"


const API_HOST_NAME = "https://sweetsol-api.onrender.com"
// const API_HOST_NAME = "http://localhost:8000"

const BASE_L = [ { name: "-" } ]

const FIELDS = {
    TECH: 0,
    ACT: 1,
    DATE: 2,
    STIME: 3,
    FTIME: 4,
    AREA: 5,
    MACH: 6,
    SYS: 7,
    SUBSYS: 8,
    FAIL: 9,
    DESCR: 10
}


function SpareSelector( props ){
    return(
        <select
            value = { props.getSpare().name }
            onChange = { ( e ) => props.handleSelection( e.target.selectedIndex ) }

            style = {{
                width: "80%"
            }}
        >
            { props.spares.map( ( spare, index ) => (
                <option key = { index } value = { spare.name }>
                    { spare.name }
                </option>
            ))}
        </select>
    )
}


const DatetimeCont = styled.div`
    display: flex;
    justify-content: space-between;

    @media screen and (max-width: 600px) {
        margin-top: 15px;
        flex-direction: column;
    }
`

const UpperLeftSection = styled.div`
    width: 48%;
    height: 100%;

    display: flex;
    flex-direction: column;
    justify-content: space-evenly;

    @media screen and (max-width: 600px) {
        width: 100%;
        margin-bottom: 15px;
    }
`

const UpperRightSection = styled.div`
    width: 48%;

    display: flex;
    flex-direction: column;
    justify-content: space-evenly;

    @media screen and (max-width: 600px) {
        width: 100%
    }
`

const UpperSection = styled.div`
    width: 100%;
    height: 230px;

    display: flex;
    justify-content: space-between;

    @media screen and (max-width: 600px) {
        height: fit-content;
        flex-direction: column;
    }
`

const Main = styled.div`
    width: 800px;

    padding: 0 40px;

    display: flex;
    flex-direction: column;

    @media screen and (max-width: 600px) {
        width: 100vw;
        margin-top: 25px;
    }
`

const Row = styled.div`
    display: flex;
    flex-direction: row;
`

function App(){
    const [ techs, setTechs ] = useState( BASE_L )
    const [ selTech, setSelTech ] = useState( 0 )

    const [ acts, setActs ] = useState( BASE_L )
    const [ selAct, setSelAct ] = useState( 0 )

    const [ selDate, setSelDate ] = useState( "" )
    const [ selStime, setSelStime ] = useState( "" )
    const [ selFtime, setSelFtime ] = useState( "" )

    const [ areas, setAreas ] = useState( BASE_L )
    const [ selArea, setSelArea ] = useState( 0 )

    const [ machs, setMachs ] = useState( BASE_L )
    const [ selMach, setSelMach ] = useState( 0 )

    const [ syss, setSyss ] = useState( BASE_L )
    const [ selSys, setSelSys ] = useState( 0 )

    const [ subsyss, setSubsyss ] = useState( BASE_L )
    const [ selSubsys, setSelSubsys ] = useState( 0 )

    const [ fails, setFails ] = useState( BASE_L )
    const [ selFail, setSelFail ] = useState( 0 )

    const [ descr, setDescr ] = useState( "" )

    const [ spares, setSpares ] = useState( BASE_L )
    const [ selSpares, setSelSpares ] = useState( [] )

    useEffect(
        () => {
            axios.get( `${API_HOST_NAME}/technicians` )
            .then( ( res ) => {
                setTechs( () => ( [ { name: "-" } ].concat( res.data ) ) )
            })

            axios.get( `${API_HOST_NAME}/activities` )
            .then( ( res ) => {
                setActs( () => ( [ { name: "-" } ].concat( res.data ) ) )
            })

            axios.get( `${API_HOST_NAME}/areas` )
            .then( ( res ) => {
                setAreas( () => ( [ { name: "-" } ].concat( res.data ) ) )
            })

            axios.get( `${API_HOST_NAME}/failures` )
            .then( ( res ) => {
                setFails( () => ( [ { name: "-" } ].concat( res.data ) ) )
            })

            axios.get( `${API_HOST_NAME}/spares` )
            .then( ( res ) => {
                setSpares( () => ( [ { name: "-" } ].concat( res.data ) ) )
            })
        },
        []
    )

    const handleSelection = ( sel, e ) => {
        switch( sel ){
            case( FIELDS.TECH ):
                setSelTech( () => ( e.target.selectedIndex ) )
                break
            
            case( FIELDS.ACT ):
                setSelAct( () => ( e.target.selectedIndex ) )
                break
            
            case( FIELDS.DATE ):
                setSelDate( () => ( e.target.value ) )
                break
            
            case( FIELDS.STIME ):
                setSelStime( () => ( e.target.value ) )
                break
            
            case( FIELDS.FTIME ):
                setSelFtime( () => ( e.target.value ) )
                break
            
            case( FIELDS.AREA ):
                setSelArea( () => ( e.target.selectedIndex ) )

                let a = areas[ e.target.selectedIndex ].name
                axios.get( `${API_HOST_NAME}/areas/${a}/machines` )
                .then( ( res ) => {
                    setMachs( () => ( [ { name: "-" } ].concat( res.data ) ) )
                })

                break
            
            case( FIELDS.MACH ):
                setSelMach( () => ( e.target.selectedIndex ) )

                let m = machs[ e.target.selectedIndex ].name
                axios.get( `${API_HOST_NAME}/machines/${m}/systems` )
                .then( ( res ) => {
                    setSyss( () => ( [ { name: "-" } ].concat( res.data ) ) )
                })

                break
            
            case( FIELDS.SYS ):
                setSelSys( () => ( e.target.selectedIndex ) )

                let s = syss[ e.target.selectedIndex ].name
                axios.get( `${API_HOST_NAME}/systems/${s}/subsystems` )
                .then( ( res ) => {
                    setSubsyss( () => ( [ { name: "-" } ].concat( res.data ) ) )
                })

                break
            
            case( FIELDS.SUBSYS ):
                setSelSubsys( () => ( e.target.selectedIndex ) )
                break
            
            case( FIELDS.FAIL ):
                setSelFail( () => ( e.target.selectedIndex ) )
                break
            
            case( FIELDS.DESCR ):
                setDescr( () => ( e.target.value ) )
        }
    }

    const handlePopSpare = () => {
        if( selSpares.length > 0 ){
            setSelSpares( ( prev ) => prev.slice( 0, prev.length - 1 ) )
        }
    }

    const handleAppendSpare = () => {
        setSelSpares( ( prev ) => prev.concat( { sel: 0, quantity: 0 } ) )
    }

    const handleClear = () => {
        setSelTech( 0 )
        setSelAct( 0 )
        setSelDate( "" )
        setSelStime( "" )
        setSelFtime( "" )
        setSelArea( 0 )
        setSelMach( 0 )
        setSelSys( 0 )
        setSelSubsys( 0 )
        setSelFail( 0 )
        setDescr( "" )
        setSelSpares( "" )
    }

    const handleSubmit = ( e ) => {
        let form = {}

        if( selTech === 0 ){
            alert( "Por favor seleccione el nombre del tecnico..." )
            return
        }
        else{
            form.technician = techs[ selTech ].id
        }

        if( selAct === 0 ){
            alert( "Por favor seleccione el tipo de actividad..." )
            return
        }
        else{
            form.activity = acts[ selAct ].name
        }

        if( selDate === "" || selStime === "" || selFtime === "" ){
            alert( "Por favor seleccione la fecha, hora de inicio y hora de finalizacion de la actividad..." )
            return
        }
        else{
            form.date = selDate
            form.stime = selStime
            form.ftime = selFtime
        }

        if( descr === "" ){
            alert( "Por favor proporcione una descripcion..." )
            return
        }
        else{
            form.description = descr
        }

        if( acts[ selAct ] !== "Capacitaciones" && acts[ selAct ] !== "Incapacidades" ){
            if( selArea === 0 || selMach === 0 ){
                alert( "Por favor seleccione tanto un area como una maquina..." )
                return
            }
            else{
                form.area = areas[ selArea ].name
                form.machine = machs[ selMach ].name
                form.system = syss[ selSys ].name
                form.subsystem = subsyss[ selSubsys ].name
            }
        }

        form.failure = "-"
        if( acts[ selAct ].name === "Mantenimiento correctivo" ){
            if( selFail === 0 ){
                alert( "Por favor seleccione un tipo de falla..." )
                return
            }
            else{
                form.failure = fails[ selFail ].name
            }
        }

        let sps = []
        selSpares.forEach( ( e ) => {
            sps.push( { name: spares[ e.sel ].name, quantity: e.quantity } )
        })

        form.spares = sps

        axios.post( `${API_HOST_NAME}/forms`, form )
        .then( ( res ) => {
            if( res.status == 200 ){
                handleClear()
                alert( "Formulario enviado..." )
            }
        })
    }

    return(
        <Main>
            <img
                className = "resp-img"
                src = { SweetsolLogo }
            />
            <UpperSection>
                <UpperLeftSection>
                    <Field>
                        <FieldTitle>Tecnico</FieldTitle>
                        <select
                            value = { techs[ selTech ].name }
                            onChange = { ( e ) => handleSelection( FIELDS.TECH, e ) }
                        >
                            { techs.map( ( tech, index ) => (
                                <option key = { index } value = { tech.name }>
                                    { tech.name }
                                </option>
                            ))}
                        </select>
                    </Field>
                    <Field>
                        <FieldTitle>Tipo de actividad</FieldTitle>
                        <select
                            value = { acts[ selAct ].name }
                            onChange = { ( e ) => handleSelection( FIELDS.ACT, e ) }
                        >
                            { acts.map( ( acts, index ) => (
                                <option key = { index } value = { acts.name }>
                                    { acts.name }
                                </option>
                            ))}
                        </select>
                    </Field>
                    <DatetimeCont>
                        <Field>
                            <FieldTitle>Fecha</FieldTitle>
                            <input
                                type = "date"
                                id = "date"
                                name = "date"

                                onChange = { ( e ) => handleSelection( FIELDS.DATE, e ) }

                                style = {{
                                    width: "120px"
                                }}
                            />
                        </Field>
                        <Field>
                            <FieldTitle>Hora inicio</FieldTitle>
                            <input
                                type = "time"
                                id = "stime"
                                name = "stime"

                                onChange = { ( e ) => handleSelection( FIELDS.STIME, e ) }

                                style = {{
                                    width: "85px"
                                }}
                            />
                        </Field>
                        <Field>
                            <FieldTitle>Hora fin</FieldTitle>
                            <input
                                type = "time"
                                id = "ftime"
                                name = "ftime"

                                onChange = { ( e ) => handleSelection( FIELDS.FTIME, e ) }

                                style = {{
                                    width: "85px"
                                }}
                            />
                        </Field>
                    </DatetimeCont>
                </UpperLeftSection>
                <UpperRightSection>
                    <Field>
                        <FieldTitle>Area</FieldTitle>
                        <select
                            value = { areas[ selArea ].name }
                            onChange = { ( e ) => handleSelection( FIELDS.AREA, e ) }
                        >
                            { areas.map( ( area, index ) => (
                                <option key = { index } value = { area.name }>
                                    { area.name }
                                </option>
                            ))}
                        </select>
                    </Field>
                    <Field>
                        <FieldTitle>Maquina</FieldTitle>
                        <select
                            value = { machs[ selMach ].name }
                            onChange = { ( e ) => handleSelection( FIELDS.MACH, e ) }
                        >
                            { machs.map( ( mach, index ) => (
                                <option key = { index } value = { mach.name }>
                                    { mach.name }
                                </option>
                            ))}
                        </select>
                    </Field>
                    <Field>
                        <FieldTitle>Sistema</FieldTitle>
                        <select
                            value = { syss[ selSys ].name }
                            onChange = { ( e ) => handleSelection( FIELDS.SYS, e ) }
                        >
                            { syss.map( ( sys, index ) => (
                                <option key = { index } value = { sys.name }>
                                    { sys.name }
                                </option>
                            ))}
                        </select>
                    </Field>
                    <Field>
                        <FieldTitle>Subsistema</FieldTitle>
                        <select
                            value = { subsyss[ selSubsys ].name }
                            onChange = { ( e ) => handleSelection( FIELDS.SUBSYS, e ) }
                        >
                            { subsyss.map( ( subsys, index ) => (
                                <option key = { index } value = { subsys.name }>
                                    { subsys.name }
                                </option>
                            ))}
                        </select>
                    </Field>
                </UpperRightSection>
            </UpperSection>
            { acts[ selAct ].name === "Mantenimiento correctivo" &&
            <Field
                style = {{
                    width: "100%",

                    margin: "10px auto"
                }}
            >
                <FieldTitle>Tipo de falla</FieldTitle>
                <select
                    value = { fails[ selFail ].name }
                    onChange = { ( e ) => handleSelection( FIELDS.FAIL, e ) }
                >
                    { fails.map( ( fails, index ) => (
                        <option key = { index } value = { fails.name }>
                            { fails.name }
                        </option>
                    ))}
                </select>
            </Field>}
            { (
                acts[ selAct ].name === "Mantenimiento correctivo" ||
                acts[ selAct ].name === "Mantenimiento preventivo" ||
                acts[ selAct ].name === "Proyectos y mejoras" ||
                acts[ selAct ].name === "Reparaciones locativas"
            ) &&
            <>
                <Field
                    style = {{
                        width: "100%",

                        margin: "10px 0 0 0"
                    }}
                >
                    <FieldTitle>Repuestos</FieldTitle>
                    <div
                        style = {{
                            width: "100%",
                            height: "150px",

                            border: "1px solid black",
                            borderRadius: "5px",

                            overflow: "auto"
                        }}
                    >
                        { selSpares.map( ( _, index ) => (
                            <div
                                key = { index }
                                style = {{
                                    display: "flex",
                                    flexDirection: "row"
                                }}
                            >
                                <input
                                    type = "text"

                                    onChange = { ( e ) => setSelSpares( ( prev ) => {
                                        let aux = prev.slice()
                                        aux[ index ].sel = e.target.value;
                                        return aux
                                    })}

                                    style = {{
                                        width: "80%"
                                    }}
                                />
                                {/* <SpareSelector
                                    spares = { spares }

                                    handleSelection = { ( val ) => setSelSpares( ( prev ) => {
                                        let aux = prev.slice()
                                        aux[ index ].sel = val;
                                        return aux
                                    })}

                                    getSpare = { () => selSpares[ index ].sel }
                                /> */}
                                <input
                                    type = "number"
                                    id = "quant"
                                    name = "quant"

                                    value = { selSpares[ index ].quantity }
                                    
                                    onChange = { ( e ) => setSelSpares( ( prev ) => {
                                        let aux = prev.slice()
                                        if( e.target.value >= 0 ){
                                            aux[ index ].quantity = e.target.value;
                                        }
                                        return aux
                                    })}
        
                                    style = {{
                                        width: "20%"
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </Field>
                <div
                    style = {{
                        width: "100%",

                        margin: "0 auto",
                        marginTop: "5px"
                    }}
                >
                    <button
                        onClick = { handlePopSpare }

                        style = {{
                            "width": "50%"
                        }}
                    >Quitar repuesto</button>
                    <button
                        onClick = { handleAppendSpare }

                        style = {{
                            "width": "50%"
                        }}
                    >Agregar repuesto</button>
                </div>
            </>}
            <Field
                style = {{
                    width: "100%",
                    margin: "20px 0 10px 0"
                }}
            >
                <FieldTitle>Descripcion</FieldTitle>
                <textarea
                    id = "descr"
                    name = "descr"

                    value = { descr }
                    onChange = { ( e ) => handleSelection( FIELDS.DESCR, e ) }

                    style = {{
                        height: "150px",
                        resize: "none"
                    }}
                />
            </Field>
            <div
                style = {{
                    width: "100%",

                    margin: "15px 0",

                    display: "flex",
                    justifyContent: "space-between"
                }}
            >
                <button
                    className = "clear-btn"
                    onClick = { () => handleClear() }

                    style = {{
                        // width: "5%",

                        padding: "0"
                    }}
                >X</button>
                <button
                    className = "submit-btn"
                    onClick = { handleSubmit }

                    // style = {{
                    //     width: "94%",
                    // }}
                >Enviar</button>
            </div>
        </Main>
    )
}

const Field = styled.div`
    margin: 0px 0;

    display: flex;
    flex-direction: column;
    justify-content: right;
`

const FieldTitle = styled.p`
    margin: 0;

    font-size: large;
    font-weight: bold;
    text-align: left;
`

export default App