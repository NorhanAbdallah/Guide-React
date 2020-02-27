import React from 'react';
import { Row, Col, Container, Modal, ModalHeader, ModalBody, Input, InputGroup, InputGroupAddon, InputGroupText, Button } from 'reactstrap'
import axios from 'axios'
import { API_ENDPOINT } from '../../../AppConfig'
import strings from '../../../assets/Locals/locals'
import close from '../../../assets/Images/close.png'
import { showSnack } from 'react-redux-snackbar';
import imglist from '../../../assets/Images/Profile/imglist.png'
import { string } from 'prop-types';

class Products_List extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            products: this.props.productList,
            productfiletext: null,
            productpdf: null,
            data: null,
            productPdfName: 'pdf',
            productPdfPreviews: this.props.productpdf?`${ API_ENDPOINT}${this.props.productpdf}`:null,
        }

    }
    removeproduct = (i) => {
        let object = this.state.products
        var removed = object.splice(i, 1)
        this.setState({ products: object })
        this.props.handleProducts("list", object)
    }
    addproductImage = (e, index) => {
        let object = this.state.products
        let reader = new FileReader();
        let file = e.target.files[0];
        reader.onloadend = () => {
            object[index].image = reader.result
            object[index].imageFile = file
            this.setState({
                file: file,
                productImage: file.name,
                imagePreviewproduct: reader.result,
                products: object
            });
            this.props.handleProducts("list", object)

        }
        if (file) {
            reader.readAsDataURL(file)
        }
        if( object[index].text){
            this.props.handleProducts("error", false)
        }else{
            this.props.handleProducts("error", true)
        }
    }
    addproductPdf = (e) => {
        let reader = new FileReader();
        let file = e.target.files[0];
        reader.onloadend = () => {
            this.setState({
                productpdf: file,
                productPdfName: file.name,
                productPdfPreviews: reader.result,
            },(()=>{
                console.log("productPdfName : ",this.state.productPdfName)
            }));
            this.props.handleProducts("pdf", file)

        }
        if (file) {
            reader.readAsDataURL(file)
        }

        if(this.state.productfiletext){
            this.props.handleProducts("error", false)
        }else{
            this.props.handleProducts("error", true)
        }
    }
    addProduct = e => {
        let products = this.state.products
        console.log("products data", products)
        let object = { text: ``, image: null, imageFile: null }
        console.log("products data", object)
        products.push(object)
        this.setState({ products: products })
        this.props.handleProducts("list", products)
        this.props.handleProducts("error", true)

    }
    productText(e, i) {
        let object = this.state.products
        object[i].text = e.target.value
        this.setState({ products: object })
        this.props.handleProducts("list", object)
        if(object[i].image&&e.target.value!==""){
            this.props.handleProducts("error", false)
        }else{
            this.props.handleProducts("error", true)
        }
    }
    removeproductPDF(){
        let file = null;
            this.setState({
                productpdf: null,
                productPdfName: 'pdf',
                productPdfPreviews: null,
            },()=>{
                console.log("productPdfName : ",this.state.productPdfName)
            });
            this.props.handleProducts("pdf", file)
            if(this.state.filetext){
                this.props.handleProducts("error", true)
            }else{
                this.props.handleProducts("error", false)
            }
    }
    componentWillMount(){
        let name = this.props.title
        let pdf=this.props.productpdf
        let pdfName=this.props.productPdfName
        let FileText=this.props.productPdfName
        console.log("props take plac",name,pdf,pdfName,)
    }
    render() {
        let name = this.props.title
        let pdf=this.props.productpdf
        let pdfName=this.props.productPdfName
        let FileText=this.props.productfiletext
        console.log("props take plac product render",this.props)
        if(!this.state.productpdf &&pdf){
            this.setState({productPdfName:this.props.productPdfName,productpdf:this.props.productpdf,productfiletext:this.props.producttext})
        }
        console.log("all props in product",this.props)
        console.log("datata ===> ",name,pdf,pdfName,FileText)
        return (
            <div>
                <div className="profcardthree-listservices mt-3">
                    <h5>{name} <i onClick={this.addProduct} style={{ cursor: "pointer", margin: this.props.appLanguage === "en" ? "0 0 0 auto" : "0 auto 0 0" }} className="fa fa-plus"></i> </h5>
                    <Container>
                        {console.log("all products", this.state.products)}
                        {this.state.products.map((element, index) => {
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
                                               
                                                <input type="file" onChange={(event) => this.addproductImage(event, index)} />
                                            </div>
                                        }
                                    </Col>
                                    <Col lg="9" md="9" sm="9" xs="9" className="px-2">
                                        <textarea onChange={(e) => this.productText(e, index)} placeholder={strings.imgdesc} value={element.text}></textarea>
                                        {element.image&&!element.text &&<span style={{color:"red",fontSize:"0.9rem"}}>{strings.textError}</span>} 
                                    </Col>
                                    <Col lg="1" md="1" sm="1" xs="1" className="text-center pt-3">
                                        <i onClick={() => this.removeproduct(index)} style={{ color: "red", top: "5px", cursor: "pointer" }} className="fa fa-trash"></i>
                                    </Col>

                                </Row>
                            )
                        })}

                    </Container>
                </div>

                <div className="stylefileinput-uploadPDF">
                    {console.log("product take place",this.state.productpdfName,this.state.productpdf,!this.state.productpdf &&this.state.productpdf!==undefined)}
                    {this.state.productPdfName==="pdf"&&!this.state.productpdf ?
                        <div>
                            <label className="custom-file-upload mb-2">
                                <i className="fa fa-upload"></i>  {strings.uploadPDF} PDF
                            </label>
                            <input type="file" onChange={(e) => this.addproductPdf(e)} />
                        </div> :  
                        <div>
                             <label className="custom-file-upload mb-2">
                             <i onClick={() => this.removeproductPDF()}className="fa fa-times" style={{position:"absolute", color: "red", top: "25px", cursor: "pointer" }}></i>
                               <a className="mx-4" target="_blank" href={this.state.productPdfPreviews}>{this.state.productPdfName}</a>  
                            </label>

                        </div>  
                }
                  {console.log("products=====>",this.state.productfiletext,"//",this.state.productPdfName!==`pdf`,"//",this.state.productfiletext&&this.state.productPdfName!==`pdf`)}
                 {this.state.productfiletext&&this.state.productPdfName===`pdf` &&<span style={{color:"red",fontSize:"0.9rem"}}>{strings.pdfError}</span>} 

                    <div>
                        <textarea value={this.state.productfiletext} placeholder={strings.textdesc} onChange={e =>{
                             this.props.handleProducts("filetext",  e.target.value)
                             this.setState({ productfiletext: e.target.value },()=>{
                                this.props.handleProducts("error",(this.state.productPdfName===`pdf`?this.state.productfiletext?true:false:false))

                             })
                        }}></textarea>
                    </div>
                {!this.state.productfiletext&&this.state.productPdfName!==`pdf` &&<span style={{color:"red",fontSize:"0.9rem"}}>{strings.FiletextError}</span>} 

                </div>
            </div>
        )
    }
}


export default (Products_List);