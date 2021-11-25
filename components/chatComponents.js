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
        return <li onClick={this.handleClick}>Like</li>;
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
                    <div className="message"><div><p>{tag.id}</p><p>{tag.content}</p></div></div>
                    <ul><Like/><li>Svara</li><li onClick={this.removeComment.bind(this, tag.id)}>Ta bort</li><li>{tag.posted}</li></ul>
                </div>
            )}
            </div>
            <div className="inputBox">
                <input type="text" onChange={this.handleOnChange}></input>
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

class answerChat extends React.Component {
    constructor(props) {
        super(props);
        this.state({error: null, isLoaded: false, comment: []})
    }

    render() { 
        const {error, isLoaded, comment } = this.state;
        if(error){
            return <div>Error: {error.message}</div>
        }else if(!isLoaded){
            return <div>Loading...</div>
        }else{
            return <div>
                
            </div>;
        }
    }
}
