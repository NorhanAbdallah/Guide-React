import React from 'react';
import {Container} from "reactstrap";
import DisplayHeader from "./DisplayHeader";
import DisplayingData from "./DisplayingData"
export default function  Favourites (){
        return (
            <Container fluid  className = "Favourites_Container">
                <DisplayHeader/>
                <DisplayingData/>
           </Container>
        )
}