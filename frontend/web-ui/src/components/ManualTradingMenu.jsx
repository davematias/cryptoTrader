import React, { Component } from 'react';
import { Input, Button, Menu } from 'semantic-ui-react'
import axios from 'axios';

class ManualTradingMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: '',
      products: [] 
    };
  }

  componentDidMount() {
    axios.get(`http://localhost:5000/api/products`)
      .then(result => {        
        this.setState({ products: result.data});
      })
  }
  
  handleClick = (e, { name }) => this.setState({ activeItem: name })

  render() {    
    return (
      <Menu vertical>
        {
          this.state.products.map((x, idx) => {
            return <Menu.Item key={idx}>                      
                <Button name={x.id} toggle secondary active={this.state.activeItem === x.id} onClick={this.handleClick} >{x.id}</Button>
            </Menu.Item>            
          })
        }        
        <Menu.Item>
          <Input placeholder='Insert amount...' />
        </Menu.Item>
        <Menu.Item>
          <Button primary>Buy</Button>
          <Button primary>Sell</Button>
        </Menu.Item>
      </Menu>
    )
  }
}

export default ManualTradingMenu;