import { useContext, useEffect } from 'react';
import * as React from 'react';
import { AzureMapsContext, IAzureMapOptions, IAzureMapsContextProps } from 'react-azure-maps';
import { data, source, Popup, HtmlMarker } from 'azure-maps-control';
import MapComponent from './MapComponent';
import EventData from './Models/EventData';
import * as MapStore from '../store/MapStore'
import UserData from './Models/UserData';
import { HtmlMarkerLayer } from './HtmlMarkerLayer/SimpleHtmlMarkerLayer'
import ReactDOMServer, { renderToString } from "react-dom/server"
import { Button } from 'react-bootstrap';
import { apiConfig, getDefaultHeaders, msalClient } from '../store/AuthStore';
import EventAttendeeData from './Models/EventAttendeeData';

interface MapControllerProps {
    mapOptions: IAzureMapOptions | undefined
    center: data.Position;
    multipleEvents: EventData[],
    isEventDataLoaded: boolean,
    isMapKeyLoaded: boolean
    eventName: string;
    latitude: number;
    longitude: number;
    onLocationChange: any;
    currentUser: UserData;
    isUserLoaded: boolean;
    onAttendanceChanged: any;
    myAttendanceList: EventData[];
    isUserEventDataLoaded: boolean;
    onDetailsSelected: any;
}

