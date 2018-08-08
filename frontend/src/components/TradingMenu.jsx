import React, { Component } from 'react';
import { Header, Form, Segment, Button } from 'semantic-ui-react';
import './TradingMenu.css';
import TraderClient from '../client/TraderClient';

class TradingMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        Product: '',
        BuyAmount: 0,
        Fee: 0,
        FromDays: 0,
        Interval: 0,
        Mode: '',
        Strategy: ''
      },
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
            <Form.Input label='Product' disabled={this.state.traderRunning} fluid name="Product" onChange={this.onChange} value={this.state.data.Product} />
            <Form.Input label='Strategy' disabled={this.state.traderRunning} fluid name="Strategy" onChange={this.onChange} value={this.state.data.Strategy} />
            <Form.Input label='Mode' disabled={this.state.traderRunning} fluid name="Mode" onChange={this.onChange} value={this.state.data.Mode} />
            <Form.Input label='FromDays (test mode only)' disabled={this.state.traderRunning} fluid name="FromDays" onChange={this.onChange} value={this.state.data.FromDays} />
            <Form.Input label='Interval' disabled={this.state.traderRunning} fluid name="Interval" onChange={this.onChange} value={this.state.data.Interval} />
            <Form.Input label='Fee' disabled={this.state.traderRunning} fluid name="Fee" onChange={this.onChange} value={this.state.data.Fee} />
            <Form.Input label='BuyAmount' disabled={this.state.traderRunning} fluid name="BuyAmount" onChange={this.onChange} value={this.state.data.BuyAmount} />

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