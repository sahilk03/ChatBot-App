import React from "react";
import "./App.scss";
import Editor from "./Editor";
import Typography from "@material-ui/core/Typography";
import { connect } from "react-redux";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chatData: {},
      message: "",
    };
  }
  render() {
    let { chatData } = this.state;
    let { currentTab } = this.props;
    return (
      <div className="App">
        <div className="Users">
          <Editor />
        </div>
        <div className={"chatbox"}>
          <div className="chatwindow">
            {chatData &&
              chatData[currentTab] &&
              chatData[currentTab].length > 0 &&
              chatData[currentTab].map((thread, i) => (
                <div
                  className={
                    thread.bot ? "thread thread_bot" : "thread thread_user"
                  }
                  key={thread + i}
                >
                  <div
                    className="thread_bubble"
                    key={thread.tabName + thread.text}
                  >
                    <Typography variant="h6">{thread.text}</Typography>
                  </div>
                </div>
              ))}
          </div>
          <textarea
            type="text"
            className="message_input"
            placeholder={"Type Here..."}
            onKeyDown={this.handleKeyDown}
            value={this.state.message}
            onChange={this.handleText}
          ></textarea>
        </div>
      </div>
    );
  }

  handleSend = (event) => {
    if (this.state.message) {
      this.setState(
        (prevstate) => {
          let cloned = [];
          if (prevstate.chatData[this.state.currentTab])
            cloned = [...prevstate.chatData[this.state.currentTab]];
          cloned.push({ text: this.state.message });
          if (this.props.currentCode) {
            let initfunc = (arg) =>
              eval("" + this.props.currentCode + "; init(`" + arg + "`);");

            let botText = initfunc(this.state.message);
            if (botText) {
              cloned.push({
                text: botText,
                bot: true,
              });
            }
          }
          return {
            chatData: {
              ...prevstate.chatData,
              [this.props.currentTab]: cloned,
            },
            message: "",
          };
        },
        () => {
          if (document.querySelector(".chatwindow").lastElementChild)
            document
              .querySelector(".chatwindow")
              .lastElementChild.scrollIntoView({ behavior: "smooth" });
        }
      );
    }
  };

  handleText = (event) => {
    this.setState({ message: event.target.value });
  };

  handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      this.handleSend();
    }
  };
}
const mapStateToProps = (state) => {
  debugger;
  return {
    currentTab: state.currentTab,
    currentCode: state.currentCode,
  };
};

export default connect(mapStateToProps, null)(App);
