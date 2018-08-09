import React, { Component } from 'react';
import { Container, Header, Card, Segment } from 'semantic-ui-react';
import './Body.css';
import TraderClient from '../client/TraderClient';

class Body extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: null,
            positions: [],
            profit: 0
        };
        this.client = new TraderClient();
    }

    componentDidMount() {
        this.client.getTraderStatus().then(result => {
            const traderStatus = result.data;
            if (traderStatus.status === 'started') {
                this.setState({ startDate: new Date(traderStatus.timeStamp), positions: traderStatus.positions });
            } else {
                this.setState({ startDate: null });
            }
        });

        this.client.subscribeToTraderStatusUpdates((status) => {
            if (status === 'started') {
                this.setState({ startDate: new Date() });
            } else {
                this.setState({ startDate: null });
            }
        });

        this.client.subscribeToPositionUpdates((data) => {
            var positions = this.state.positions;
            positions.push(data);

            const profit = positions.reduce((profit, currentPosition) =>
                profit + currentPosition.profit, 0
            );

            this.setState({ profit });
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
                            <p>Trader Started: {this.state.startDate.toLocaleString()}</p>
                            :
                            <p>Trader Idle</p>
                    }
                    {
                        <p>Total Profit: {this.state.profit.toFixed(2)}</p>
                    }
                    <Card.Group>
                        {
                            this.state.positions.map((positionData, idx) => {
                                const enter = `Enter | ${positionData.enter.price} | ${positionData.enter.time}`;
                                const exit = positionData.exit
                                    ? `Exit: | ${positionData.exit.price} | ${positionData.exit.time}`
                                    : '';
                                const profit = positionData.profit;
                                const profitColor = profit > 0 ? 'green' : 'red';

                                return <Card fluid key={idx}>
                                    <Card.Content>
                                        <Card.Header>Position</Card.Header>
                                        <Card.Description>
                                            <p>{enter}</p>
                                            <p>{exit}</p>
                                            <div>
                                                <Segment color={profitColor}>Profit {profit.toFixed(2)}</Segment>
                                            </div>
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