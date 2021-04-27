import { Component } from 'react';
import * as React from 'react'

import { RouteComponentProps } from 'react-router-dom';
import EventData from './Models/EventData';
import EventTypeData from './Models/EventTypeData';
import { apiConfig, defaultHeaders, msalClient } from '../store/AuthStore';
import { getEventType } from '../store/eventTypeHelper';
import { getUserFromCache } from '../store/accountHandler';

interface PropsType extends RouteComponentProps {
    eventList: EventData[];
    eventTypeList: EventTypeData[];
    loading: boolean;
};

interface FetchEventDataState {
    eventList: EventData[];
    eventTypeList: EventTypeData[];
    currentUserId: string;
    loading: boolean;
}

export class UserEvents extends Component<PropsType, FetchEventDataState> {

    constructor(props: PropsType) {
        super(props);
        this.state = { eventList: this.props.eventList, eventTypeList: this.props.eventTypeList, loading: this.props.loading, currentUserId: getUserFromCache().id };

        // This binding is necessary to make "this" work in the callback  
        this.handleDelete = this.handleDelete.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
    }

    // Handle Remove request for an event  
    private handleRemove(id: string, name: string) {
        if (!window.confirm("Do you want to remove yourself from this event: " + name + "?"))
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

                fetch('api/EventAttendees/' + id + '/' + this.state.currentUserId, {
                    method: 'delete',
                    headers: headers
                }).then(() => { this.props.history.push("/"); })
            });
        }
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
                    method: 'delete',
                    headers: headers
                }).then(() => { this.props.history.push("/"); });
            });
        }
    }

    public render() {
        let contents = this.props.loading
            ? <p><em>Loading...</em></p>
            : this.renderEventsTable(this.props.eventList);

        return (
            <div>
                <h1 id="tabelLabel" >My Events</h1>
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
                        {events.map(mobEvent => {
                            var isOwner = mobEvent.createdByUserId === this.state.currentUserId;

                            return (
                                <tr key={mobEvent.id.toString()}>
                                    <td>{mobEvent.name}</td>
                                    <td>{new Date(mobEvent.eventDate).toLocaleString()}</td>
                                    <td>{getEventType(this.props.eventTypeList, mobEvent.eventTypeId)}</td>
                                    <td>{mobEvent.city}</td>
                                    <td>{mobEvent.region}</td>
                                    <td>{mobEvent.country}</td>
                                    <td>{mobEvent.postalCode}</td>
                                    <td>
                                        <button hidden={!isOwner} className="action" onClick={() => this.props.history.push('/editevent/' + mobEvent.id)}>Edit Event</button>
                                        <button hidden={!isOwner} className="action" onClick={() => this.handleDelete(mobEvent.id, mobEvent.name)}>Delete Event</button>
                                        <button hidden={isOwner} className="action" onClick={() => this.props.history.push('/eventdetails/' + mobEvent.id)}>View Details</button>
                                        <button hidden={isOwner} className="action" onClick={() => this.handleRemove(mobEvent.id, mobEvent.name)}>Remove Me from Event</button>
                                    </td>
                                </tr>)
                        }
                        )}
                    </tbody>
                </table>
            </div>
        );
    }
}