import React from 'react';
import { Row, Col, Container, Modal, ModalHeader, ModalBody, Input, InputGroup, InputGroupAddon, InputGroupText, Button } from 'reactstrap'
import axios from 'axios'
import { API_ENDPOINT } from '../../../AppConfig'
import strings from '../../../assets/Locals/locals'

class Ideas_List extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            ideas: this.props.ideaList,
        }
    }
    removeidea = (i) => {
        let object = this.state.ideas
        var removed = object.splice(i, 1)
        this.setState({ ideas: object })
        this.props.handleIdea("list", object)
    }
    
    addIdea = e => {
        let idea = this.state.ideas
        console.log("idea data", idea)
        let object = { text: ``}
        console.log("idea data", object)
        idea.push(object)
        this.setState({ ideas: idea })
        this.props.handleIdea("list", idea)
        this.props.handleIdea("error", true)
    }
    ideaText(e, i) {
        let object = this.state.ideas
        object[i].text = e.target.value
        this.setState({ ideas: object })
        this.props.handleIdea("list", object)
        this.props.handleIdea("error", true)
        
    }
    
    componentWillMount(){
      
    }
    render() {
        let name = this.props.title
        console.log("all props in product",this.props)
        return (
            <div>
                <div className="profcardthree-listservices mt-3">
                    <h5>{name} <i onClick={this.addIdea} style={{ cursor: "pointer", margin: this.props.appLanguage === "en" ? "0 0 0 auto" : "0 auto 0 0" }} className="fa fa-plus"></i> </h5>
                    <Container>
                        {console.log("all products", this.state.ideas)}
                        {this.state.ideas.map((element, index) => {
                            return (
                                <Row className="mb-3">
                                    <Col lg="11" md="11" sm="11" xs="11" className="px-2">
                                        <textarea onChange={(e) => this.ideaText(e, index)} placeholder={strings.imgdesc} value={element.text}></textarea>
                                        {!element.text &&<span style={{color:"red",fontSize:"0.9rem"}}>{strings.textError}</span>} 
                                    </Col>
                                    <Col lg="1" md="1" sm="1" xs="1" className="text-center pt-3">
                                        <i onClick={() => this.removeidea(index)} style={{ color: "red", top: "5px", cursor: "pointer" }} className="fa fa-trash"></i>
                                    </Col>

                                </Row>
                            )
                        })}

                    </Container>
                </div>
                </div>
        )
    }
}


export default (Ideas_List);