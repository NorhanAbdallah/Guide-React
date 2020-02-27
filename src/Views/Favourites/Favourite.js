import React from "react";
// import { Col, Row, Button, Container } from 'reactstrap';

export default class Favourit extends React.Component
{
    constructor()
    {
        super()
        this.state=
            {
            name : "this is the state.name of the Component " ,

        }
    }
    render()
    {
        return (
            <div>
                {this.state.name}
            </div>

        )
    }
}