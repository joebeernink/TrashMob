import { Component } from 'react';
import * as React from 'react'

import { Link } from 'react-router-dom';
import EventData from './Models/EventData';  
import EventTypeData from './Models/EventTypeData';
import { apiConfig, defaultHeaders, msalClient } from '../store/AuthStore';
import { getEventType } from '../store/eventTypeHelper';

interface PropsType {
    eventList: EventData[];
    eventTypeList: EventTypeData[];
    loading: boolean;
 };

interface FetchEventDataState {
    eventList: EventData[];
    eventTypeList: EventTypeData[];
    loading: boolean;
}

export class EventsUserOwns extends Component<PropsType, FetchEventDataState> {

    constructor(props: PropsType) {
        super(props);
        this.state = { eventList: this.props.eventList, eventTypeList: this.props.eventTypeList, loading: this.props.loading };

        // This binding is necessary to make "this" work in the callback  
        this.handleDelete = this.handleDelete.bind(this);
    }

    // Handle Delete request for an event  
    private handleDelete(id: string, name: string) {
        if (!window.confirm("Do you want to delete event with name: " + name))
            return;
        else {
            const account = msalClient.getAllAccounts()[0];

            var request = {
                scopes: apiConfig.b2cScopes,
                account: account
            };

            msalClient.acquireTokenSilent(request).then(tokenResponse => {
                const headers = defaultHeaders('DELETE');
                headers.append('Authorization', 'BEARER ' + tokenResponse.accessToken);

                fetch('api/Events/' + id, {
                    method: 'delete'
                }).then(data => {
                    this.setState(
                        {
                            eventList: this.state.eventList.filter((rec) => {
                                return (rec.id !== id);
                            })
                        });
                });
            });
        }
    }

    public render() {
        let contents = this.props.loading
            ? <p><em>Loading...</em></p>
            : this.renderEventsTable(this.props.eventList);

        return (
            <div>
                <h1 id="tabelLabel" >Mob Events</h1>
                <p>
                    <Link to="/createevent">Create Event</Link>
                </p>
                {contents}
            </div>
        );
    }

    private renderEventsTable(events: EventData[]) {
        return (
            <div>
                <table className='table table-striped' aria-labelledby="tabelLabel">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Date</th>
                            <th>Event Type</th>
                            <th>City</th>
                            <th>Region</th>
                            <th>Country</th>
                            <th>Postal Code</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.map(mobEvent =>
                            <tr key={mobEvent.id.toString()}>
                                <td>{mobEvent.name}</td>
                                <td>{mobEvent.eventDate}</td>
                                <td>{getEventType(this.state.eventTypeList, mobEvent.eventTypeId)}</td>
                                <td>{mobEvent.city}</td>
                                <td>{mobEvent.region}</td>
                                <td>{mobEvent.country}</td>
                                <td>{mobEvent.postalCode}</td>
                                <td>
                                    <Link to={`/editevent/${mobEvent.id}`}>Edit Event</Link>
                                    <button className="action" onClick={() => this.handleDelete(mobEvent.id, mobEvent.name)}>Delete Event</button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        );
    }
}