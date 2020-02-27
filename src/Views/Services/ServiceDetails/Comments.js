import React from 'react';
import String from '../../../assets/Locals/locals'
import { Col, Row, Input, Button } from "reactstrap";
import StarRatingComponent from 'react-star-rating-component';
import moment from 'moment';
import axios from "axios";
import { API_ENDPOINT } from '../../../AppConfig';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// import 'moment/locale/ar'
// import 'moment/locale/en-au'

class Comments extends React.Component {
    constructor() {
        super();
        this.state = {
            ratings: [],
            comments: [],
            comment: null
        };
    }
    componentWillMount() {
        this.AllComments()
    }

    AllComments() {
        let businessId = this.props.service
        let rate = `${API_ENDPOINT}/rate?businessId=${businessId}`;
        let comment = `${API_ENDPOINT}/comment?businessId=${businessId}`;
        axios
            .all([
                axios.get(rate),
                axios.get(comment)
            ])
            .then(
                axios.spread((rate, comment) => {

                    this.setState({
                        ratings: rate.data.data,
                        comments: comment.data.data
                    }, () => {
                        console.log("ALLDATA", this.state.comments, this.state.ratings)
                        this.AllRates()
                    });
                })
            )
    }

    AllRates() {
        let comments = this.state.comments, targetRating = []
        for (let i = 0; i < comments.length; i++) {
            let findRating = this.state.ratings.find(rate => rate.userId.id === this.state.comments[i].userId.id)
            targetRating.push(findRating)
        }
        console.log("FINDRATING", targetRating)
        this.setState({ ratings: targetRating })
    }
    AddComment() {
        if (this.props.token) {
            document.getElementById('comment').value = "";
            let uri = `${API_ENDPOINT}/comment`
            let token = `Bearer ${this.props.token}`
            let data = {
                comment: this.state.comment,
                businessId: this.props.service
            }
            axios.post(uri, data, {
                headers: {
                    Authorization: token
                }
            }).then(response => {
                console.log("COMMENT", response.data)
                let AllComments = this.state.comments
                AllComments.push(response.data)
                this.setState({ comments: AllComments })
            }).catch(err => {
                console.log("COMMENT err", err.response)
                // this.props.showSnack('myUniqueId', {
                //     label: err.response.data.errors,
                //     timeout: 7000,
                //     button: { label: this.props.lang === 'en' ? 'Add Comment' : 'اضافة تعليق' }
                // });
            })
        } else {
            this.props.showSnack('myUniqueId', {
                label: String.rateError,
                timeout: 7000,
                button: { label: this.props.lang === 'en' ? 'Add Comment' : 'اضافة تعليق' }
            });
        }
    }

    render() {
        let lang = this.props.lang
        if (lang === 'ar') {
            require('moment/locale/ar')
        } else {
            require('moment/locale/en-au')
        }
        console.log("MOMMENTT", moment.locale())
        return (
            <div style={{
                direction: this.props.lang === 'ar' ? 'rtl' : 'ltr',
                textAlign: this.props.lang === 'ar' ? 'right' : 'left'
            }}>
                <Row data-aos="fade-up">
                    <Col md="12"> <h4 className="text-gold commentTitle"> {String.Comments} </h4> </Col>
                </Row>
                <Row className="commentContainer" data-aos="fade-up">
                    {this.state.comments.map((comment, index) => (
                        <Col md="12">
                            <Row>
                                <Col md="10">
                                    <div className="userIconComment"> <i class="fa fa-user"></i> </div>
                                    <h6 className="usernameComment"> {comment.userId.name} </h6>
                                    <StarRatingComponent
                                        name="commentRating"
                                        editing={false}
                                        renderStarIcon={() => <span> <i class="fas fa-star"></i> </span>}
                                        starCount={5}
                                        value={this.state.ratings[index] ? this.state.ratings[index].rate : 0}
                                    />
                                    <h5 className="commentContent text-gold"> {comment.comment} </h5>
                                </Col>
                                <Col md="2"> <p className="dateComment" style={{ direction: lang === 'en' ? 'ltr' : 'rtl' }}>
                                    {moment(comment.createdAt).startOf('minute').fromNow()}
                                </p> </Col>
                            </Row>
                            <Row> <div className="commentLine" > </div> </Row>
                        </Col>
                    ))}

                    <Col md="12" className="commentTextArea"> <Input id="comment" type="textarea" placeholder={String.placeholderComment} 
                        onChange={(e) => this.setState({ comment: e.target.value }) }></Input> </Col>
                    <Col md="12"> <Button className="btn_contactus_send d-block w-100 my-4 mx-auto border-radius  btn btn-secondary"
                        onClick={() => {
                            if (this.state.comment) this.AddComment()
                        }}> {String.ContactUsBtn}  </Button> </Col>
                </Row>
            </div>
        )
    }
}
const mapStateToProps = state => {
    return {
        lang: state.HeaderReducer.appLanguage,
        user: state.UserReducer.user,
        token: state.UserReducer.token,
    }
}
const mapDispatchToProps = dispatch => bindActionCreators(
    {

    }
    , dispatch
)

export default connect(mapStateToProps, mapDispatchToProps)(Comments);
// export default (Comments);


