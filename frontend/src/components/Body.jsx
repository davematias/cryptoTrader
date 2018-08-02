import React, { Component } from 'react';
import { Container, Header, Card } from 'semantic-ui-react';
import TraderClient from '../client/TraderClient';

class Body extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: null,
            positions: []
        };
        this.client = new TraderClient();
    }

    componentDidMount() {
        this.client.subscribeToTraderStatusUpdates((status) => {
            if (status === 'started') {
                this.setState({startDate: new Date()});
            } else {
                this.setState({startDate: null});
            }
        });

        this.client.subscribeToPositionUpdates((data) => {
            var positions = this.state.positions;
            positions.push(data);
        });
    }

    render() {
        return (
            <div>
                <Header as='h1'>
                    Trading Log                    
                </Header>
                <Container text>
                {
                     this.state.startDate 
                     ?
                     <p>Trader Started: {this.state.startDate.toGMTString()}</p>
                     :
                     <p>Trader Idle</p>                     
                }                      
                <Card.Group>
                {
                    this.state.positions.map((positionData, idx) => {
                        const enter = `Enter | ${positionData.enter.price} | ${positionData.enter.time}`;
                        const exit = positionData.exit ? `Exit: | ${positionData.exit.price} | ${positionData.exit.time}` :
                          '';
                                          
                        return <Card fluid key={idx}>
                            <Card.Content>
                                <Card.Header>Position</Card.Header>                                
                                <Card.Description>
                                 <p>{enter}</p>
                                 <p>{exit}</p>
                                </Card.Description>
                            </Card.Content>
                        </Card>
                    })
                }                
                </Card.Group>       
                </Container>
            </div>
        );
    }
}

export default Body;