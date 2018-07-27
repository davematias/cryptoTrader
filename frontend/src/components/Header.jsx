import React, { Component } from 'react';
import {
    Container,    
    Menu,
  } from 'semantic-ui-react'

class HeaderBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
    };
  }
  
  render() {
    return (
        <Menu fixed='top' inverted>
        <Container>
          <Menu.Item header>            
            User Name
          </Menu.Item>
          {
            this.props.currencies.map((x, idx) => {
              return <Menu.Item key={idx}>
                {x.id}: -
              </Menu.Item>    
            })
          }          
        </Container>
      </Menu>  
    );
  }
}

export default HeaderBar;