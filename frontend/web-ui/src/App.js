import React, { Component } from 'react';
import HeaderBar from './components/Header';
import ManualTradingMenu from './components/ManualTradingMenu';
import './App.css';
import {
  Container,  
  Grid,
  Header  
} from 'semantic-ui-react'

class App extends Component {
  render() {
    return (
      <div className="App">
        <HeaderBar />              
            <Grid container divided stackable style={{ marginTop: '2em' }}>              
                <Grid.Column width={4}>
                  <ManualTradingMenu />
                </Grid.Column>
                <Grid.Column width={8}>
                  <Header as='h1'>Semantic UI React Fixed Template</Header>
                </Grid.Column>                        
            </Grid>
            <Container text style={{ marginTop: '7em' }}>      
              <p>This is a basic fixed menu template using fixed size containers.</p>      
            </Container>    
      </div>
    );
  }
}

export default App;