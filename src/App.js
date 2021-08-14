import React from 'react';
import './App.css';

class App extends React.Component {

    constructor() {
        super();
        this.state = {
            status: "",
            number: "",
            language: "english",
            message: "",
        }


        this.changeNum = this.changeNum.bind(this);
        this.changeLanguage = this.changeLanguage.bind(this);
        this.changeMessage = this.changeMessage.bind(this);
        this.formSubmitted = this.formSubmitted.bind(this);
    }

    async formSubmitted(e) {
        e.preventDefault()
        this.setState({
            status: "Sending....",
        })

        let url = "/.netlify/functions/send-sms?num=" + this.state.number + "&language=" + this.state.language + "&subject=" + this.state.subject + "&message=" + this.state.message

        let resp = await fetch(url);

        if (resp.status === 200) {
            this.setState({
                status: "Sent!",
            })
        } else {
            this.setState({
                status: "Failed to send SMS!",
            })
        }

    }

    changeNum(e) {
        this.setState({number: e.target.value});
    }

    changeLanguage(e) {
        this.setState({language: e.target.value});
    }


    changeMessage(e) {
        this.setState({message: e.target.value});
    }


    render() {

        return (
            <div className="App">
                <h1>Speak Greek to me!</h1>
                <small>Please use responsibly :)</small>
                <form onSubmit={this.formSubmitted}>
                    <label>Number:</label>
                    <input value={this.state.number} onChange={this.changeNum} id="number" type="tel"
                           placeholder="1234567890" pattern="[0-9]{10}" required/>
                    <br/>

                    <label>Language:</label>
                    <select id="languages" value={this.state.languages} onChange={this.changeLanguage}>
                        <option value="english">English</option>
                        <option value="arabic">Arabic</option>
                        <option value="bengali">Bengali</option>
                        <option value="chinese">Chinese</option>
                        <option value="french">French</option>
                        <option value="greek">Greek</option>
                        <option value="hindi">Hindi</option>
                        <option value="japanese">Japanese</option>
                        <option value="korean">Korean</option>
                        <option value="portuguese">Portuguese</option>
                        <option value="spanish">Spanish</option>
                    </select>
                    <br/>


                    <label>Message:</label>
                    <textarea value={this.state.message} onChange={this.changeMessage} id="body" rows="4" cols="20"
                              maxLength="256" required/>
                    <br/>

                    <button type={"submit"}>Send!</button>
                </form>
                <div>
                    <h3>{this.state.status}</h3>
                </div>
            </div>
        );
    }
}

export default App;
