import React from "react";
import { Col, Row} from "reactstrap";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
class DisplayHeader extends React.Component
{
    componentWillMount(){
        // Bashandy add to start at every page from top
        window.scrollTo({
            top: 0,
            left: 0,
            // behavior: 'smooth'
          });
    }
    render()
    {
        return (
            <Row>
                <Col xs="12" lg="12" md="12"
                    className="py-5 bg-favourites d-flex align-items-end justify-content-center">
                <h2 className ="text-white mb-0">
                    {this.props.lang ==="ar" ?"المفضله": "Favorites"}
                </h2>
            </Col>
            </Row>
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

export default connect(mapStateToProps, mapDispatchToProps)(DisplayHeader);