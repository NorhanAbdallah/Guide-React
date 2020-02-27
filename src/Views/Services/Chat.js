import React from 'react';
import { Widget, addResponseMessage, addUserMessage, } from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';
import chat from "../../assets/Images/Chat_img.png"
import Strings from '../../assets/Locals/locals';
import { connect } from 'react-redux';
import axios from "axios"
import { API_ENDPOINT } from "../../AppConfig.js";
class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state =
    {
      name: "this is the State.name of the Chat Component ",
      history: [],
    }
  }
  componentWillMount() {
    axios.get(`${API_ENDPOINT}/chat?user=12&user1=47`, {
      // ${this.props.id} ${this.props.user.id}
      headers: {
        "Accept-Language": this.props.lang,
        // Authorization: `Bearer ${this.props.token}`
        Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiaXNzIjoiQXBwIiwiaWF0IjoxNTc2NjYzNDY2NzA1LCJleHAiOjE1NzY2NjQwNzE1MDV9.dcxi463QLlNLgaXjuViRRr7QeQaN1C5VmZzJ6A2YjSI"
      }
    }).then(res => {
      console.log('ressssssssssssss', res.data.data[0].message)
      this.setState({ history: res.data.data })
      this.intializeHistory()
    }).catch(
      err => {
        console.log("errrr", err.response)
      }
    )
  }
  handleNewUserMessage = (newMessage) => {
    // addResponseMessage(" Haroooooooooooon ");
    console.log(`New message incoming! ${newMessage}`);
  }
  intializeHistory() {
    console.log("response in chat", this.state.history)
    for (let i = 0; this.state.history.length - 1 > i; i++) {
      if (this.state.history[i].from.type === "CLIENT") {
        addUserMessage(this.state.history[i].message);
        // GENRAL_TRADING
        console.log(" CLIENT", this.state.history[i].message)
      }
      else if (this.state.history[i].from.type === "GENERAL_TRADING") {
        addResponseMessage(this.state.history[i].message)
        console.log(" GENERAL_TRADING", this.state.history[i].message)
      }
    }
  }
  render() {
    // console.log("Chat Id", this.props.id, this.props.user.id)
    return (
      <div style={{ direction: this.props.lang === "ar" ? "rtl" : "ltr" }}>
        <Widget
          className="text-center"
          handleNewUserMessage={this.handleNewUserMessage}
          title={this.props.ChatTitle}
          subtitle=""
          senderPlaceHolder={Strings.Chat_Place_Holder}
          launcher={handleToggle => (
            <img alt="Chat Title" className="img-fluid w-50 " style={{ cursor: "pointer" }} src={chat} onClick={handleToggle}
            />
          )}
        />
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    lang: state.HeaderReducer.appLanguage,
    token: state.UserReducer.token,
    user: state.UserReducer.user
  }
}
export default (connect(mapStateToProps, null))(Chat);

