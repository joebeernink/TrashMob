import { Guid } from 'guid-typescript';
import * as React from 'react'
import { Button, Col, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { apiConfig, getDefaultHeaders, msalClient } from '../../store/AuthStore';
import { getMediaType } from '../../store/mediaTypeHelper';
import EventMediaData from '../Models/EventMediaData';
import MediaTypeData from '../Models/MediaTypeData';
import UserData from '../Models/UserData';
import * as ToolTips from "../../store/ToolTips";
import * as Constants from '../Models/Constants';

export interface ManageEventMediaProps {
    eventId: string;
    isUserLoaded: boolean;
    currentUser: UserData;
}

export const ManageEventMedia: React.FC<ManageEventMediaProps> = (props) => {
    const [eventMediaId, setEventMediaId] = React.useState<string>(Guid.createEmpty().toString());
    const [eventMedias, setEventMedias] = React.useState<EventMediaData[]>([]);
    const [eventMediaUrl, setEventMediaUrl] = React.useState<string>("");
    const [eventMediaTypeId, setEventMediaTypeId] = React.useState<number>(0);
    const [eventMediaUsageTypeId, setEventMediaUsageTypeId] = React.useState<number>(0);
    const [mediaTypeList, setMediaTypeList] = React.useState<MediaTypeData[]>([]);
    const [isEditOrAdd, setIsEditOrAdd] = React.useState<boolean>(false);
    const [isEventMediaDataLoaded, setIsEventMediaDataLoaded] = React.useState<boolean>(false);
    const [isSaveEnabled, setIsSaveEnabled] = React.useState<boolean>(false);

    React.useEffect(() => {
        const headers = getDefaultHeaders('GET');

        fetch('/api/mediatypes', {
            method: 'GET',
            headers: headers,
        })
            .then(response => response.json() as Promise<Array<any>>)
            .then(data => {
                setMediaTypeList(data);
            }).then(() => {
                fetch('/api/eventmedias/' + props.eventId, {
                    method: 'GET',
                    headers: headers,
                })
                    .then(response => response.json() as Promise<Array<EventMediaData>>)
                    .then(data => {
                        setEventMedias(data);
                        setIsEventMediaDataLoaded(true);
                        setIsEditOrAdd(false);
                    });
            });
    }, [props.eventId])

    function validateForm() {
        if (eventMediaUrl === "") {
            setIsSaveEnabled(false);
        }
        else {
            setIsSaveEnabled(true);
        }
    }

    // This will handle the submit form event.  
    function handleSave(event: any) {
        event.preventDefault();

        if (!isSaveEnabled) {
            return;
        }

        setIsSaveEnabled(false);

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
            if (eventMediaId === Guid.EMPTY) {
                method = 'PUT';
            }

            var eventMediaData = new EventMediaData();
            eventMediaData.mediaUrl = eventMediaUrl ?? "";
            eventMediaData.eventId = props.eventId;
            eventMediaData.createdByUserId = props.currentUser.id;
            eventMediaData.mediaTypeId = eventMediaTypeId ?? 0;
            eventMediaData.mediaUsageTypeId = eventMediaUsageTypeId ?? 0;

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
            const headers = getDefaultHeaders('POST');
            headers.append('Authorization', 'BEARER ' + tokenResponse.accessToken);
            fetch('/api/eventmedias/' + props.eventId, {
                method: 'GET',
                headers: headers,
            })
                .then(response => response.json() as Promise<Array<EventMediaData>>)
                .then(data => {
                    setIsEventMediaDataLoaded(false);
                    setEventMedias(data);
                    setIsEventMediaDataLoaded(true);
                    setIsEditOrAdd(false);
                });
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

    function selectMediaType(val: string) {
        setEventMediaTypeId(parseInt(val));

        // Todo, change this default
        setEventMediaUsageTypeId(1);

        validateForm();
    }

    function handleEventMediaUrlChanged(val: string) {
        setEventMediaUrl(val);

        validateForm();
    }

    function renderEventMediaYouTubeVideoIdToolTip(props: any) {
        return <Tooltip {...props}>{ToolTips.EditEventMediaYouTubeVideoId}</Tooltip>
    }

    function renderEventMediaInstagramUrlToolTip(props: any) {
        return <Tooltip {...props}>{ToolTips.EditEventMediaInstagramUrl}</Tooltip>
    }

    function renderMediaTypeToolTip(props: any) {
        return <Tooltip {...props}>{ToolTips.MediaType}</Tooltip>
    }

    function addEventMedia() {
        setIsEventMediaDataLoaded(true);
        setIsEditOrAdd(true);
    }

    function editEventMedia(mediaId: string) {
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
                    setEventMediaId(data.id);
                    setEventMediaUrl(data.mediaUrl);
                    setEventMediaTypeId(data.mediaTypeId);
                    setIsEventMediaDataLoaded(true);
                    setIsEditOrAdd(true);
                });
        });
    }

    function renderEventMediaTable(eventMedias: EventMediaData[], eventMediaTypeList: MediaTypeData[]) {
        return (
            <div>
                <table className='table table-striped' aria-labelledby="tableLabel" width='100%'>
                    <thead>
                        <tr>
                            <th>Media Type</th>
                            <th>Media</th>
                        </tr>
                    </thead>
                    <tbody>
                        {eventMedias.map(eventMedia =>
                            <tr key={eventMedia.id.toString()}>
                                <td>{eventMedia.mediaUrl}</td>
                                <td>{getMediaType(eventMediaTypeList, eventMedia.mediaTypeId)}</td>
                                <td>
                                    <Button className="action" onClick={() => editEventMedia(eventMedia.id)}>Edit Event Media</Button>
                                    <Button className="action" onClick={() => removeEventMedia(eventMedia.id, eventMedia.mediaUrl)}>Remove Event Media</Button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <Button className="action" onClick={() => addEventMedia()}>Add Event Media</Button>
            </div>
        );
    }

    function renderEditEventMedia() {
        return (
            <div>
                <Form onSubmit={handleSave}>
                    <Form.Row>
                        <input type="hidden" name="Id" value={eventMediaId.toString()} />
                    </Form.Row>
                    <Button disabled={!isSaveEnabled} className="action" onClick={(e) => handleSave(e)}>Save</Button>
                    <Col>
                        <Form.Group>
                            <OverlayTrigger placement="top" overlay={renderMediaTypeToolTip}>
                                <Form.Label className="control-label" htmlFor="MediaType">Media Type:</Form.Label>
                            </OverlayTrigger>
                            <div>
                                <select data-val="true" name="mediaTypeId" defaultValue={eventMediaTypeId} onChange={(val) => selectMediaType(val.target.value)} required>
                                    <option value="">-- Select Media Type --</option>
                                    {mediaTypeList.map(type =>
                                        <option key={type.id} value={type.id}>{type.name}</option>
                                    )}
                                </select>
                            </div>
                        </Form.Group>
                    </Col>
                    <Form.Row>
                        <Col>
                            <Form.Group className="required">
                                {() => {
                                    if (eventMediaTypeId === Constants.MediaTypeYouTube) {
                                        <OverlayTrigger placement="top" overlay={renderEventMediaYouTubeVideoIdToolTip}>
                                            <Form.Label className="control-label" htmlFor="EventMediaUrl">YouTube Video Id:</Form.Label>
                                        </OverlayTrigger>
                                    }
                                    else {
                                        <OverlayTrigger placement="top" overlay={renderEventMediaInstagramUrlToolTip}>
                                            <Form.Label className="control-label" htmlFor="EventMediaUrl">Instagram Url:</Form.Label>
                                        </OverlayTrigger>
                                    }
                                }
                                }
                                <Form.Control type="text" name="eventMediaUrl" defaultValue={eventMediaUrl} onChange={val => handleEventMediaUrlChanged(val.target.value)} maxLength={parseInt('1024')} required />
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
                {!isEventMediaDataLoaded && <p><em>Loading...</em></p>}
                {isEventMediaDataLoaded && eventMedias && renderEventMediaTable(eventMedias, mediaTypeList)}
                {isEditOrAdd && renderEditEventMedia()}
            </div>
        </>
    );
}
