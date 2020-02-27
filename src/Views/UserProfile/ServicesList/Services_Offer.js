import React from 'react';
import { Row, Col, Container, Modal, ModalHeader, ModalBody, Input, InputGroup, InputGroupAddon, InputGroupText, Button } from 'reactstrap'
import axios from 'axios'
import { API_ENDPOINT } from '../../../AppConfig'
import strings from '../../../assets/Locals/locals'
import close from '../../../assets/Images/close.png'
import { showSnack } from 'react-redux-snackbar';
import imglist from '../../../assets/Images/Profile/imglist.png'
import { string } from 'prop-types';

class Services_Offer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            offers: this.props.offerList,
            offerfiletext: this.props.offertext,
            offerpdf: null,
            data: null,
            offerPdfName: `pdf`,
            offerPdfPreviews: this.props.offerpdf?`${ API_ENDPOINT}${this.props.offerpdf}`:null,
        }
    }
    removeoffer = (i) => {
        let object = this.state.offers
        var removed = object.splice(i, 1)
        this.setState({ offer: object })
        this.props.handleOffers("list", object)
    }
    addofferImage = (e, index) => {
        let object = this.state.offers
        let reader = new FileReader();
        let file = e.target.files[0];
        reader.onloadend = () => {
            object[index].image = reader.result
            object[index].imageFile = file
            this.setState({
                file: file,
                offerImage: file.name,
                imagePreviewoffer: reader.result,
                offers: object
            });
            this.props.handleOffers("list", object)

        }
        if (file) {
            reader.readAsDataURL(file)
        }
        if( object[index].text){
            this.props.handleOffers("error", false)
        }else{
            this.props.handleOffers("error", true)
        }
    }
    addofferPdf = (e) => {
        let reader = new FileReader();
        let file = e.target.files[0];
        reader.onloadend = () => {
            this.setState({
                offerpdf: file,
                offerPdfName: file.name,
                offerPdfPreviews: reader.result,
            });
            this.props.handleOffers("pdf", file)

        }
        if (file) {
            reader.readAsDataURL(file)
        }

        if(this.state.offerfiletext){
            this.props.handleOffers("error", false)
        }else{
            this.props.handleOffers("error", true)
        }
    }
    addOffer = e => {
        let offers = this.state.offers
        console.log("offers data", offers)
        let object = { text: ``, image: null, imageFile: null }
        console.log("offers data", object)
        offers.push(object)
        this.setState({ offers: offers })
        this.props.handleOffers("list", offers)
        this.props.handleOffers("error", true)

    }
    offerText(e, i) {
        let object = this.state.offers
        object[i].text = e.target.value
        this.setState({ offers: object })
        this.props.handleOffers("list", object)
        if(object[i].image&&e.target.value!==""){
            this.props.handleOffers("error", false)
        }else{
            this.props.handleOffers("error", true)
        }
    }
    removeofferPDF(){
        let file = null;
            this.setState({
                offerpdf: null,
                offerPdfName: `pdf`,
                offerPdfPreviews: null,
            });
            this.props.handleOffers("pdf", file)
            if(this.state.filetext){
                this.props.handleOffers("error", true)
            }else{
                this.props.handleOffers("error", false)
            }
    }
    render() {
        let name = this.props.title
        let pdf=this.props.offerpdf
        let pdfName=this.props.offerPdfName
        let FileText=this.props.offertext
        console.log("all props",this.props)
        if(!this.state.offerpdf &&pdf){
            this.setState({offerPdfName:this.props.offerPdfName,offerpdf:this.props.offerpdf,offerfiletext:this.props.offertext})
        }
        return (
            <div>
                <div className="profcardthree-listservices mt-3">
                    <h5>{name} <i onClick={this.addOffer} style={{ cursor: "pointer", margin: this.props.appLanguage === "en" ? "0 0 0 auto" : "0 auto 0 0" }} className="fa fa-plus"></i> </h5>
                    <Container>
                        {console.log("all offers", this.state.offers)}
                        {this.state.offers.map((element, index) => {
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
                                               
                                                <input type="file" onChange={(event) => this.addofferImage(event, index)} />
                                            </div>
                                        }
                                    </Col>
                                    <Col lg="9" md="9" sm="9" xs="9" className="px-2">
                                        <textarea onChange={(e) => this.offerText(e, index)} placeholder={strings.imgdesc} value={element.text}></textarea>
                                        {element.image&&!element.text &&<span style={{color:"red",fontSize:"0.9rem"}}>{strings.textError}</span>} 
                                    </Col>
                                    <Col lg="1" md="1" sm="1" xs="1" className="text-center pt-3">
                                        <i onClick={() => this.removeoffer(index)} style={{ color: "red", top: "5px", cursor: "pointer" }} className="fa fa-trash"></i>
                                    </Col>

                                </Row>
                            )
                        })}

                    </Container>
                </div>

                <div className="stylefileinput-uploadPDF">
                    {this.state.offerPdfName==="pdf" && !this.state.offerpdf?
                        <div>
                            <label className="custom-file-upload mb-2">
                                <i className="fa fa-upload"></i>  {strings.uploadPDF} PDF
                            </label>
                            <input type="file" onChange={(e) => this.addofferPdf(e)} />
                        </div> :  
                        <div>
                             <label className="custom-file-upload mb-2">
                             <i onClick={() => this.removeofferPDF()}className="fa fa-times" style={{position:"absolute", color: "red", top: "25px", cursor: "pointer" }}></i>
                               <a className="mx-4" target="_blank" href={this.state.offerPdfPreviews}>{this.state.offerPdfName}</a>  
                            </label>

                        </div>  
                }
                 {this.state.offerfiletext&&this.state.offerPdfName===`pdf` &&<span style={{color:"red",fontSize:"0.9rem"}}>{strings.pdfError}</span>} 

                    <div>
                        <textarea value={this.state.offerfiletext} placeholder={strings.textdesc} onChange={e =>{
                             this.props.handleOffers("filetext",  e.target.value)
                             this.setState({ offerfiletext: e.target.value },()=>{
                                this.props.handleOffers("error",this.state.offerPdfName===`pdf`?this.state.offerfiletext?true:false:false)
                             })
                        }}></textarea>
                    </div>
                {!this.state.offerfiletext&&this.state.offerPdfName!=="pdf" &&<span style={{color:"red",fontSize:"0.9rem"}}>{strings.FiletextError}</span>} 

                </div>
            </div>
        )
    }
}


export default (Services_Offer);