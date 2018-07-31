import React, { Component } from 'react';
import { Header, Form, Segment, Button } from 'semantic-ui-react';
import './TradingMenu.css';
import TraderClient from '../client/TraderClient';

class TradingMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Product: '',
      BuyAmount: 0,
      Fee: 0,
      FromDays: 0,
      Interval: 0,
      Mode: '',
      Strategy: '',
      traderRunning: false,
      traderWaiting: false
    };
    this.client = new TraderClient();
  }

  componentDidMount() {
    this.client.subscribeToTraderStatusUpdates((status) => {
      console.log(status);
      this.setState({
        traderWaiting: false,
        traderRunning: status === 'started' ? true : false
      });
    });

    this.client.getDefaultTraderConfig()
      .then(result => {
        const {
          Product,
          BuyAmount,
          Fee,
          FromDays,
          Interval,
          Mode,
          Strategy
        } = result.data;

        this.setState({
          Product,
          BuyAmount,
          Fee,
          FromDays,
          Interval,
          Mode,
          Strategy
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
      const {
        Product,
        BuyAmount,
        Fee,
        FromDays,
        Interval,
        Mode,
        Strategy
      } = this.state;

      this.client.startTrader({
        Product,
        BuyAmount,
        Fee,
        FromDays,
        Interval,
        Mode,
        Strategy
      });
    }
  }

  render() {
    return (
      <div>
        <Header as='h4' color='teal' textAlign='center'>
          Trader Configuration
        </Header>
        <Form size='large'>
          <Segment stacked>
            <Form.Input label='Product' disabled={this.state.traderRunning} fluid value={this.state.Product} />
            <Form.Input label='Strategy' disabled={this.state.traderRunning} fluid value={this.state.Strategy} />
            <Form.Input label='Mode' disabled={this.state.traderRunning} fluid value={this.state.Mode} />
            <Form.Input label='FromDays (test mode only)' disabled={this.state.traderRunning} fluid value={this.state.FromDays} />
            <Form.Input label='Interval' disabled={this.state.traderRunning} fluid value={this.state.Interval} />
            <Form.Input label='Fee' disabled={this.state.traderRunning} fluid value={this.state.Fee} />
            <Form.Input label='BuyAmount' disabled={this.state.traderRunning} fluid value={this.state.BuyAmount} />

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