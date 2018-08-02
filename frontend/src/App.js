import React, { Component } from 'react';
import HeaderBar from './components/Header';
import TradingMenu from './components/TradingMenu';
import Body from './components/Body';
import './App.css';
import { Grid } from 'semantic-ui-react'
import TraderClient from './client/TraderClient';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currencies: []      
    };

    this.client = new TraderClient()
  }

  componentDidMount() {
    this.client.getCurrencies()
      .then(result => {
        this.setState({ currencies: result.data});
      });
  }

  render() {
    return (
      <div className="App">
        <HeaderBar currencies={this.state.currencies} />
            <Grid container divided stackable style={{ marginTop: '2em' }}>
                <Grid.Column width={4}>
                  <TradingMenu />
                </Grid.Column>
                <Grid.Column verticalAlign='top' width={12}>
                  <Body />                  
                </Grid.Column>
            </Grid>
      </div>
    );
  }
}

export default App;