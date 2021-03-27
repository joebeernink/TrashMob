import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { Guid } from "guid-typescript";

interface FetchEventDataState {
    eventList: EventData[];
    loading: boolean;
}  

export class FetchEvents extends React.Component<RouteComponentProps<{}>, FetchEventDataState> {

    constructor(props: RouteComponentProps<{}>) {
        super(props);
        this.state = { eventList: [], loading: true };

        fetch('api/Events', {
            method: 'GET',
            headers: {
                Allow: 'GET',
                Accept: 'application/json',
                'Content-Type': 'application/json'
                },
            })
            .then(response => response.json() as Promise<EventData[]>)
            .then(data => {
                this.setState({ eventList: data, loading: false });
            });

        // This binding is necessary to make "this" work in the callback  
        this.handleDelete = this.handleDelete.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
    }

    public render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : this.renderEventsTable(this.state.eventList);

        return (
            <div>
                <h1 id="tabelLabel" >Mob Events</h1>
                <p>
                    <Link to="/addevent">Create New</Link>
                </p>
                {contents}
            </div>
        );
    }

    // Handle Delete request for an mob event  
    private handleDelete(id: Guid) {
        if (!window.confirm("Do you want to delete mob event with Id: " + id))
            return;
        else {
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
        }
    }

    handleEdit(id: Guid) {
        this.props.history.push("/mobevent/edit/" + id);
    }

    private renderEventsTable(events: EventData[]) {
        return (
            <table className='table table-striped' aria-labelledby="tabelLabel">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Date</th>
                        <th>Event Type</th>
                        <th>Address</th>
                        <th>City</th>
                        <th>State / Province</th>
                        <th>Country</th>
                        <th>ZipCode</th>
                        <th>Created By</th>
                        <th>Created Date</th>
                        <th>Latitude</th>
                        <th>Longitude</th>
                        <th>GPS Coords</th>
                        <th>MaximumNumberOfParticpants</th>
                        <th>Last Updated By</th>
                        <th>Last Updated Date</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {events.map(mobEvent =>
                        <tr key={mobEvent.id.toString()}>
                            <td>{mobEvent.name}</td>
                            <td>{mobEvent.description}</td>
                            <td>{mobEvent.eventDate}</td>
                            <td>{mobEvent.eventTypeId}</td>
                            <td>{mobEvent.streetAddress}</td>
                            <td>{mobEvent.city}</td>
                            <td>{mobEvent.stateProvince}</td>
                            <td>{mobEvent.country}</td>
                            <td>{mobEvent.zipCode}</td>
                            <td>{mobEvent.createdByUserId}</td>
                            <td>{mobEvent.createdDate}</td>
                            <td>{mobEvent.latitude}</td>
                            <td>{mobEvent.longitude}</td>
                            <td>{mobEvent.gpscoords}</td>
                            <td>{mobEvent.maxNumberOfParticipants}</td>
                            <td>{mobEvent.lastUpdatedByUserId}</td>
                            <td>{mobEvent.lastUpdatedDate}</td>
                            <td>{mobEvent.eventStatusId}</td>
                            <td>
                                <a className="action" onClick={(id) => this.handleEdit(mobEvent.id)}>Edit</a>  |
                                <a className="action" onClick={(id) => this.handleDelete(mobEvent.id)}>Delete</a>
                            </td> 
                        </tr>
                    )}
                </tbody>
            </table>
        );
    }
}

export class EventData {
    id: Guid = Guid.createEmpty();
    name: string = "";
    description: string = "";
    eventDate: Date = new Date();
    eventTypeId: Guid = Guid.createEmpty();
    streetAddress: string = "";
    city: string = "";
    stateProvince: string = "";
    country: string = "";
    zipCode: string = "";
    createdByUserId: string = "";
    createdDate: Date = new Date();
    latitude: string = "";
    longitude: string = "";
    gpscoords: string = "";
    maxNumberOfParticipants: number = 0;
    lastUpdatedByUserId: string = "";
    lastUpdatedDate: Date = new Date();
    eventStatusId: Guid = Guid.createEmpty();
}