import React, { Component } from 'react';
import HeaderBar from './components/Header';
import ManualTradingMenu from './components/ManualTradingMenu';
import './App.css';
import {
  Container,
  Grid,
  Header
} from 'semantic-ui-react'
import TraderClient from './client/TraderClient';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currencies: []
    };
    this.client = new TraderClient();
  }

  componentDidMount() {
    this.client.getCurrencies()
      .then(result => {
        this.setState({ currencies: result.data});
      });

      this.client.subscribeToDataUpdates((data) => {
        console.log(data);
      });
  }

  render() {
    return (
      <div className="App">
        <HeaderBar currencies={this.state.currencies} />
            <Grid container divided stackable style={{ marginTop: '2em' }}>
                <Grid.Column width={4}>
                  <ManualTradingMenu currencies={this.state.currencies} />
                </Grid.Column>
                <Grid.Column width={8}>
                  <Header as='h1'>Semantic UI React Fixed Template</Header>
                  <Container text style={{ marginTop: '7em' }}>
                    <p>This is a basic fixed menu template using fixed size containers.</p>
                  </Container>
                </Grid.Column>
            </Grid>
      </div>
    );
  }
}

export default App;