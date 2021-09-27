import { Guid } from 'guid-typescript';
import * as React from 'react'
import { Button, Col, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { apiConfig, getDefaultHeaders, msalClient } from '../../store/AuthStore';
import EventMediaData from '../Models/EventMediaData';
import UserData from '../Models/UserData';
import * as ToolTips from "../../store/ToolTips";
import * as Constants from '../Models/Constants';

export interface ManageEventMediaProps {
    eventId: string;
    isUserLoaded: boolean;
    currentUser: UserData;
}

export const ManageEventMedia: React.FC<ManageEventMediaProps> = (props) => {
    const [eventYouTubeMediaId, setEventYouTubeMediaId] = React.useState<string>(Guid.createEmpty().toString());
    const [eventInstagramMediaId, setEventInstagramMediaId] = React.useState<string>(Guid.createEmpty().toString());
    const [eventYouTubeMedias, setEventYouTubeMedias] = React.useState<EventMediaData[]>([]);
    const [eventInstagramMedias, setEventInstagramMedias] = React.useState<EventMediaData[]>([]);
    const [eventYouTubeMediaUrl, setEventYouTubeMediaUrl] = React.useState<string>("");
    const [eventInstagramMediaUrl, setEventInstagramMediaUrl] = React.useState<string>("");
    const [eventYouTubeMediaTypeId, setEventYouTubeMediaTypeId] = React.useState<number>(Constants.MediaTypeYouTube);
    const [eventInstagramMediaTypeId, setEventInstagramMediaTypeId] = React.useState<number>(Constants.MediaTypeInstagram);
    const [isEditOrAddYouTube, setIsEditOrAddYouTube] = React.useState<boolean>(false);
    const [isEditOrAddInstagram, setIsEditOrAddInstagram] = React.useState<boolean>(false);
    const [isEventYouTubeMediaDataLoaded, setIsEventYouTubeMediaDataLoaded] = React.useState<boolean>(false);
    const [isEventInstagramMediaDataLoaded, setIsEventInstagramMediaDataLoaded] = React.useState<boolean>(false);

    React.useEffect(() => {

        const headers = getDefaultHeaders('GET');
        
        fetch('/api/eventmedias/' + props.eventId + '/' + Constants.MediaTypeYouTube, {
            method: 'GET',
            headers: headers,
        })
            .then(response => response.json() as Promise<Array<EventMediaData>>)
            .then(data => {
                setEventYouTubeMedias(data);
                setIsEventYouTubeMediaDataLoaded(true);
                setIsEditOrAddYouTube(false);
            })
            .then(() => {
                fetch('/api/eventmedias/' + props.eventId + '/' + Constants.MediaTypeInstagram, {
                    method: 'GET',
                    headers: headers,
                })
                    .then(response => response.json() as Promise<Array<EventMediaData>>)
                    .then(data => {
                        setEventInstagramMedias(data);
                        setIsEventInstagramMediaDataLoaded(true);
                        setIsEditOrAddInstagram(false);
                    })

            })
    }, [props.eventId])

    // This will handle the submit form event.  
    function handleYouTubeSave(event: any) {
        event.preventDefault();

        // PUT request for Edit Event.  
        const account = msalClient.getAllAccounts()[0];

        var request = {
            scopes: apiConfig.b2cScopes,
            account: account
        };

        return msalClient.acquireTokenSilent(request).then(tokenResponse => {
            const headers = getDefaultHeaders('POST');
            headers.append('Authorization', 'BEARER ' + tokenResponse.accessToken);

            var method = 'POST';
            if (eventYouTubeMediaId !== Guid.EMPTY) {
                method = 'PUT';
            }

            var eventMediaData = new EventMediaData();
            eventMediaData.mediaUrl = eventYouTubeMediaUrl ?? "";
            eventMediaData.eventId = props.eventId;
            eventMediaData.createdByUserId = props.currentUser.id;
            eventMediaData.mediaTypeId = eventYouTubeMediaTypeId ?? Constants.MediaTypeYouTube;

            // Todo: Add ability to select before or after event
            eventMediaData.mediaUsageTypeId = Constants.MediaUsageTypeAfterEvent;

            var evtmediadatas: EventMediaData[] = [];
            evtmediadatas.push(eventMediaData);
            var evtmediadata = JSON.stringify(evtmediadatas);

            fetch('/api/eventmedias/' + props.currentUser.id, {
                method: method,
                headers: headers,
                body: evtmediadata,
            }).then(() => {
                onEventMediasUpdated();
            });
        })
    }

    // This will handle the submit form event.  
    function handleInstagramSave(event: any) {
        event.preventDefault();

        // PUT request for Edit Event.  
        const account = msalClient.getAllAccounts()[0];

        var request = {
            scopes: apiConfig.b2cScopes,
            account: account
        };

        return msalClient.acquireTokenSilent(request).then(tokenResponse => {
            const headers = getDefaultHeaders('POST');
            headers.append('Authorization', 'BEARER ' + tokenResponse.accessToken);

            var method = 'POST';
            if (eventInstagramMediaId !== Guid.EMPTY) {
                method = 'PUT';
            }

            var eventMediaData = new EventMediaData();
            eventMediaData.mediaUrl = eventInstagramMediaUrl ?? "";
            eventMediaData.eventId = props.eventId;
            eventMediaData.createdByUserId = props.currentUser.id;
            eventMediaData.mediaTypeId = eventInstagramMediaTypeId ?? Constants.MediaTypeInstagram;

            // Todo: Add ability to select before or after event
            eventMediaData.mediaUsageTypeId = Constants.MediaUsageTypeAfterEvent;

            var evtmediadatas: EventMediaData[] = [];
            evtmediadatas.push(eventMediaData);
            var evtmediadata = JSON.stringify(evtmediadatas);

            fetch('/api/eventmedias/' + props.currentUser.id, {
                method: method,
                headers: headers,
                body: evtmediadata,
            }).then(() => {
                onEventMediasUpdated();
            });
        })
    }

    function onEventMediasUpdated() {
        const account = msalClient.getAllAccounts()[0];

        var request = {
            scopes: apiConfig.b2cScopes,
            account: account
        };

        return msalClient.acquireTokenSilent(request).then(tokenResponse => {
            const headers = getDefaultHeaders('GET');
            headers.append('Authorization', 'BEARER ' + tokenResponse.accessToken);

            fetch('/api/eventmedias/' + props.eventId + '/' + Constants.MediaTypeYouTube, {
                method: 'GET',
                headers: headers,
            })
                .then(response => response.json() as Promise<Array<EventMediaData>>)
                .then(data => {
                    setEventYouTubeMedias(data);
                    setIsEventYouTubeMediaDataLoaded(true);
                    setIsEditOrAddYouTube(false);
                })
                .then(() => {
                    fetch('/api/eventmedias/' + props.eventId + '/' + Constants.MediaTypeInstagram, {
                        method: 'GET',
                        headers: headers,
                    })
                        .then(response => response.json() as Promise<Array<EventMediaData>>)
                        .then(data => {
                            setEventInstagramMedias(data);
                            setIsEventInstagramMediaDataLoaded(true);
                            setIsEditOrAddInstagram(false);
                        })

                })
        })
    }

    function removeEventMedia(eventMediaId: string, mediaUrl: string) {
        if (!window.confirm("Please confirm that you want to remove Event Media with Url: '" + mediaUrl + "' as a media from this Event?"))
            return;
        else {
            const account = msalClient.getAllAccounts()[0];

            var request = {
                scopes: apiConfig.b2cScopes,
                account: account
            };

            msalClient.acquireTokenSilent(request).then(tokenResponse => {
                const headers = getDefaultHeaders('DELETE');
                headers.append('Authorization', 'BEARER ' + tokenResponse.accessToken);

                fetch('/api/eventMedias/' + eventMediaId, {
                    method: 'DELETE',
                    headers: headers,
                })
                    .then(() => {
                        onEventMediasUpdated()
                    });
            });
        }
    }

    function handleEventYouTubeMediaUrlChanged(val: string) {
        setEventYouTubeMediaUrl(val);
    }

    function handleEventInstagramMediaUrlChanged(val: string) {
        setEventInstagramMediaUrl(val);
    }

    function renderEventYouTubeMediaVideoIdToolTip(props: any) {
        return <Tooltip {...props}>{ToolTips.EditEventMediaYouTubeVideoId}</Tooltip>
    }

    function renderEventInstagramEmbedMediaToolTip(props: any) {
        return <Tooltip {...props}>{ToolTips.EditEventMediaInstagramEmbed}</Tooltip>
    }

    function addEventYouTubeMedia() {
        setIsEventYouTubeMediaDataLoaded(true);
        setIsEditOrAddYouTube(true);
    }

    function addEventInstagramMedia() {
        setIsEventInstagramMediaDataLoaded(true);
        setIsEditOrAddInstagram(true);
    }

    function editEventYouTubeMedia(mediaId: string) {
        const account = msalClient.getAllAccounts()[0];

        var request = {
            scopes: apiConfig.b2cScopes,
            account: account
        };

        msalClient.acquireTokenSilent(request).then(tokenResponse => {
            const headers = getDefaultHeaders('GET');
            headers.append('Authorization', 'BEARER ' + tokenResponse.accessToken);

            fetch('/api/eventMedias/bymediaid/' + mediaId, {
                method: 'GET',
                headers: headers,
            })
                .then(response => response.json() as Promise<EventMediaData>)
                .then(data => {
                    setEventYouTubeMediaId(data.id);
                    setEventYouTubeMediaUrl(data.mediaUrl);
                    setEventYouTubeMediaTypeId(data.mediaTypeId);
                    setIsEventYouTubeMediaDataLoaded(true);
                    setIsEditOrAddYouTube(true);
                });
        });
    }

    function editEventInstagramMedia(mediaId: string) {
        const account = msalClient.getAllAccounts()[0];

        var request = {
            scopes: apiConfig.b2cScopes,
            account: account
        };

        msalClient.acquireTokenSilent(request).then(tokenResponse => {
            const headers = getDefaultHeaders('GET');
            headers.append('Authorization', 'BEARER ' + tokenResponse.accessToken);

            fetch('/api/eventMedias/bymediaid/' + mediaId, {
                method: 'GET',
                headers: headers,
            })
                .then(response => response.json() as Promise<EventMediaData>)
                .then(data => {
                    setEventInstagramMediaId(data.id);
                    setEventInstagramMediaUrl(data.mediaUrl);
                    setEventInstagramMediaTypeId(data.mediaTypeId);
                    setIsEventInstagramMediaDataLoaded(true);
                    setIsEditOrAddInstagram(true);
                });
        });
    }

    function renderEventYouTubeMediaTable(eventMedias: EventMediaData[]) {
        return (
            <div>
                <table className='table table-striped' aria-labelledby="tableLabel" width='100%'>
                    <thead>
                        <tr>
                            <th>YouTube Video Id</th>
                        </tr>
                    </thead>
                    <tbody>
                        {eventMedias.map(eventMedia =>
                            <tr key={eventMedia.id.toString()}>
                                <td>{eventMedia.mediaUrl}</td>
                                <td>
                                    <Button className="action" onClick={() => editEventYouTubeMedia(eventMedia.id)}>Edit YouTube Link</Button>
                                    <Button className="action" onClick={() => removeEventMedia(eventMedia.id, eventMedia.mediaUrl)}>Remove YouTube Link</Button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <Button className="action" onClick={() => addEventYouTubeMedia()}>Add YouTube Video</Button>
            </div>
        );
    }

    function renderEventInstagramMediaTable(eventMedias: EventMediaData[]) {
        return (
            <div>
                <table className='table table-striped' aria-labelledby="tableLabel" width='100%'>
                    <thead>
                        <tr>
                            <th>Instagram Embed Content</th>
                        </tr>
                    </thead>
                    <tbody>
                        {eventMedias.map(eventMedia =>
                            <tr key={eventMedia.id.toString()}>
                                <td>{eventMedia.mediaUrl}</td>
                                <td>
                                    <Button className="action" onClick={() => editEventInstagramMedia(eventMedia.id)}>Edit Instagram Post Embed Content</Button>
                                    <Button className="action" onClick={() => removeEventMedia(eventMedia.id, eventMedia.mediaUrl)}>Remove Instagram Post</Button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <Button className="action" onClick={() => addEventInstagramMedia()}>Add Instagram Post</Button>
            </div>
        );
    }

    function renderEditEventYouTubeMedia() {
        return (
            <div>
                <Form onSubmit={handleYouTubeSave}>
                    <Form.Row>
                        <input type="hidden" name="Id" value={eventYouTubeMediaId.toString()} />
                    </Form.Row>
                    <Button className="action" onClick={(e) => handleYouTubeSave(e)}>Save</Button>
                    <Form.Row>
                        <Col>
                            <Form.Group>
                                <OverlayTrigger placement="top" overlay={renderEventYouTubeMediaVideoIdToolTip}>
                                    <Form.Label htmlFor="EventMediaUrl">YouTube Video Id:</Form.Label>
                                </OverlayTrigger>
                                <Form.Control type="text" name="eventMediaUrl" defaultValue={eventYouTubeMediaUrl} onChange={val => handleEventYouTubeMediaUrlChanged(val.target.value)} maxLength={parseInt('1024')} required />
                            </Form.Group>
                        </Col>
                    </ Form.Row>
                </Form>
            </div>
        );
    }

    function renderEditEventInstagramMedia() {
        return (
            <div>
                <Form onSubmit={handleInstagramSave}>
                    <Form.Row>
                        <input type="hidden" name="Id" value={eventInstagramMediaId.toString()} />
                    </Form.Row>
                    <Button className="action" onClick={(e) => handleInstagramSave(e)}>Save</Button>
                    <Form.Row>
                        <Col>
                            <Form.Group>
                                <OverlayTrigger placement="top" overlay={renderEventInstagramEmbedMediaToolTip}>
                                    <Form.Label htmlFor="EventMediaUrl">Instagram Embed:</Form.Label>
                                </OverlayTrigger>
                                <Form.Control as="textarea" name="eventMediaUrl" defaultValue={eventInstagramMediaUrl} onChange={val => handleEventInstagramMediaUrlChanged(val.target.value)} rows={5} cols={5} required />
                            </Form.Group>
                        </Col>
                    </ Form.Row>
                </Form>
            </div>
        );
    }

    return (
        <>
            <div>
                {(!isEventYouTubeMediaDataLoaded || !isEventInstagramMediaDataLoaded) && <p><em>Loading...</em></p>}
                {isEventYouTubeMediaDataLoaded && eventYouTubeMedias && renderEventYouTubeMediaTable(eventYouTubeMedias)}
                {isEventInstagramMediaDataLoaded && eventInstagramMedias && renderEventInstagramMediaTable(eventInstagramMedias)}
                {isEditOrAddYouTube && renderEditEventYouTubeMedia()}
                {isEditOrAddInstagram && renderEditEventInstagramMedia()}
            </div>
        </>
    );
}
