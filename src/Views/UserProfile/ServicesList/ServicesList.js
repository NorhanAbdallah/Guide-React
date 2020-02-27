import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Container, Modal, ModalHeader, ModalBody, Input, InputGroup, InputGroupAddon, InputGroupText, Button } from 'reactstrap'
import axios from 'axios'
import { API_ENDPOINT } from '../../../AppConfig'
import strings from '../../../assets/Locals/locals'
import { saveUser } from "../../../Redux/Action/UserAction";
import { ReIntializeUser } from '../../../Redux/Action/UserAction'
import { bindActionCreators } from 'redux';
import close from '../../../assets/Images/close.png'
import { showSnack } from 'react-redux-snackbar';
import imglist from '../../../assets/Images/Profile/imglist.png'
import Services_List from './Services_List.js';
import Services_Offer from './Services_Offer.js';
import Products_List from './Products_List';
import Food_list from './Food_list';
import { string } from 'prop-types';
import Ideas_List from './Ideas_List';

class ServicesList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            ideaError:false,
            services: [],
            foods: [],
            products: [],
            offers: [],
            modalthree: true,
            check_service: false,
            check_product: false,
            check_offer: false,
            check_idea: false,
            check_food: false,
            filetext: ``,
            create: false,
            servicepdf: null,
            servicepdfName: `pdf`,
            data: null,
            serviceError:false,
            offerpdf:null,
            offerpdfName:`pdf`,
            offerfiletext: ``,
            offerError:false,
            productpdf:null,
            productpdfName:`pdf`,
            productfiletext: ``,
            productError:false,
            foods:[],
            foodpdf:null,
            foodpdfName:`pdf`,
            foodfiletext: ``,
            foodError:false,
            ideas:[],
            menuPdfName:`pdf`

        }
        this.togglethree = this.togglethree.bind(this)
    }
    FetchServices() {
        let uri = `${API_ENDPOINT}/service?user=${this.props.user.id}`
        let token = `Bearer ${this.props.token}`
        axios.get(uri, {
            headers: {
                "Accept-Language": this.props.appLanguage
            }
        })
            .then(response => {
                console.log("response", response.data.data[0], this.state.services)
                this.setState({ data: response.data.data[0] })

                if (response.data.data.length>0) {
                    let service = this.state.services
                    let food=this.state.foods
                    let product=this.state.products
                    let offer=this.state.offers
                    let idea=this.state.ideas
                    if (response.data.data[0].service.length>0) {
                        for (let i = 0; i < response.data.data[0].service.length; i++) {
                            let object = {
                                text: response.data.data[0].service[i].text,
                                image: response.data.data[0].service[i].image,
                                imageFile: null
                            }
                            service.push(object)

                        }
                        this.setState({ services: service,check_service: true })

                    }else{
                        this.setState({
                            services: [{ text: ``, image: null, imageFile: null }],                          
                        })
                    }
                    if (response.data.data[0].servicePdf) {
                        this.setState({
                            filetext: response.data.data[0].serviceText,
                            servicepdf: response.data.data[0].servicePdf,
                            servicepdfName: response.data.data[0].servicePdfName

                        })

                    }
                    if (response.data.data[0].offer.length>0) {
                        for (let i = 0; i < response.data.data[0].offer.length; i++) {
                            let object = {
                                text: response.data.data[0].offer[i].text,
                                image: response.data.data[0].offer[i].image,
                                imageFile: null
                            }
                            offer.push(object)

                        }
                        this.setState({check_offer: true,offers:offer})

                        

                    }else{
                        this.setState({
                            offers: [{ text: ``, image: null, imageFile: null }],                          
                        })
                    }
                    if (response.data.data[0].offerPdf) {
                        this.setState({
                            offerfiletext: response.data.data[0].offerText,
                            offerpdf: response.data.data[0].offerPdf,
                            offerpdfName: response.data.data[0].offerPdfName,
                            check_offer: true,


                        })

                    }
                    if (response.data.data[0].product.length>0) {
                        for (let i = 0; i < response.data.data[0].product.length; i++) {
                            let object = {
                                text: response.data.data[0].product[i].text,
                                image: response.data.data[0].product[i].image,
                                imageFile: null
                            }
                            product.push(object)

                        }
                        this.setState({check_product: true,products:product})


                    }else{
                        console.log("in else product")
                        this.setState({
                            products: [{ text: ``, image: null, imageFile: null }],                          
                        })
                    }
                    if (response.data.data[0].productPdf) {
                        this.setState({
                            productfiletext: response.data.data[0].productText,
                            productpdf: response.data.data[0].productPdf,
                            productpdfName: response.data.data[0].productPdfName,
                            check_product: true,


                        },()=>{
                            console.log("response Take place",this.state.productPdfName,this.state.productpdf)
                        })

                    }
                    if (response.data.data[0].menu.length>0) {
                        console.log("response menu", response.data.data[0], this.state.menu)
                        
                        for (let i = 0; i < response.data.data[0].menu.length; i++) {
                            let object = {
                                text: response.data.data[0].menu[i].text,
                                image: response.data.data[0].menu[i].image,
                                imageFile: null
                            }
                            food.push(object)

                        }
                        this.setState({check_food: true,foods:food})

                    }else{
                        this.setState({
                            foods: [{ text: ``, image: null, imageFile: null }],                          
                        })
                    }
                    if (response.data.data[0].menuPdf) {
                        this.setState({
                            menufiletext: response.data.data[0].menuText,
                            menupdf: response.data.data[0].menuPdf,
                            menupdfName: response.data.data[0].menuPdfName,
                            check_food: true,

                        })

                    }
                    if (response.data.data[0].idea.length>0) {
                        for (let i = 0; i < response.data.data[0].idea.length; i++) {
                            let object = {
                                text: response.data.data[0].idea[i].text,
                            }
                            idea.push(object)

                        }
                        this.setState({check_idea: true,offers:offer})

                        

                    }else{
                        this.setState({
                            ideas: [{ text: `` }],                          
                        })
                    }
                    // this.setState({ services: service,foods:food,products:product,offers:offer, check_service: true })


                } else {
                    this.setState({
                        create: true,
                        services: [{ text: ``, image: null, imageFile: null }],
                        foods: [{ text: ``, image: null, imageFile: null }],
                        products: [{ text: ``, image: null, imageFile: null }],
                        offers: [{ text: ``, image: null, imageFile: null }],
                      
                    })
                }
            })
            .catch(error => {
                console.log("Service error", error)

            })
    }
    componentWillMount() {
        this.FetchServices()
    }

    togglethree() {
        this.setState(prevState => ({
            modalthree: !prevState.modalthree
        }));
        this.props.openModalService()
    }
    // Requests Add New Service / Update Service
    addNewService(data) {
        let uri = `${API_ENDPOINT}/service`
        console.log("add services", uri)
        axios.post(uri, data, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${this.props.token}`,

            }
        })
            .then(response => {
                this.togglethree()
                console.log("add response", response.data)
            }).catch(error => {
                console.log("in error", error)
                console.log("in error", error.response)
            })

    }
    addUpdateService(data, id) {
        let uri = `${API_ENDPOINT}/service/${id}`
        console.log("update services", uri)
        axios.put(uri, data, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${this.props.token}`,
                "Accept-Language":this.props.appLanguage

            }
        })
            .then(response => {
                this.togglethree()
                console.log("update response", response.data)
            }).catch(error => {
                console.log("error take place",error)
                console.log("error take place",error.response)

                if (error.response.status === 422) {
                    error.response.data.errors.map((element, index) => {
                        return (
                            this.props.showSnack('myUniqueId', {
                                label:element.msg,
                                timeout: 7000,
                                button: { label: this.props.appLanguage === 'en' ? 'Error' : ' خطأ' }
                            }))
                    })

                }
                console.log("in error", error)
                console.log("in error", error.response)

            })
    }
    // -----------------------------------------------
    // Check IF any input is Empty
    errorMsg(){
        return (
            this.props.showSnack('myUniqueId', {
                label:strings.errorMesage,
                timeout: 7000,
                button: { label: this.props.appLanguage === 'en' ? 'Error' : ' خطأ' }
            }))
    }
     // Prepare Service List to be either add New One or update Existing one============> only one Fun
    addServices = () => {
        const servicesobj = new FormData();
        let servicetext = []
        let producttext = []
        let offertext=[]
        let foodtext=[]
        let ideatext=[]
        console.log("error mesage take place",this.state.serviceError ,this.state.productError)
        if(this.state.serviceError ||this.state.productError){
            return (
                this.props.showSnack('myUniqueId', {
                    label:strings.errorMesage,
                    timeout: 7000,
                    button: { label: this.props.appLanguage === 'en' ? 'Error' : ' خطأ' }
                }))
        }else{
            // Service List
            for (let i = 0; i < this.state.services.length; i++) {
                console.log("service",this.state.services[i])
                if (this.state.services[i].imageFile) {
                    console.log(" in if service")
                    if(!this.state.services[i].text){
                        return this.errorMsg()
                    }
                    servicesobj.append("serviceImages", this.state.services[i].imageFile)
                    let object = { text: this.state.services[i].text }
                    servicetext.push(object)
                } else if(this.state.services[i].image ) {
                    console.log(" in else if service",this.state.services[i],!this.state.services[i].text)
                    if(!this.state.services[i].text){
                        return this.errorMsg()
                    }
                    let object = { text: this.state.services[i].text, image: this.state.services[i].image }
                    servicetext.push(object)
                }
                // else{
                //     console.log(" in else service")
                //     return this.errorMsg()
                // }
    
            }
            servicesobj.append("service", JSON.stringify(servicetext))
            if (this.state.servicepdf) {
                servicesobj.append("servicePdf", this.state.servicepdf)
                servicesobj.append("serviceText", this.state.filetext)
            }

            // Product List
            for (let i = 0; i < this.state.products.length; i++) {
                if (this.state.products[i].imageFile) {
                    if(!this.state.products[i].text){
                        return this.errorMsg()
                    }
                    servicesobj.append("productImages", this.state.products[i].imageFile)
                    let object = { text: this.state.products[i].text }
                    producttext.push(object)
                } else if(this.state.products[i].image ) {
                    if(!this.state.products[i].text){
                        return this.errorMsg()
                    }
                    let object = { text: this.state.products[i].text, image: this.state.products[i].image }
                    producttext.push(object)
                }
                // else{
                //     return this.errorMsg()
                // }
    
            }
            servicesobj.append("product", JSON.stringify(producttext))
            if (this.state.productpdf) {
                servicesobj.append("productPdf", this.state.productpdf)
                servicesobj.append("productText", this.state.productfiletext)
            }
            // Offer List
            for (let i = 0; i < this.state.offers.length; i++) {
                if (this.state.offers[i].imageFile) {
                    if(!this.state.offers[i].text){
                        return this.errorMsg()
                    }
                    servicesobj.append("offerImages", this.state.offers[i].imageFile)
                    let object = { text: this.state.offers[i].text }
                    offertext.push(object)
                } else if(this.state.offers[i].image ) {
                    if(!this.state.offers[i].text){
                        return this.errorMsg()
                    }
                    let object = { text: this.state.offers[i].text, image: this.state.offers[i].image }
                    offertext.push(object)
                }
                // else{
                //     return this.errorMsg()
                // }
    
            }
            servicesobj.append("offer", JSON.stringify(offertext))
            if (this.state.offerpdf) {
                servicesobj.append("offerPdf", this.state.offerpdf)
                servicesobj.append("offerText", this.state.offerfiletext)
            }
            // Foods List
            for (let i = 0; i < this.state.foods.length; i++) {
                if (this.state.foods[i].imageFile) {
                    if(!this.state.foods[i].text){
                        return this.errorMsg()
                    }
                    servicesobj.append("menuImages", this.state.foods[i].imageFile)
                    let object = { text: this.state.foods[i].text }
                    foodtext.push(object)
                } else if(this.state.foods[i].image ) {
                    if(!this.state.foods[i].text){
                        return this.errorMsg()
                    }
                    let object = { text: this.state.foods[i].text, image: this.state.foods[i].image }
                    foodtext.push(object)
                }
                // else{
                //     return this.errorMsg()
                // }
    
            }
            servicesobj.append("menu", JSON.stringify(foodtext))
            if (this.state.foodpdf) {
                servicesobj.append("menuPdf", this.state.foodpdf)
                servicesobj.append("menuText", this.state.foodfiletext)
            }
            // Idea
            for (let i = 0; i < this.state.ideas.length; i++) {
                    if(!this.state.ideas[i].text){
                        // return this.errorMsg()
                    }else{
                        let object = { text: this.state.ideas[i].text }
                        ideatext.push(object)
                    }  
                }
            servicesobj.append("idea", JSON.stringify(ideatext))
   
            for (var pair of servicesobj.entries()) {
                console.log("RESULT FORM DATA OBJECT services:", pair[0] + ', ' + pair[1]);
            }
            if (this.state.create) {
                this.addNewService(servicesobj)
            } else {
                this.addUpdateService(servicesobj, this.state.data.id)
            }
    
        }
        
    }
    // Handle Service List ============> Left up state to get text,image,pdf,fileText
    handleService = (type, object) => {
         console.log("handle handleService :",type,object)
        if (type === "list") {
            this.setState({ services: object })
        } else if (type === "pdf") {
            this.setState({ servicepdf: object })
        } else if (type === "error") {
            this.setState({ serviceError: object })
        }else {
            this.setState({ filetext: object })
        }

    }
    handleIdea = (type, object) => {
        if (type === "list") {
            this.setState({ ideas: object })
        }
        else if (type === "error") {
            this.setState({ ideaError: object })}
    }
    handleOffers = (type, object) => {
        console.log("handle offer :",type,object)

        if (type === "list") {
            this.setState({ offers: object })
        } else if (type === "pdf") {
            this.setState({ offerpdf: object })
        } else if (type === "error") {
            this.setState({ offerError: object })
        }else {
            this.setState({ offerfiletext: object })
        }

    }
    handleProducts = (type, object) => {
        console.log("handle product :",type,object)
        if (type === "list") {
            this.setState({ products: object })
        } else if (type === "pdf") {
            this.setState({ productpdf: object })
        } else if (type === "error") {
            this.setState({ productError: object })
        }else {
            this.setState({ productfiletext: object })
        }

    }
    handleFoods = (type, object) => {
        console.log("handle Foods :",type,object)
        if (type === "list") {
            this.setState({ foods: object })
        } else if (type === "pdf") {
            this.setState({ foodpdf: object })
        } else if (type === "error") {
            this.setState({ foodError: object })
        }else {
            this.setState({ foodfiletext: object })
        }

    }
    setDefaultService(){
       console.log("set Default Service")
       if(!this.state.check_service){
         this.setState({
            services: [{ text: ``, image: null, imageFile: null }],
           servicePdfName:`pdf`,
           servicepdf:null,
           filetext:null
         })
       }
    }
    setDefaultIdea(){
        console.log("set Default Idea")
        if(!this.state.check_idea){
            this.setState({
                ideas: [{ text: ``}],
             })
           
        }

    }
    setDefaultProduct(){
        console.log("set Default Product")
        if(!this.state.check_product){
            this.setState({
                products: [{ text: ``, image: null, imageFile: null }],
                productPdf:null,
                productPdfName:`pdf`,
                productfiletext:null
             })
        }
    }
    setDefaultFood(){
        console.log("set Default Food")
        if(!this.state.check_food){
            this.setState({
                foods: [{ text: ``, image: null, imageFile: null }],
                foodfiletext:null,
                foodpdfName:`pdf`,
                foodpdf:null
             })
        }


    }
    setDefaultOffer(){
        console.log("set Default Offer")
        if(!this.state.check_offer){
            this.setState({
                offers: [{ text: ``, image: null, imageFile: null }],
                offerPdfName:'pdf',
                offerpdf:null,
                offerfiletext:null,
             })
        }

    }
    render() {
        return (
            <div>
                <Modal className="profileModal profileModal-styleprofcardthree" style={{ direction: this.props.appLanguage === "ar" ? "rtl" : "ltr" }} isOpen={this.state.modalthree} toggle={this.togglethree}>
                    <ModalHeader className={this.props.appLanguage === "ar" ? "pb-0 modalheaderar" : "pb-0 modalheaderen"} toggle={this.togglethree}>
                        {strings.profcardthree}
                        <img src={close} alt="close" className="closeModal" onClick={this.togglethree} />
                    </ModalHeader>
                    <ModalBody>
                        <div className="profcardthree">
                            <h5>{strings.servicesprovided}</h5>
                            <div className="profcardthree-checkboxes">
                                <Container>
                                    <Row>
                                        <Col xl="4" lg="4" md="6" sm="12" xs="12">
                                            <InputGroup>
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText>
                                                        <Input checked={this.state.check_service ? true : false} onClick={() => this.setState({ check_service: !this.state.check_service },()=>{
                                                             this.setDefaultService()
                                                        })} addon type="checkbox" aria-label="Checkbox for following text input" />
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                                <label>{strings.servicescheckone}</label>
                                            </InputGroup>
                                        </Col>
                                        <Col xl="4" lg="4" md="6" sm="12" xs="12">
                                            <InputGroup>
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText>
                                                        <Input  checked={this.state.check_idea ? true : false} onClick={() => this.setState({ check_idea: !this.state.check_idea },()=>{
                                                            this.setDefaultIdea()
                                                        })} addon type="checkbox" aria-label="Checkbox for following text input" />
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                                <label>{strings.serviceschecktwo}</label>
                                            </InputGroup>
                                        </Col>
                                        <Col xl="4" lg="4" md="6" sm="12" xs="12">
                                            <InputGroup>
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText>
                                                        <Input checked={this.state.check_product ? true : false} onClick={() => this.setState({ check_product: !this.state.check_product },()=>{
                                                             this.setDefaultProduct()
                                                        })} addon type="checkbox" aria-label="Checkbox for following text input" />
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                                <label>{strings.servicescheckthree}</label>
                                            </InputGroup>
                                        </Col>
                                        <Col xl="4" lg="4" md="6" sm="12" xs="12">
                                            <InputGroup>
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText>
                                                        <Input checked={this.state.check_offer ? true : false} onClick={() => this.setState({ check_offer: !this.state.check_offer },()=>{
                                                                this.setDefaultOffer()
                                                        })} addon type="checkbox" aria-label="Checkbox for following text input" />
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                                <label>{strings.servicescheckfour}</label>
                                            </InputGroup>
                                        </Col>
                                        <Col xl="4" lg="4" md="6" sm="12" xs="12">
                                            <InputGroup>
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText>
                                                        <Input checked={this.state.check_food ? true : false} onClick={() => this.setState({ check_food: !this.state.check_food },()=>{
                                                            this.setDefaultFood()
                                                        })} addon type="checkbox" aria-label="Checkbox for following text input" />
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                                <label>{strings.servicescheckfive}</label>
                                            </InputGroup>
                                        </Col>
                                    </Row>
                                </Container>
                            </div>


                            {/* function here */}
                            {this.state.check_service && <Services_List appLanguage={this.props.appLanguage} title={strings.servicescheckone} serviceList={this.state.services} servicePdfName={this.state.servicepdfName} servicepdf={this.state.servicepdf} servicetext={this.state.filetext} handleService={this.handleService} />}
                            {this.state.check_idea && <Ideas_List  appLanguage={this.props.appLanguage} title={strings.serviceschecktwo} ideaList={this.state.ideas} handleIdea={this.handleIdea}/>}
                            {this.state.check_product && <Products_List appLanguage={this.props.appLanguage} title={strings.servicescheckthree} productList={this.state.products} productPdfName={this.state.productpdfName} productpdf={this.state.productpdf} producttext={this.state.productfiletext} handleProducts={this.handleProducts} />}
                            {this.state.check_offer && <Services_Offer appLanguage={this.props.appLanguage} title={strings.servicescheckfour} offerList={this.state.offers} offerPdfName={this.state.offerpdfName} offerpdf={this.state.offerpdf} offertext={this.state.offerfiletext} handleOffers={this.handleOffers}/>}
                            {this.state.check_food && <Food_list appLanguage={this.props.appLanguage} title={strings.servicescheckfive} menuList={this.state.foods} menuPdfName={this.state.menupdfName} menupdf={this.state.menupdf} menutext={this.state.menufiletext} handleFoods={this.handleFoods} />}
                        </div>
                        <div>
                            <Button className="btn-block styleBTN" onClick={this.addServices}>{strings.saveBTN}</Button>
                        </div>
                    </ModalBody>
                </Modal>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        appLanguage: state.HeaderReducer.appLanguage,
        token: state.UserReducer.token,
        user: state.UserReducer.user
    }
}
const mapDispatchToProps = dispatch => bindActionCreators(
    {
        saveUser,
        showSnack,
        ReIntializeUser
    }
    , dispatch
)
export default connect(mapStateToProps, mapDispatchToProps)(ServicesList);