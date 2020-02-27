import React from 'react';
import { Row, Col, Container, Modal, ModalHeader, ModalBody, Input, InputGroup, InputGroupAddon, InputGroupText, Button } from 'reactstrap'
import axios from 'axios'
import { API_ENDPOINT } from '../../../AppConfig'
import strings from '../../../assets/Locals/locals'
import close from '../../../assets/Images/close.png'
import { showSnack } from 'react-redux-snackbar';
import imglist from '../../../assets/Images/Profile/imglist.png'
import { string } from 'prop-types';

class Services_List extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            services: this.props.serviceList,
            filetext: this.props.servicetext,
            servicepdf: null,
            data: null,
            servicePdfName: `pdf`,
            servicePdfPreviews: this.props.servicepdf?`${ API_ENDPOINT}${this.props.servicepdf}`:null,
        }
    }
    removeservice = (i) => {
        let object = this.state.services
        var removed = object.splice(i, 1)
        this.setState({ services: object })
        this.props.handleService("list", object)
    }
    addserviceImage = (e, index) => {
        let object = this.state.services
        let reader = new FileReader();
        let file = e.target.files[0];
        reader.onloadend = () => {
            object[index].image = reader.result
            object[index].imageFile = file
            this.setState({
                file: file,
                serviceImage: file.name,
                imagePreviewservice: reader.result,
                services: object
            });
            this.props.handleService("list", object)

        }
        if (file) {
            reader.readAsDataURL(file)
        }
        if( object[index].text){
            this.props.handleService("error", false)
        }else{
            this.props.handleService("error", true)
        }
    }
    addservicePdf = (e) => {
        let reader = new FileReader();
        let file = e.target.files[0];
        reader.onloadend = () => {
            this.setState({
                servicepdf: file,
                servicePdfName: file.name,
                servicePdfPreviews: reader.result,
            });
            this.props.handleService("pdf", file)

        }
        if (file) {
            reader.readAsDataURL(file)
        }

        if(this.state.filetext){
            this.props.handleService("error", false)
        }else{
            this.props.handleService("error", true)
        }
    }
    addService = e => {
        let services = this.state.services
        console.log("services data", services)
        let object = { text: ``, image: null, imageFile: null }
        console.log("services data", object)
        services.push(object)
        this.setState({ services: services })
        this.props.handleService("list", services)
        this.props.handleService("error", true)

    }
    serviceText(e, i) {
        let object = this.state.services
        object[i].text = e.target.value
        this.setState({ services: object })
        this.props.handleService("list", object)
        if(object[i].image&&e.target.value!==""){
            this.props.handleService("error", false)
        }else{
            this.props.handleService("error", true)
        }
    }
    removeservicePDF(){
        let file = null;
            this.setState({
                servicepdf: null,
                servicePdfName: `pdf`,
                servicePdfPreviews: null,
            });
            this.props.handleService("pdf", file)
            console.log("file text",this.state.filetext)
            if(this.state.filetext){
                this.props.handleService("error", true)
            }else{
                this.props.handleService("error", false)
            }
    }
    render() {
        let name = this.props.title
        let pdf=this.props.servicepdf
        let pdfName=this.props.servicePdfName
        let FileText=this.props.filetext
        if(!this.state.servicepdf &&pdf){
            this.setState({servicePdfName:this.props.servicePdfName,servicepdf:this.props.servicepdf,filetext:this.props.servicetext})
        }
        return (
            <div>
                <div className="profcardthree-listservices mt-3">
                    <h5>{name} <i onClick={this.addService} style={{ cursor: "pointer", margin: this.props.appLanguage === "en" ? "0 0 0 auto" : "0 auto 0 0" }} className="fa fa-plus"></i> </h5>
                    <Container>
                        {console.log("all services", this.state.services)}
                        {this.state.services.map((element, index) => {
                            return (
                                <Row className="mb-3">
                                    <Col lg="2" md="2" sm="2" xs="2" className="px-0">
                                        {!this.state.create && element.image ?
                                            <div className="text-center" style={{ position: "relative" }}>
                                                <img src={element.imageFile ? element.image : `${API_ENDPOINT}${element.image}`} width="75" />
                                            </div>
                                            :
                                            <div className="stylespecialfileinput-uploadPDF">
                                                <label style={{ textAlign: this.props.appLanguage === "ar" ? "right" : "left" }} className="custom-file-upload mb-2">
                                                    <img src={imglist} alt="imglist" />
                                                    {element.text &&<span style={{color:"red",fontSize:"0.9rem"}}>{strings.imageError}</span>} 
                                                </label>
                                               
                                                <input type="file" onChange={(event) => this.addserviceImage(event, index)} />
                                            </div>
                                        }
                                    </Col>
                                    <Col lg="9" md="9" sm="9" xs="9" className="px-2">
                                        <textarea onChange={(e) => this.serviceText(e, index)} placeholder={strings.imgdesc} value={element.text}></textarea>
                                        {element.image&&!element.text &&<span style={{color:"red",fontSize:"0.9rem"}}>{strings.textError}</span>} 
                                    </Col>
                                    <Col lg="1" md="1" sm="1" xs="1" className="text-center pt-3">
                                        <i onClick={() => this.removeservice(index)} style={{ color: "red", top: "5px", cursor: "pointer" }} className="fa fa-trash"></i>
                                    </Col>

                                </Row>
                            )
                        })}

                    </Container>
                </div>

                <div className="stylefileinput-uploadPDF">
                {console.log("service take place",this.state.servicePdfName,this.state.servicepdf,this.state.filetext)}

                    {this.state.servicePdfName==="pdf"&& !this.state.servicepdf ?
                        <div>
                            <label className="custom-file-upload mb-2">
                                <i className="fa fa-upload"></i>  {strings.uploadPDF} PDF
                            </label>
                            <input type="file" onChange={(e) => this.addservicePdf(e)} />
                        </div> :  
                        <div>
                             <label className="custom-file-upload mb-2">
                             <i onClick={() => this.removeservicePDF()}className="fa fa-times" style={{position:"absolute", color: "red", top: "25px", cursor: "pointer" }}></i>
                               <a href={this.state.servicePdfPreviews} target="_blank" className="mx-4">{this.state.servicePdfName}</a>  
                            </label>

                        </div>  
                }
                 {this.state.filetext&&this.state.servicePdfName==="pdf" &&<span style={{color:"red",fontSize:"0.9rem"}}>{strings.pdfError}</span>} 
                     {console.log("error====>",!this.state.filetext,this.state.servicePdfName===`pdf`)}
                     {console.log("error response====>",this.state.servicePdfName===`pdf`?this.state.filetext?true:false:false)}
                    <div>
                        <textarea value={this.state.filetext} placeholder={strings.textdesc} onChange={e =>{
                             this.props.handleService("filetext",  e.target.value)
                             this.setState({ filetext: e.target.value },()=>{
                                this.props.handleService("error",this.state.servicePdfName===`pdf`?this.state.filetext?true:false:false)
                             })
                        }}></textarea>
                    </div>
                {!this.state.filetext&&this.state.servicePdfName!=="pdf" &&<span style={{color:"red",fontSize:"0.9rem"}}>{strings.FiletextError}</span>} 

                </div>
            </div>
        )
    }
}


export default (Services_List);