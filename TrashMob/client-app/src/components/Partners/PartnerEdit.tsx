import * as React from 'react'
import UserData from '../Models/UserData';
import { Button, Col, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import PartnerData from '../Models/PartnerData';
import { apiConfig, getDefaultHeaders, msalClient } from '../../store/AuthStore';
import * as Constants from '../Models/Constants';
import * as ToolTips from "../../store/ToolTips";
import PartnerStatusData from '../Models/PartnerStatusData';

export interface PartnerEditDataProps {
    partner: PartnerData;
    partnerStatusList: PartnerStatusData[];
    isPartnerDataLoaded: boolean;
    isUserLoaded: boolean;
    currentUser: UserData;
    onPartnerUpdated: any;
    onEditCanceled: any;
};

export const PartnerEdit: React.FC<PartnerEditDataProps> = (props) => {

    const [name, setName] = React.useState<string>(props.partner.name);
    const [primaryEmail, setPrimaryEmail] = React.useState<string>(props.partner.primaryEmail);
    const [secondaryEmail, setSecondaryEmail] = React.useState<string>(props.partner.secondaryEmail);
    const [primaryPhone, setPrimaryPhone] = React.useState<string>(props.partner.primaryPhone);
    const [secondaryPhone, setSecondaryPhone] = React.useState<string>(props.partner.secondaryPhone);
    const [partnerStatusId, setPartnerStatusId] = React.useState<number>(props.partner.partnerStatusId);
    const [notes, setNotes] = React.useState<string>(props.partner.notes);
    const [nameErrors, setNameErrors] = React.useState<string>("");
    const [primaryEmailErrors, setPrimaryEmailErrors] = React.useState<string>("");
    const [secondaryEmailErrors, setSecondaryEmailErrors] = React.useState<string>("");
    const [primaryPhoneErrors, setPrimaryPhoneErrors] = React.useState<string>("");
    const [secondaryPhoneErrors, setSecondaryPhoneErrors] = React.useState<string>("");
    const [notesErrors, setNotesErrors] = React.useState<string>("");
    const [isSaveEnabled, setIsSaveEnabled] = React.useState<boolean>(false);

    function validateForm() {
        if (name === "" ||
            nameErrors !== "" ||
            notes === "" ||
            notesErrors !== "" ||
            primaryEmail === "" ||
            primaryEmailErrors !== "" ||
            secondaryEmail === "" ||
            secondaryEmailErrors !== "" ||
            primaryPhone === "" ||
            primaryPhoneErrors !== "" ||
            secondaryPhone === "" ||
            secondaryPhoneErrors !== "") {
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

        var partnerData = new PartnerData();
        partnerData.id = props.partner.id;
        partnerData.name = name ?? "";
        partnerData.primaryEmail = primaryEmail ?? "";
        partnerData.secondaryEmail = secondaryEmail ?? "";
        partnerData.primaryPhone = primaryPhone ?? "";
        partnerData.secondaryPhone = secondaryPhone ?? "";
        partnerData.notes = notes ?? "";
        partnerData.partnerStatusId = partnerStatusId ?? 2;
        partnerData.createdByUserId = props.partner.createdByUserId ?? props.currentUser.id;
        partnerData.createdDate = props.partner.createdDate;
        partnerData.lastUpdatedByUserId = props.currentUser.id;

        var data = JSON.stringify(partnerData);

        const account = msalClient.getAllAccounts()[0];

        var request = {
            scopes: apiConfig.b2cScopes,
            account: account
        };

        msalClient.acquireTokenSilent(request).then(tokenResponse => {
            const headers = getDefaultHeaders('PUT');
            headers.append('Authorization', 'BEARER ' + tokenResponse.accessToken);

            fetch('/api/Partners', {
                method: 'PUT',
                body: data,
                headers: headers,
            })
                .then(() => {
                    props.onPartnerUpdated()
                });
        });
    }

    // This will handle Cancel button click event.  
    function handleCancel(event: any) {
        event.preventDefault();
        props.onEditCanceled();
    }

    function handleNameChanged(val: string) {
        if (name === "") {
            setNameErrors("Name cannot be blank.");
        }
        else {
            setNameErrors("");
            setName(val);
        }

        validateForm();
    }

    function handlePrimaryEmailChanged(val: string) {
        var pattern = new RegExp(Constants.RegexEmail);

        if (!pattern.test(val)) {
            setPrimaryEmailErrors("Please enter valid email address.");
        }
        else {
            setPrimaryEmailErrors("");
            setPrimaryEmail(val);
        }

        validateForm();
    }

    function handleSecondaryEmailChanged(val: string) {
        var pattern = new RegExp(Constants.RegexEmail);

        if (!pattern.test(val)) {
            setSecondaryEmailErrors("Please enter valid email address.");
        }
        else {
            setSecondaryEmailErrors("");
            setSecondaryEmail(val);
        }

        validateForm();
    }

    function handlePrimaryPhoneChanged(val: string) {
        var pattern = new RegExp(Constants.RegexPhoneNumber);

        if (!pattern.test(val)) {
            setPrimaryPhoneErrors("Please enter a valid phone number.");
        }
        else {
            setPrimaryPhoneErrors("");
            setPrimaryPhone(val);
        }

        validateForm();
    }

    function handleSecondaryPhoneChanged(val: string) {
        var pattern = new RegExp(Constants.RegexPhoneNumber);

        if (!pattern.test(val)) {
            setSecondaryPhoneErrors("Please enter a valid phone number.");
        }
        else {
            setSecondaryPhoneErrors("");
            setSecondaryPhone(val);
        }

        validateForm();
    }

    function handleNotesChanged(val: string) {
        if (val.length < 0 || val.length > 1000) {
            setNotesErrors("Notes cannot be empty and cannot be more than 1000 characters long.");
        }
        else {
            setNotesErrors("");
            setNotes(val);
        }

        validateForm();
    }

    function renderNameToolTip(props: any) {
        return <Tooltip {...props}>{ToolTips.PartnerRequestName}</Tooltip>
    }

    function renderPartnerStatusToolTip(props: any) {
        return <Tooltip {...props}>{ToolTips.PartnerStatus}</Tooltip>
    }

    function renderPrimaryEmailToolTip(props: any) {
        return <Tooltip {...props}>{ToolTips.PartnerRequestPrimaryEmail}</Tooltip>
    }

    function renderSecondaryEmailToolTip(props: any) {
        return <Tooltip {...props}>{ToolTips.PartnerRequestSecondaryEmail}</Tooltip>
    }

    function renderPrimaryPhoneToolTip(props: any) {
        return <Tooltip {...props}>{ToolTips.PartnerRequestPrimaryPhone}</Tooltip>
    }

    function renderSecondaryPhoneToolTip(props: any) {
        return <Tooltip {...props}>{ToolTips.PartnerRequestSecondaryPhone}</Tooltip>
    }

    function renderNotesToolTip(props: any) {
        return <Tooltip {...props}>{ToolTips.PartnerRequestNotes}</Tooltip>
    }

    function renderCreatedDateToolTip(props: any) {
        return <Tooltip {...props}>{ToolTips.PartnerCreatedDate}</Tooltip>
    }

    function renderLastUpdatedDateToolTip(props: any) {
        return <Tooltip {...props}>{ToolTips.PartnerLastUpdatedDate}</Tooltip>
    }

    function selectPartnerStatus(val: string) {
        setPartnerStatusId(parseInt(val));
    }

    return (
        <div className="container-fluid card">
            <h1>Edit Partner</h1>
            <Form onSubmit={handleSave} >
                <Form.Row>
                    <Col>
                        <Form.Group className="required">
                            <OverlayTrigger placement="top" overlay={renderNameToolTip}>
                                <Form.Label className="control-label">Partner Name:</Form.Label>
                            </OverlayTrigger>
                            <Form.Control type="text" defaultValue={name} maxLength={parseInt('64')} onChange={(val) => handleNameChanged(val.target.value)} required />
                            <span style={{ color: "red" }}>{nameErrors}</span>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="required">
                            <OverlayTrigger placement="top" overlay={renderPartnerStatusToolTip}>
                                <Form.Label className="control-label" htmlFor="Partner Status">Partner Status:</Form.Label>
                            </OverlayTrigger>
                            <div>
                                <select data-val="true" name="partnerStatusId" defaultValue={partnerStatusId} onChange={(val) => selectPartnerStatus(val.target.value)} required>
                                    <option value="">-- Select Partner Status --</option>
                                    {props.partnerStatusList.map(status =>
                                        <option key={status.id} value={status.id}>{status.name}</option>
                                    )}
                                </select>
                            </div>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="required">
                            <OverlayTrigger placement="top" overlay={renderPrimaryEmailToolTip}>
                                <Form.Label className="control-label">Primary Email:</Form.Label>
                            </OverlayTrigger>
                            <Form.Control type="text" defaultValue={primaryEmail} maxLength={parseInt('64')} onChange={(val) => handlePrimaryEmailChanged(val.target.value)} required />
                            <span style={{ color: "red" }}>{primaryEmailErrors}</span>
                        </Form.Group >
                    </Col>
                    <Col>
                        <Form.Group className="required">
                            <OverlayTrigger placement="top" overlay={renderSecondaryEmailToolTip}>
                                <Form.Label className="control-label">Secondary Email:</Form.Label>
                            </OverlayTrigger>
                            <Form.Control type="text" defaultValue={secondaryEmail} maxLength={parseInt('64')} onChange={(val) => handleSecondaryEmailChanged(val.target.value)} required />
                            <span style={{ color: "red" }}>{secondaryEmailErrors}</span>
                        </Form.Group >
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Col>
                        <Form.Group className="required">
                            <OverlayTrigger placement="top" overlay={renderPrimaryPhoneToolTip}>
                                <Form.Label className="control-label">Primary Phone:</Form.Label>
                            </OverlayTrigger>
                            <Form.Control type="text" defaultValue={primaryPhone} maxLength={parseInt('64')} onChange={(val) => handlePrimaryPhoneChanged(val.target.value)} required />
                            <span style={{ color: "red" }}>{primaryPhoneErrors}</span>
                        </Form.Group >
                    </Col>
                    <Col>
                        <Form.Group className="required">
                            <OverlayTrigger placement="top" overlay={renderSecondaryPhoneToolTip}>
                                <Form.Label className="control-label">Secondary Phone:</Form.Label>
                            </OverlayTrigger>
                            <Form.Control type="text" defaultValue={secondaryPhone} maxLength={parseInt('64')} onChange={(val) => handleSecondaryPhoneChanged(val.target.value)} required />
                            <span style={{ color: "red" }}>{secondaryPhoneErrors}</span>
                        </Form.Group >
                    </Col>
                </Form.Row>
                <Form.Group className="required">
                    <OverlayTrigger placement="top" overlay={renderNotesToolTip}>
                        <Form.Label className="control-label">Notes:</Form.Label>
                    </OverlayTrigger>
                    <Form.Control as="textarea" defaultValue={notes} maxLength={parseInt('2048')} rows={5} cols={5} onChange={(val) => handleNotesChanged(val.target.value)} required />
                    <span style={{ color: "red" }}>{notesErrors}</span>
                </Form.Group >
                <Form.Group className="form-group">
                    <Button disabled={!isSaveEnabled} type="submit" className="action btn-default">Save</Button>
                    <Button className="action" onClick={(e) => handleCancel(e)}>Cancel</Button>
                </Form.Group >
                <Form.Row>
                    <Col>
                        <Form.Group>
                            <OverlayTrigger placement="top" overlay={renderCreatedDateToolTip}>
                                <Form.Label className="control-label" htmlFor="createdDate">Created Date:</Form.Label>
                            </OverlayTrigger>
                            <Form.Control type="text" disabled defaultValue={props.partner.createdDate.toString()} />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group>
                            <OverlayTrigger placement="top" overlay={renderLastUpdatedDateToolTip}>
                                <Form.Label className="control-label" htmlFor="lastUpdatedDate">Last Updated Date:</Form.Label>
                            </OverlayTrigger>
                            <Form.Control type="text" disabled defaultValue={props.partner.lastUpdatedDate.toString()} />
                        </Form.Group>
                    </Col>
                </Form.Row>
            </Form >
        </div>
    )
}