import React,{Component} from 'react';
import { Header, Button,Form } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom'
import createBrowserHistory from 'history/createBrowserHistory';
const history = createBrowserHistory();

export class Home extends Component{

    state={
        address: ''
    }

    render(){
        return(
            <div>
              <Header as='h1'>Video Sharing application</Header>
              <Form>
                  <Form.Input
                  label='Contract Address'
                  type="text"
                  value={this.state.address}

                  onChange={this.OnChange.bind(this)}
                  />
                  <Button
                   type="submit"
                   onClick={this.Onsubmit.bind(this)}
                  >
                  Upload
                  </Button>
              </Form>
            </div>
        );
    }
   
    OnChange(event){
        this.setState({address:event.target.value});
    }

    Onsubmit(event){
        event.preventDefault();
        console.log("hello");
        this.props.history.push(`/upload/${this.state.address}`);
    }

}