export const MapControllerPointCollection: React.FC<MapControllerProps> = (props) => {
    // Here you use mapRef from context
    const { mapRef, isMapReady } = useContext<IAzureMapsContextProps>(AzureMapsContext);
    const [isDataSourceLoaded, setIsDataSourceLoaded] = React.useState(false);

    useEffect(() => {
        if (mapRef && props.isEventDataLoaded && props.isMapKeyLoaded && !isDataSourceLoaded && isMapReady) {

            // Simple Camera options modification
            mapRef.setCamera({ center: props.center, zoom: MapStore.defaultUserLocationZoom });

            var dataSourceRef = new source.DataSource("mainDataSource", { cluster: true });
            mapRef.sources.add(dataSourceRef);

            // Create a HTML marker layer for rendering data points.
            var markerLayer = new HtmlMarkerLayer(dataSourceRef, "marker1", {
                markerRenderCallback: (id: any, position: data.Position, properties: any) => {
                    // Create an HtmlMarker.
                    var marker = new HtmlMarker({
                        position: position
                    });

                    mapRef.events.add('mouseover', marker, (event: any) => {
                        const marker = event.target as HtmlMarker & { properties: any };

                        if (marker.properties.cluster) {
                            const content = `Cluster of ${marker.properties.point_count_abbreviated} markers`
                            // Create a popup.
                            var popup = new Popup({
                                content: content,
                                position: marker.getOptions().position,
                                pixelOffset: [0, -20],
                                closeButton: true
                            });

                            // Open the popup.
                            if (mapRef) {
                                popup.open(mapRef);
                            }
                        }
                        else {
                            var popUpHtmlContent = ReactDOMServer.renderToString(getPopUpContent(marker.properties.eventId, marker.properties.eventName, marker.properties.eventDate, marker.properties.streetAddress, marker.properties.city, marker.properties.region, marker.properties.country, marker.properties.postalCode, marker.properties.isAttending));
                            var popUpContent = new DOMParser().parseFromString(popUpHtmlContent, "text/xml");

                            var viewDetailsButton = popUpContent.getElementById("viewDetails");
                            if (viewDetailsButton)
                                viewDetailsButton.addEventListener('click', function () {
                                viewDetails(marker.properties.eventId);
                            });

                            var addAttendeeButton = popUpContent.getElementById("addAttendee");
                            if (addAttendeeButton)
                                addAttendeeButton.addEventListener('click', function () {
                                    handleAttend(marker.properties.eventId);
                                });

                            // Create a popup.
                            var popup = new Popup({
                                content: popUpContent.documentElement,
                                position: marker.getOptions().position,
                                pixelOffset: [0, -20],
                                closeButton: true
                            });

                            // Open the popup.
                            if (mapRef) {
                                popup.open(mapRef);
                            }
                        }
                    });

                    // mapRef.events.add('mouseout', marker, (event: any) => popup.close());

                    return marker
                },
                clusterRenderCallback: function (id: any, position: any, properties: any) {
                    const markerCluster = new HtmlMarker({
                        position: position,
                        color: 'DarkViolet',
                        text: properties.point_count_abbreviated,
                    });

                    return markerCluster;
                },
                source: dataSourceRef
            });

            props.multipleEvents.forEach(mobEvent => {
                var position = new data.Point(new data.Position(mobEvent.longitude, mobEvent.latitude));
                var isAtt = 'No';
                if (props.isUserEventDataLoaded) {
                    var isAttending = props.myAttendanceList && (props.myAttendanceList.findIndex((e) => e.id === mobEvent.id) >= 0);
                    isAtt = (isAttending ? 'Yes' : 'No');
                }
                else {
                    isAtt = 'Log in to see your status';
                }

                var properties = {
                    eventId: mobEvent.id,
                    eventName: mobEvent.name,
                    eventDate: mobEvent.eventDate,
                    streetAddress: mobEvent.streetAddress,
                    city: mobEvent.city,
                    region: mobEvent.region,
                    country: mobEvent.country,
                    postalCode: mobEvent.postalCode,
                    isAttending: isAtt,
                    name: mobEvent.name,
                }
                dataSourceRef.add(new data.Feature(position, properties));
            })

            setIsDataSourceLoaded(true);

            function viewDetails(eventId: string) {
                props.onDetailsSelected(eventId);
            }

            function handleAttend(eventId: string) {

                var accounts = msalClient.getAllAccounts();

                if (accounts === null || accounts.length === 0) {
                    msalClient.loginRedirect().then(() => {
                        addAttendee(eventId);
                    })
                }
                else {
                    addAttendee(eventId);
                }
            }

            function addAttendee(eventId: string) {

                const account = msalClient.getAllAccounts()[0];

                var request = {
                    scopes: apiConfig.b2cScopes,
                    account: account
                };

                msalClient.acquireTokenSilent(request).then(tokenResponse => {

                    var eventAttendee = new EventAttendeeData();
                    eventAttendee.userId = props.currentUser.id;
                    eventAttendee.eventId = eventId;

                    var data = JSON.stringify(eventAttendee);

                    const headers = getDefaultHeaders('POST');
                    headers.append('Authorization', 'BEARER ' + tokenResponse.accessToken);

                    // POST request for Add EventAttendee.  
                    fetch('/api/EventAttendees', {
                        method: 'POST',
                        body: data,
                        headers: headers,
                    }).then((response) => response.json())
                        .then(props.onAttendanceChanged())
                })
            }

            function getPopUpContent(eventId: string, eventName: string, eventDate: string, streetAddress: string, city: string, region: string, country: string, postalCode: string, isAttending: string) {

                return (
                    <div className="container-fluid card">
                        <h4>{eventName}</h4>
                        <table>
                            <tbody>
                                <tr>
                                    <td>Event Date:</td>
                                    <td>{eventDate}</td>
                                </tr>
                                <tr>
                                    <td>Location:</td>
                                    <td>{streetAddress}, {city}, {region}, {country}, {postalCode}</td>
                                </tr>
                                <tr>
                                    <td>
                                        <a id="addAttendee" hidden={!props.isUserLoaded || isAttending === "Yes"} className="action" onClick={() => handleAttend(eventId)}>Register to Attend Event</a>
                                        <label hidden={props.isUserLoaded}>Sign-in required</label>
                                        <label hidden={!props.isUserLoaded || isAttending !== 'Yes'}>Yes</label>
                                    </td>
                                    <td>
                                        <a id="viewDetails" className="action" type="button">View Details</a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                );
            }

            //Add marker layer to the map.
            mapRef.layers.add(markerLayer);
        }
    }, [mapRef,
        props,
        props.center,
        props.isEventDataLoaded,
        props.isMapKeyLoaded,
        props.multipleEvents,
        props.currentUser,
        props.isUserLoaded,
        isDataSourceLoaded,
        isMapReady,
        props.onAttendanceChanged]);

    function handleLocationChange(e: any) {
        props.onLocationChange(e);
    }

    return (
        <>
            <MapComponent mapOptions={props.mapOptions} isMapKeyLoaded={props.isMapKeyLoaded} onLocationChange={handleLocationChange} />
        </>
    );
};

export default MapControllerPointCollection;