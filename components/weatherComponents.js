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
    }

    render() {
        return <div>
            <h1>{this.props.name}</h1>
            <div className="about">{this.props.name}</div>
            <div className="about">{this.props.name}</div>
            <Forecast name={this.props.name} days={this.props.date}/>
            <ChatDialog name={this.props.name}><h1>Väderchatt - {this.props.name}</h1></ChatDialog>
            <WelcomeDialog />
            <ClimateCode />
        </div>;
    }
}

class Forecast extends React.Component{
    constructor(props) {
        super(props);
        this.state = {error: null, isLoaded: false, forecast: []};
        this.handleClick = this.handleClick.bind(this);
    }

    async componentDidMount(){
        await fetch("/forecast/"+this.props.name, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
        .then((response) => response.json())
        .then(result => {
            this.setState({isLoaded: true, forecast: [result]});
            console.log(result);
        },
        (error)=>{
            this.state({isLoaded: true, error});
        })
    }

    handleClick(){
        this.componentDidMount();
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
        const {error, isLoaded, forecast} = this.state;
        if(error){
            return <div>Error: {error.message}</div>;
        }else if(!isLoaded){
            return <div>Loading...</div>
        }else{
            return(
            <div className="flex">
                {this.aside()}
                <div className="forecast">
                    <div><Button value="collapse">Öppna alla</Button><p>Från</p><p>Till</p><p>Temperatur max/min</p><p>Nederbörd per dygn</p><p>Vind/byvind</p></div>
                    {forecast.map(tag =>
                    <Accordion>
                        <div key={tag.name+tag.fromtime+tag.totime} className="infoBox"><h2>{tag.name}</h2><h2>{tag.fromtime}</h2><h2>{tag.totime}</h2><h2>{tag.auxdata.TVALUE}&#176;C</h2><h2>{tag.auxdata.RVALUE}{tag.auxdata.RUNIT}</h2><h2>{tag.auxdata.MPS}m/s</h2>
                        </div>
                    </Accordion>
                    )}
                </div>
            </div>)
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
        this.state = {error: null,  isLoaded: false, comments: [], show: true, button: "Chatt", content: ""};
    }

    async componentDidMount(){
        await fetch("/comments/"+this.props.name, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
            .then((response) => response.json())
            .then(data => {
                this.setState({isLoaded: true, comments: data});
                console.log(this.state.comments);
            },
            (error)=>{
                this.setState({isLoaded: true, error});
            }
        )
    }

    async addComment(){
        const id = Math.max.apply(null, this.state.comments.map(comment => comment.id))+1;
        console.log(id);
        const time = new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString();
        console.log(time);
        const data = {
            "id" : id,
            "location" : this.props.name,
            "replyto" : "null",
            "author" : "1",
            "content" : this.state.content,
            "posted" : time
        }
        //HTML5 API Fetch
        await fetch("/comments/"+this.props.name, {
            method: 'POST',
            headers: {'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
            .then((response) => response.json()).then(data => {
            this.componentDidMount();
        });
    }

    handleOnChange(e){
        this.setState({content: e.target.value});
        console.log(e.target.value);
    }

    handleClick(){
        this.state.show = !this.state.show;
        if(this.state.show){
            this.setState({button: "Stäng"});
        }else{
            this.setState({button: "Chatta"});
        }
    }

    handleComment(){
        this.addComment();
    }

    draw(){
        const {error, isLoaded, comments} = this.state;
        if(error){
            return <div>Error: {error.message}</div>;
        }else if(!isLoaded){
            return <div>Loading...</div>;
        }else if(this.state.show && isLoaded){
            return (<div>
            <div className="dialog">
            <Dialog><h1>Väderchatt - {this.props.name}</h1>
            <div className="messageBox">
                {comments.map(tag=><div className="message" key={tag.id}><p>{tag.id}</p><p>{tag.content}</p><Like/></div>)}
            </div>
            <div className="inputBox">
                <input type="text" name="comment" value={this.state.comment} onChange={this.handleOnChange}></input>
                <button onClick={this.handleComment}>Skicka</button>
            </div>
            </Dialog>
            </div>
            </div>)
        }
    }

    render() { 
        return (<div>{this.draw()}<button onClick={this.handleClick} className="chatButton">{this.state.button}</button></div>);
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