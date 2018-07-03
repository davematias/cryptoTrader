import React, { Component } from 'react';
import { Input, Button, Menu } from 'semantic-ui-react';
import './ManualTradingMenu.css';
import TraderClient from '../client/TraderClient';

class ManualTradingMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: '',
      products: []
    };
    this.client = new TraderClient();
  }

  componentDidMount() {
    this.client.getProducts()
      .then(result => {
        this.setState({ products: result.data});
      });
  }

  handleClick = (e, { name }) => this.setState({ activeItem: name })

  render() {
    return (
      <div>
      <Menu className="menu-scrollable" vertical>
        {
          this.state.products.map((x, idx) => {
            return <Menu.Item key={idx}>
                <Button name={x.id} toggle secondary active={this.state.activeItem === x.id} onClick={this.handleClick} >{x.id}</Button>
            </Menu.Item>
          })
        }
      </Menu>
        <Menu vertical>
        <Menu.Item>
          <Input placeholder='Insert amount...' />
        </Menu.Item>
        <Menu.Item>
          <Button primary>Buy</Button>
          <Button primary>Sell</Button>
        </Menu.Item>
      </Menu>
      </div>
    )
  }
}

export default ManualTradingMenu;