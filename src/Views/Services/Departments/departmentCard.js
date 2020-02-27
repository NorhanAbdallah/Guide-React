import React from 'react';
import { Card } from 'reactstrap';
import './department.css'
import Location from '../../../assets/Images/departLocation.png'
import WhiteLocation from '../../../assets/Images/whiteDepart.png'
import { Link } from 'react-router-dom';

class DepartmentCard extends React.Component {

    render() {

        return (
            <div id="departmentCard">
                <Link to={{
                    pathname: '/Guide/services', state:{categoryIdHome:this.props.id, departmentId: this.props.departId, categoryName: this.props.categoryName }
                }}>
                    <Card data-aos={this.props.animation} className="cardAnimation_ExternalFile">
                        <div className="departImg" >
                             <img src={Location} alt="location" /> 
                        </div>

                        <div className="departWhiteImg"> <img src={WhiteLocation} alt="WhiteLocation" /> </div>

                        <h3 className="departmentName"> {this.props.name} </h3>
                    </Card>
                </Link>
            </div>
        )
    }
}
export default (DepartmentCard);