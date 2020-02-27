import React from 'react';
import { Row, Col, Container, Modal, ModalHeader, ModalBody, Input, InputGroup, InputGroupAddon, InputGroupText, Button } from 'reactstrap'
import axios from 'axios'
import { API_ENDPOINT } from '../../../AppConfig'
import strings from '../../../assets/Locals/locals'
import close from '../../../assets/Images/close.png'
import { showSnack } from 'react-redux-snackbar';
import imglist from '../../../assets/Images/Profile/imglist.png'
import { string } from 'prop-types';

class Foods_List extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            foods: this.props.menuList,
            foodfiletext: this.props.menutext,
            foodpdf: null,
            data: null,
            foodPdfName: `pdf`,
            foodPdfPreviews: this.props.foodpdf?`${ API_ENDPOINT}${this.props.foodpdf}`:null,
        }
    }
    removefood = (i) => {
        let object = this.state.foods
        var removed = object.splice(i, 1)
        this.setState({ foods: object })
        this.props.handleFoods("list", object)
    }
    addfoodImage = (e, index) => {
        let object = this.state.foods
        let reader = new FileReader();
        let file = e.target.files[0];
        reader.onloadend = () => {
            object[index].image = reader.result
            object[index].imageFile = file
            this.setState({
                file: file,
                foodImage: file.name,
                imagePreviewfood: reader.result,
                foods: object
            });
            this.props.handleFoods("list", object)

        }
        if (file) {
            reader.readAsDataURL(file)
        }
        if( object[index].text){
            this.props.handleFoods("error", false)
        }else{
            this.props.handleFoods("error", true)
        }
    }
    addfoodPdf = (e) => {
        let reader = new FileReader();
        let file = e.target.files[0];
        reader.onloadend = () => {
            this.setState({
                foodpdf: file,
                foodPdfName: file.name,
                foodPdfPreviews: reader.result,
            });
            this.props.handleFoods("pdf", file)

        }
        if (file) {
            reader.readAsDataURL(file)
        }

        if(this.state.foodfiletext){
            this.props.handleFoods("error", false)
        }else{
            this.props.handleFoods("error", true)
        }
    }
    addFood = e => {
        let foods = this.state.foods
        console.log("foods data", foods)
        let object = { text: ``, image: null, imageFile: null }
        console.log("foods data", object)
        foods.push(object)
        this.setState({ foods: foods })
        this.props.handleFoods("list", foods)
        this.props.handleFoods("error", true)

    }
    foodText(e, i) {
        let object = this.state.foods
        object[i].text = e.target.value
        this.setState({ foods: object })
        this.props.handleFoods("list", object)
        if(object[i].image&&e.target.value!==""){
            this.props.handleFoods("error", false)
        }else{
            this.props.handleFoods("error", true)
        }
    }
    removefoodPDF(){
        let file = null;
            this.setState({
                foodpdf: null,
                foodPdfName: `pdf`,
                foodPdfPreviews: null,
            });
            this.props.handleFoods("pdf", file)
            if(this.state.filetext){
                this.props.handleFoods("error", true)
            }else{
                this.props.handleFoods("error", false)
            }
    }
    render() {
        let name = this.props.title
        let pdf=this.props.menupdf
        let pdfName=this.props.menuPdfName
        let FileText=this.props.menutext
        console.log("all props food",this.props)
        if(!this.state.foodpdf &&pdf){
            this.setState({foodPdfName:this.props.menuPdfName,foodpdf:this.props.menupdf,foodfiletext:this.props.menutext})
        }
        return (
            <div>
                <div className="profcardthree-listservices mt-3">
                    <h5>{name} <i onClick={this.addFood} style={{ cursor: "pointer", margin: this.props.appLanguage === "en" ? "0 0 0 auto" : "0 auto 0 0" }} className="fa fa-plus"></i> </h5>
                    <Container>
                        {console.log("all Foods", this.state.foods)}
                        {this.state.foods.map((element, index) => {
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
                                               
                                                <input type="file" onChange={(event) => this.addfoodImage(event, index)} />
                                            </div>
                                        }
                                    </Col>
                                    <Col lg="9" md="9" sm="9" xs="9" className="px-2">
                                        <textarea onChange={(e) => this.foodText(e, index)} placeholder={strings.imgdesc} value={element.text}></textarea>
                                        {element.image&&!element.text &&<span style={{color:"red",fontSize:"0.9rem"}}>{strings.textError}</span>} 
                                    </Col>
                                    <Col lg="1" md="1" sm="1" xs="1" className="text-center pt-3">
                                        <i onClick={() => this.removefood(index)} style={{ color: "red", top: "5px", cursor: "pointer" }} className="fa fa-trash"></i>
                                    </Col>

                                </Row>
                            )
                        })}

                    </Container>
                </div>

                <div className="stylefileinput-uploadPDF">
                    {console.log("FoodPDF",this.state.foodPdf)}
                    {this.state.foodPdfName==="pdf"&&!this.state.foodpdf ?
                        <div>
                            <label className="custom-file-upload mb-2">
                                <i className="fa fa-upload"></i>  {strings.uploadPDF} PDF
                            </label>
                            <input type="file" onChange={(e) => this.addfoodPdf(e)} />
                        </div> :  
                        <div>
                             <label className="custom-file-upload mb-2">
                             <i onClick={() => this.removefoodPDF()}className="fa fa-times" style={{position:"absolute", color: "red", top: "25px", cursor: "pointer" }}></i>
                               <a href={this.state.foodPdfPreviews} className="mx-4" target="_blank">{this.state.foodPdfName}</a>  
                            </label>

                        </div>  
                }
                 {this.state.foodfiletext&&!this.state.foodPdfName &&<span style={{color:"red",fontSize:"0.9rem"}}>{strings.pdfError}</span>} 

                    <div>
                        <textarea value={this.state.foodfiletext} placeholder={strings.textdesc} onChange={e =>{
                             this.props.handleFoods("filetext",  e.target.value)
                             this.setState({ foodfiletext: e.target.value },()=>{
                                this.props.handleFoods("error",this.state.foodPdfName==="pdf"&&this.state.foodfiletext?false:true)
                             })
                        }}></textarea>
                    </div>
                {!this.state.foodfiletext&&this.state.foodPdfName!==`pdf` &&<span style={{color:"red",fontSize:"0.9rem"}}>{strings.FiletextError}</span>} 

                </div>
            </div>
        )
    }
}


export default (Foods_List);