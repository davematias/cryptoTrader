import React, { Component } from 'react';
import HeaderBar from './components/Header';
import './App.css';
import {
  Container,
  Grid,
  Header,
  Button
} from 'semantic-ui-react'
import TraderClient from './client/TraderClient';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currencies: [],
      client: new TraderClient()
    };
  }

  componentDidMount() {
    this.state.client.getCurrencies()
      .then(result => {
        this.setState({ currencies: result.data});
      });

      this.state.client.subscribeToDataUpdates((data) => {
        console.log(data);
      });

      this.state.client.subscribeToPositionUpdates((data) => {
        console.log(data);
      });
  }

  startTrader = () => {
    this.state.client.startTrader().then(result => {
      console.log("happy trading!");
    });
  }

  render() {
    return (
      <div className="App">
        <HeaderBar currencies={this.state.currencies} />
            <Grid container divided stackable style={{ marginTop: '2em' }}>
                <Grid.Column width={12}>
                  <Header as='h1'>Semantic UI React Fixed Template</Header>
                  <Container text style={{ marginTop: '7em' }}>
                    <div>Start Trader   <Button onClick={this.startTrader} primary>Start</Button></div>
                    <p>This is a basic fixed menu template using fixed size containers.</p>
                  </Container>
                </Grid.Column>
            </Grid>
      </div>
    );
  }
}

export default App;