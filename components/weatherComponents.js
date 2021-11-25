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
        this.state = {data: ["Tomt"]};
    }

    render() {
        return <div>
            <h1>{this.props.name}</h1>
            <div className="about">{this.props.name}</div>
            <div className="about">{this.props.name}</div>
            <Forecast name={this.state.data} days={this.props.date}/>
            <ChatDialog name={this.props.name}><h1>Väderchatt - {this.props.name}</h1></ChatDialog>
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
        this.handleComment = this.handleComment.bind(this);
        this.state = {comments: ["TOMT"], show: false, button: "Chatta", comment: "", id: 1111};
        this.getData();
    }

    async getData(){
        const response = await fetch("/comments/"+this.props.name, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
        .then((response) => response.json()).then(data => {
            this.setState({comments: data});
            console.log("Hämtade alla kommentarer för " + this.props.name);
        });
    }

    async addComment(){
        const data = {
            "id" : 1114,
            "location" : "Grums",
            "replyto" : "null",
            "author" : "1",
            "content" : "Detta är en uppdaterad kommentar",
            "posted" : "2020-01-02 13:00:00"
        }
        //HTML5 API Fetch
        const response = await fetch("/comments/"+this.props.name, {
            method: 'POST',
            headers: {'Content-Type': 'application/json' },
            body: JSON.stringify(data)
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
        this.state.show = !this.state.show;
        if(this.state.show){
            this.setState({button: "Stäng"});
        }else{
            this.setState({button: "Chatta"});
        }
        this.getData();
    }

    handleComment(){
        this.addComment();
    }

    draw(){
        if(this.state.show){
                return (<div>
            <div className="dialog">
            <Dialog><h1>Väderchatt - {this.props.name}</h1>
            <div className="messageBox">
                {this.state.comments.map(tag => <div className="message" key={tag.id+tag.username+tag.content}><p>{tag.username}</p><p>{tag.content}</p><Like/></div>)}
            </div>
            <div className="inputBox">
                <input type="text" name="comment" value={this.state.comment} onChange={this.handleOnChange}></input>
                <button onClick={this.handleComment}>Skicka</button>
            </div>
            </Dialog>
            </div>
            <div><button onClick={this.handleClick} className="chatButton">{this.state.button}</button></div></div>)
        }else{
            return <div><button onClick={this.handleClick} className="chatButton">{this.state.button}</button></div>
        }
    }

    render() { 
        return (this.draw())
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

ReactDOM.render(<Info name="Grums"/>, document.getElementById("content"));