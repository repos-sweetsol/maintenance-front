import { useState, useEffect } from "react"
import axios from "axios"
import styled from "styled-components"
import "./App.css"


const Card = styled.div`
    overflow: hidden;

    transition: 1s ease;

    &:hover {
        max-height: 450px;

        transition: 1s ease;
    }
`

const FlexRowNoMarPad = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;

    margin: 0;
    padding: 0;
`

const CH1 = styled.h1`
    margin: 0;
    padding: 0;

    text-align: left;
`

const CH2 = styled.h2`
    margin: 0;
    padding: 0;

    text-align: left;
`

const CH3 = styled.h3`
    margin: 5px 0;
    padding: 0;

    text-align: left;
`

function FormCard( props ){
    const form = props.form

    const[ expand, setExpand ] = useState( false )

    const handleContactClick = () => {
        axios.post( `http://localhost:8000/forms/${form.form_id}/contacted/toogle` )
        .then( ( res ) => {
            if( res.status === 200 ){
                let aux = JSON.parse( JSON.stringify( form ) )
                aux.contacted = res.data
                props.updateForm( aux )
            }
        })
    }

    const handleDepositClick = () => {
        axios.post( `http://localhost:8000/forms/${form.form_id}/deposit/toogle` )
        .then( ( res ) => {
            if( res.status === 200 ){
                let aux = JSON.parse( JSON.stringify( form ) )
                aux.made_deposit = res.data
                props.updateForm( aux )
            }
        })
    }

    const followUpProps = () => {
        const fup = form.follow_up_on

        let fupDate = new Date( fup );
        // fupDate += 5 * 60 * 60 * 1000

        let currDate = new Date();
        currDate = currDate - ( currDate.getTime() % 86400000 );

        if( form.form_id === "2" ){
            console.log( form.follow_up_on )
            console.log( fupDate )
            console.log( currDate )
        }

        if( fupDate < currDate ){
            return { date: form.follow_up_on, color: "red" }
        }
        else if( fupDate > currDate ){
            return { date: form.follow_up_on, color: "green" }
        }
        else{
            return { date: "HOY", color: "yellow" }
        }
    }

    return(
        <Card
            onMouseEnter = { () => setExpand( true ) }
            onMouseLeave = { () => setExpand( false ) }

            style = {{
                width: "700px",

                margin: "0 auto",
                marginTop: "25px",
                padding: "15px",

                backgroundColor: "#FAFAFA",
                
                borderRadius: "5px",
                border: "1px solid  #E1E1E1"
            }}
        >
            <div
                style = {{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}
            >
                <div>
                    <CH1
                        style = {{
                            marginBottom: "5px"
                        }}
                    >{ form.client_name }</CH1>
                    <CH2>{ form.filled_on }</CH2>
                </div>
                <div
                    style = {{
                        width: "10px",
                        height: "10px",

                        marginRight: "20px",

                        backgroundColor: followUpProps().color,
                        border: "1px solid #E1E1E1",
                        borderRadius: "50%"
                    }}
                />
            </div>
            <div
                style = {{
                    minHeight: `${ expand ? "10px" : "0px" }`,
                    maxHeight: `${ expand ? "10px" : "0px" }`,
                    transition: "0.5s ease"
                }}
            />
            <div
                style = {{
                    maxHeight: `${ expand ? "300px" : "0px" }`,
                    transition: "max-height 0.5s ease",
                    overflow: "hidden"
                }}
            >
                <div
                    style = {{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}
                >
                    <div>
                        <CH3>Email: <a href = "mailto:fplata@hotmail.com">{ form.client_email }</a></CH3>
                        <CH3>Celular: <a href = { `https://web.whatsapp.com/send?phone=${ form.cty_code + form.phone_num }` }>{ "+" + form.cty_code + " " + form.phone_num }</a></CH3>
                        <FlexRowNoMarPad>
                            <CH3
                                style = {{
                                    paddingRight: "5px"
                                }}
                            >Contacto:</CH3>
                            <img
                                width = "30"
                                height = "30"
                                src = { `https://img.icons8.com/emoji/48/${ form.contacted === "t" ? "check-mark-emoji.png" : "cross-mark-emoji.png" }` }

                                onClick = { handleContactClick }

                                style = {{
                                    cursor: "pointer"
                                }}
                            />
                        </FlexRowNoMarPad>
                        <FlexRowNoMarPad>
                            <CH3
                                style = {{
                                    paddingRight: "5px"
                                }}
                            >Deposito:</CH3>
                            <img
                                width = "30"
                                height = "30"
                                src = { `https://img.icons8.com/emoji/48/${ form.made_deposit === "t" ? "check-mark-emoji.png" : "cross-mark-emoji.png" }` }

                                onClick = { handleDepositClick }

                                style = {{
                                    cursor: "pointer"
                                }}
                            />
                        </FlexRowNoMarPad>
                    </div>
                    <div
                        style = {{
                            marginRight: "110px"
                        }}
                    >
                        <CH2>Seguimiento:</CH2>
                        <CH2
                            style = {{
                                width: "fit-content",

                                margin: "auto",
                                marginTop: "10px",
                                padding: "2px 15px",

                                backgroundColor: followUpProps().color,
                                border: "1px solid #E1E1E1",
                                borderRadius: "10px",

                                textAlign: "center"
                            }}
                        >{ followUpProps().date }</CH2>
                    </div>
                </div>
            </div>
        </Card>
    )
}


function App(){
    const [ forms, setForms ] = useState( [] )
    const [ selForms, setSelForms ] = useState( [] )

    const [ searchName, setSearchName ] = useState( "" )
    const [ cf, setCf ] = useState( [ "t", "f" ] )
    const [ mdf, setMdf ] = useState( [ "t", "f" ] )

    useEffect(
        () => {
            axios.get( "http://localhost:8000/forms" )
            .then( ( res ) => {
                setForms( () => ( res.data ) )
                setSelForms( () => ( res.data ) )
            })
        },
        []
    )

    const filterForms = ( regex, cf, mdf ) => {
        setSelForms( forms.filter( o => {
            return(
                regex.test( o.client_name ) &&
                cf.includes( o.contacted ) &&
                mdf.includes( o.made_deposit )
            )
        }))
    }

    const handleNameChange = ( e ) => {
        const name = e.target.value

        setSearchName( e.target.value )
        filterForms( new RegExp( ".*" + name + ".*", "i" ), cf, mdf )
    }

    const handleContactChange = ( e ) => {
        const i = e.target.selectedIndex

        if( i === 0 ){
            setCf( [ "t", "f" ] )
            filterForms( new RegExp( ".*" + searchName + ".*", "i" ), [ "t", "f" ], mdf )
        }
        else if( i === 1 ){
            setCf( [ "t" ] )
            filterForms( new RegExp( ".*" + searchName + ".*", "i" ), [ "t" ], mdf )
        }
        else if( i === 2 ){
            console.log( "AY" )
            setCf( [ "f" ] )
            filterForms( new RegExp( ".*" + searchName + ".*", "i" ), [ "f" ], mdf )
        }
    }

    const handleDepositChange = ( e ) => {
        const i = e.target.selectedIndex

        if( i === 0 ){
            setMdf( [ "t", "f" ] )
            filterForms( new RegExp( ".*" + searchName + ".*", "i" ), cf, [ "t", "f" ] )
        }
        else if( i === 1 ){
            setMdf( [ "t" ] )
            filterForms( new RegExp( ".*" + searchName + ".*", "i" ), cf, [ "t" ] )
        }
        else if( i === 2 ){
            setMdf( [ "f" ] )
            filterForms( new RegExp( ".*" + searchName + ".*", "i" ), cf, [ "f" ] )
        }
    }

    return(
        <>
            <div
                style = {{
                    display: "flex",
                    flexDirection: "row"
                }}
            >
                <div
                    style = {{
                        width: "30vw",
                        height: "100vh",

                        padding: "50px",

                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        // alignItems: "center",

                        overflow: "hidden",

                        backgroundColor: "#FAFAFA",
                        border: "1px solid  #E1E1E1"
                    }}
                >
                    <CH2>Nombre</CH2>
                    <input
                        type = "text"

                        value = { searchName }

                        onChange = { ( e ) => handleNameChange( e ) }

                        style = {{
                            marginTop: "5px",

                            fontSize: "large"
                        }}
                    />
                    <CH2
                        style = {{
                            marginTop: "20px"
                        }}
                    >Contacto</CH2>
                    <select
                        onChange = { ( e ) => handleContactChange( e ) }

                        style = {{
                            marginTop: "5px",

                            backgroundColor: "white",

                            
                            border: "1px solid  #BBBBBB",
                            borderRadius: "2px",

                            fontSize: "large"
                        }}
                    >
                        <option>Cualquiera</option>
                        <option>YA contactados</option>
                        <option>NO contactados</option>
                    </select>
                    <CH2
                        style = {{
                            marginTop: "20px"
                        }}
                    >Depósito</CH2>
                    <select
                        onChange = { ( e ) => handleDepositChange( e ) }

                        style = {{
                            marginTop: "5px",

                            backgroundColor: "white",

                            
                            border: "1px solid  #BBBBBB",
                            borderRadius: "2px",

                            fontSize: "large"
                        }}
                    >
                        <option>Cualquiera</option>
                        <option>CON deposito</option>
                        <option>SIN deposito</option>
                    </select>
                </div>
                <div
                    style = {{
                        width: "70vw",
                        height: "100vh",

                        paddingBottom: "30px",

                        overflow: "auto",
                    }}
                >
                    { selForms.map( ( f, i ) => (
                        <FormCard
                            key = { f.form_id }
                            form = { f }
                            
                            updateForm = { ( v ) => {
                                const j = forms.findIndex( ( o ) => o.form_id === v.form_id )

                                setForms( ( prev ) => {
                                    let aux = prev.slice()
                                    aux[ j ] = v
                                    return aux
                                })

                                setSelForms( ( prev ) => {
                                    let aux = prev.slice()
                                    aux[ i ] = v
                                    return aux
                                })
                            }}
                        />
                    ))}
                </div>
            </div>
        </>
    )
}

export default App