import React from 'react';
import { Container, Col, Row, Input } from "reactstrap";
import String from '../../../assets/Locals/locals'
import DepartmentCard from './departmentCard'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import axios from "axios";
import { API_ENDPOINT } from '../../../AppConfig';

class Departments extends React.Component {
    state = {
        categoryName: this.props.location.state ? this.props.location.state.categoryName : '',
        categoryId: this.props.location.state ? this.props.location.state.categoryId : '',
        departments: [],
        noDepart: false,
        prevLang: this.props.lang
        
    }

    componentWillMount() {
        // Bashandy add to start at every page from top
        window.scrollTo({
            top: 0,
            left: 0,
            // behavior: 'smooth'
          });
        this.GetSubCategory()
    }

    GetSubCategory() {
        let uri = `${API_ENDPOINT}/subcategory?categoryId=${this.state.categoryId}`
        console.log("test request", uri)
        axios.get(uri, {
            headers: {
                'Accept-Language': this.props.lang
            }
        }).then(response => this.setState({ departments: response.data.data, categoryName: response.data.data[0] && response.data.data[0].categoryId.name, noDepart: true })
        )
    }

    render() {
        String.setLanguage(this.props.lang)
        if (this.state.prevLang !== this.props.lang) {
            this.GetSubCategory()
            this.setState({ prevLang: this.props.lang })
        }
        if (this.props.location.state) {
            if (this.state.categoryId !== this.props.location.state.categoryId) {
                this.setState({ categoryId: this.props.location.state.categoryId },() =>
                this.GetSubCategory() )
            }
        }
        return (
            <Container fluid style={{ direction: this.props.lang === 'ar' ? 'rtl' : 'ltr', textAlign: 'right' }}>
                <Row className="postion-relative">
                    <Col xs="12" lg="12" md="12" style={{backgroundColor:'green'}}
                        className="py-5 bg-Services d-flex align-items-end justify-content-center">
                        <div className="text-center">
                            <h2 className="text-white mt-5" data-aos="fade-up-right">
                                {this.state.categoryName ? this.state.categoryName : String.serviceTitle}
                            </h2>
                            <br />
                            <h2 className="text-white" data-aos="fade-up-left" data-aos-delay="400">
                                {String.departments}
                            </h2>
                        </div>
                    </Col>

                </Row>
                <Row className="paddingDepartment">

                </Row>
                <Row className="serviceRestaurant" style={{ margin: 'auto', minHeight: '350px' }}>
                    {this.state.departments.length > 0 ? this.state.departments.map((item, index) => (
                        <Col xl="3" md="4">
                             <DepartmentCard id={this.state.categoryId} name={item.name} departId={item.id} categoryName={this.state.categoryName}  animation="zoom-in"/>
                              </Col>
                    )) : this.state.noDepart && <h4 className="noData"> {String.noDepartments} </h4>}
                </Row>
            </Container>
        )
    }
}

const mapStateToProps = state => {
    return {
        lang: state.HeaderReducer.appLanguage,
    }
}
const mapDispatchToProps = dispatch => bindActionCreators(
    {

    }
    , dispatch
)

export default connect(mapStateToProps, mapDispatchToProps)(Departments);
// export default (Departments);