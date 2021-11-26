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
        return <li onClick={this.handleClick}>Gilla</li>;
    }
}

class ChatDialog extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.handleOnChange = this.handleOnChange.bind(this);
        this.handleComment = this.handleComment.bind(this);
        this.state = {error: null,  isLoaded: false, comments: [], show: true, button: "Chatta", content: "", highestId: [], showAnswer: false, class: "none", active_id: null};
        this.getHighestId();
    }

    async getHighestId(){
        await fetch("/comments/",{
            method : 'GET',
            headers: { 'Content-Type': 'application/json'}
        })
        .then((response) => response.json())
        .then(data=> {
            this.setState({highestId: data})
        })
    }

    async componentDidMount(){
        await fetch("/comments/"+this.props.name, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
            .then((response) => response.json())
            .then(data => {
                this.setState({isLoaded: true, comments: data});
                this.getHighestId();
            },
            (error)=>{
                this.setState({isLoaded: true, error});
            }
        )
    }

    async addComment(replyto){
        const id = Math.max.apply(null, this.state.highestId.map(highestId => highestId.id))+1;
        console.log(id);
        const time = new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString();
        console.log(time);
        console.log(replyto);
        const data = {
            "id" : id,
            "location" : this.props.name,
            "replyto" : replyto,
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
            this.handleClick();
            this.handleClick();
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

    handleComment(replyto){
        this.addComment(replyto);
        this.setState({active_id: null});
    }

    async removeComment(id){
        //HTML5 API Fetch
        await fetch("/comments/"+id, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json' }
        })
            .then((response) => response.json()).then(data => {
            this.componentDidMount();
        });
    }

    showAnswerInput(){
        this.state.showAnswer = !this.state.showAnswer;
        if(this.state.showAnswer){
            return (<div></div>)
        }else{
            return <div></div>;
        }
    }

    show(id){
        if(this.state.active_id == id){
            this.setState({class: "none", active_id: id});
            this.setState({active_id: "null"});
        }else{
            this.setState({class: "flex", active_id: id});
        }
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
            {comments.map(tag=>
                <div key={tag.id} className="messageContent">
                    <div className="message">
                        <div><p>{tag.id}</p><p>{tag.content}</p></div>
                    </div>
                    <ul><Like id={tag.id} /><li onClick={this.show.bind(this, tag.id)}>Kommentera</li><li onClick={this.removeComment.bind(this, tag.id)}>Ta bort</li><li>{tag.posted}</li></ul>
                    <div className={this.state.active_id == tag.id ? this.state.class : "none"}>
                        <input type="text" onChange={this.handleOnChange}/>
                        <button onClick={this.handleComment.bind(this, tag.id)}>Svara</button>
                    </div>
                    <Answer name={this.props.name} id={tag.id}/>
                </div>
                )}
            </div>
            <div className="inputBox">
                <input type="text" onChange={this.handleOnChange}></input>
                <button onClick={this.handleComment.bind(this, "null")}>Skicka</button>
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

class Answer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {error: null, isLoaded: false, comments: []};
    }

    async componentDidMount(){
        console.log(this.props.id);
        if(this.props.id != "null"){
            //HTML5 API Fetch
            await fetch("/comments/"+this.props.name+"/comment/"+this.props.id, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            })
                .then((response) => response.json())
                .then(data => {
                    this.setState({isLoaded: true, comments: data});
                },
                (error)=>{
                    this.setState({isLoaded: true, error});
                }
            )
        }
    }

    async removeComment(id){
        //HTML5 API Fetch
        await fetch("/comments/"+id, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json' }
        })
            .then((response) => response.json()).then(data => {
            this.componentDidMount();
        });
    }

    render() { 
        const {error, isLoaded, comments } = this.state;
        if(error){
            return <div>Error: {error.message}</div>
        }else if(comments.length > 0){
            return (<div>
                <div>{'->'}</div>
                {comments.map(tag=>
                <div key={tag.id} className="answerContent">
                    <div className="answerMessage right">
                        <p>{tag.id}</p><p>{tag.content}</p>
                    </div>
                    <div className="right"><ul><Like/><li onClick={this.removeComment.bind(this, tag.id)}>Ta bort</li><li>{tag.posted}</li></ul></div>
                </div>)}
            </div>
            );
        }else{
            return <div></div>;
        }
    }
}
