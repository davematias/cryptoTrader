import React, { Component } from 'react';
import {
    Container,    
    Menu,
  } from 'semantic-ui-react'

class HeaderBar extends Component {
  render() {
    return (
        <Menu fixed='top' inverted>
        <Container>
          <Menu.Item as='a' header>            
            User Name
          </Menu.Item>
          <Menu.Item as='a'>BTC: -</Menu.Item>
          <Menu.Item as='a'>ETH: -</Menu.Item>
          <Menu.Item as='a'>EUR: -</Menu.Item>  
        </Container>
      </Menu>  
    );
  }
}

export default HeaderBar;