import React, { Component } from 'react';
import { Header, Form, Segment, Button } from 'semantic-ui-react';
import './TradingMenu.css';
import TraderClient from '../client/TraderClient';
import { JSONEditor } from 'react-json-editor-viewer';

class TradingMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      traderRunning: false,
      traderWaiting: false
    };
    this.client = new TraderClient();
  }

  componentDidMount() {
    this.client.getTraderStatus().then(result => {
      const traderStatus = result.data;
      this.setState({
        traderWaiting: false,
        traderRunning: traderStatus.status === 'started' ? true : false
      });
    });

    this.client.subscribeToTraderStatusUpdates((status) => {
      this.setState({
        traderWaiting: false,
        traderRunning: status === 'started' ? true : false
      });
    });

    this.client.getDefaultTraderConfig()
      .then(result => {
        console.log(result.data);
        this.setState({
          data: result.data
        });
      });
  }

  changeTraderState = () => {
    this.setState({
      traderWaiting: true
    });

    if (this.state.traderRunning) {
      this.client.stopTrader();
    } else {
      this.client.startTrader(this.state.data);
    }
  }

  onChange = e => this.setState({
    data: { ...this.state.data, [e.target.name]: e.target.value }
  });

  render() {
    return (
      <div>
        <Header as='h4' color='teal' textAlign='center'>
          Trader Configuration
        </Header>
        <Form size='large'>
          <Segment stacked>
            {
              this.state.data
              ? <JSONEditor
              key="a"
              data={this.state.data}
              />
              : <div>Loading...</div>
            }
            <Button color='teal' onClick={this.changeTraderState} disabled={this.state.traderWaiting} fluid size='large' >
              {
                this.state.traderRunning ?
                  'Stop' : 'Start'
              }
            </Button>
          </Segment>
        </Form>
      </div>
    )
  }
}

export default TradingMenu;