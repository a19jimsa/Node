class Button extends React.Component{

    render(){
        return(
            <button>{this.props.children}</button>
        );
    }
}

class Info extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.state = {data: "Tomt", class: "none", show: true, button: "Chatta"};
    }

    handleClick(){
        this.state.show = !this.state.show;
        if(this.state.show){
            this.setState({class: "none", button: "Chatta"});
        }else{
            this.setState({class: "dialog", button: "Stäng"});
        }
    }

    render() {
        return <div>
            <h1>{this.state.data.name}</h1>
            <div className="about">{this.state.data}</div>
            <div className="about">{this.state.data}</div>
            <Forecast name={this.state.data} days={this.props.date}/>
            <ChatDialog class={this.state.class} name={this.state.data.name}><h1>Väderchatt - {this.state.data.name}</h1></ChatDialog>
            <button onClick={this.handleClick} className="chatButton">{this.state.button}</button>
            <WelcomeDialog />
            <ClimateCode />
        </div>;
    }
}


class Forecast extends React.Component{
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.getData();
    }

    state = {
        forecast: {name:"data är tomt"},
        draw: false
    };

    async getData(){
        const response = await fetch("/forecast", {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })
        .then((response) => response.json()).then(data => {
        this.setState({forecast: data, draw: true})
        });
    }

    handleClick(){
        this.getData();
    }

    aside(){
        return(
        <aside>
            <button onClick={this.handleClick.bind(this, 1)}>1 dagsprognos</button>
            <button onClick={this.handleClick.bind(this, 3)}>3 dagarsprognos</button>
            <button onClick={this.handleClick.bind(this, 7)}>7 dagarsprognos</button>
        </aside>)
    }

    draw(){
        if(this.state.draw){
            return(
            <div className="flex">
                {this.aside()}
                <div className="forecast">
                    <div><Button value="collapse">Öppna alla</Button><p>Från</p><p>Till</p><p>Temperatur max/min</p><p>Nederbörd per dygn</p><p>Vind/byvind</p></div>
                    {this.state.forecast.map(tag =>
                    <Accordion>
                        <div key={tag.name+tag.fromtime+tag.totime} className="infoBox"><h2>{tag.name}</h2><h2>{tag.fromtime}</h2><h2>{tag.totime}</h2><h2>{tag.auxdata.TVALUE}&#176;C</h2><h2>{tag.auxdata.RVALUE}{tag.auxdata.RUNIT}</h2><h2>{tag.auxdata.MPS}m/s</h2>
                        </div>
                    </Accordion>
                    )}
                </div>
            </div>)
        }else{
            return (
                <div className="flex">
                {this.aside()}
                </div>
            )
        }
    }

    render(){
        return (
            this.draw()
        );
    }
}

class Accordion extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(){
        this.setState();
    }

    render() { 
        return <div onClick={this.handleClick} className="toggle">{this.props.children}</div>;
    }
}


class ClimateCode extends React.Component {
    constructor(props) {
        super(props);
        this.getData();
    }
    //Properties specifies here
    //State is an object the component need
    state = {climatecodes: [
    {code: "Af", name: "Tropical rainforest climate Tropical Rainforest", color: "#960000"}]};

    async getData(){
        const response = await fetch("/climatecodes", {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })
        .then((response) => response.json()).then(data => {
        this.setState({climatecodes:data})
        console.log(data);
        });
    }

    render() {
        return(
            <table>
                <tbody>
                    {this.state.climatecodes.map(tag =><tr key={tag.code}><td>{tag.code}</td><td>{tag.name}</td><td>{tag.color}</td></tr>)}
                </tbody>
            </table>
        )
    }
}

class ChatDialog extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.handleOnChange = this.handleOnChange.bind(this);
        this.state = {comments: [{id: 1, username: "Jimmy", content: "Hejsan!"}, {id: 2, username: "Admin", content: "Hej"},{id: 3, username: "Admin", message: "Hej"}], comment:"", id: 4};
    }

    async getData(){
        const response = await fetch("/comments", {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
        .then((response) => response.json()).then(data => {
            console.log(data);
            this.setState({comments:data});
        });
    }

    async pushData(){
        const response = await fetch("/comments", {
            method: 'POST',
            headers: {'Content-Type': 'application/json' },
            body: JSON.stringify({id: this.state.id, username: "Jimmy", content: this.state.comment})
        })
            .then((response) => response.json()).then(data => {
            console.log("Lagt till data");
            this.state.id = this.state.id + 1;
            this.setState({id:this.state.id})
            this.getData();
        });
    }

    handleOnChange(e){
        this.setState({comment: e.target.value});
        console.log(e.target.value);
    }

    handleClick(){
        this.pushData();
    }

    render() { 
        return (<div className={this.props.class}>
            <Dialog><h1>Väderchatt - {this.props.name}</h1>
            <div className="messageBox">
                {this.state.comments.slice().reverse().map(tag => <div className="message" key={tag.id+tag.username+tag.content}><p>{tag.username}</p><p>{tag.content}</p><Like/></div>)}
            </div>
            <div className="inputBox">
                <input type="text" name="comment" value={this.state.comment} onChange={this.handleOnChange}></input>
                <button onClick={this.handleClick}>Skicka</button>
            </div>
            </Dialog>
            </div>)
    }
}

class WelcomeDialog extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.state = {class: "dialog"};
    }

    handleClick(){
        this.setState({class: "none"});
        
    }

    render() { 
        return (<Dialog class={this.state.class}><h1>Välkommen till vä'rt!</h1>
        <p>Här kan du följa prognosen för vär't i 1 till 10 dagarsprognos.</p>
        <p>Skriv in vilken ort du vill veta vä'rt!</p>
        <button onClick={this.handleClick}>Tackar!</button>
        </Dialog>)
    }
}

class Dialog extends React.Component {
    constructor(props){
        super(props);
        this.state = {};
    }
    render() { 
        return <div className={this.props.class}>{this.props.children}</div>;
    }
}

class Like extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(){
        //Do something when clicked on button
    }

    render() { 
        return <button onClick={this.handleClick}>Like</button>;
    }
}

ReactDOM.render(<Info />, document.getElementById("content"));