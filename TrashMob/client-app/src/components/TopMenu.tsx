import * as React from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { msalClient } from '../store/AuthStore';
import UserData from './Models/UserData';
import logo from './assets/logo.svg'
import { Button, Dropdown, Nav } from 'react-bootstrap';
import './assets/styles/header.css';
import { Person, PersonCircle, PlusLg, Power, Speedometer2 } from 'react-bootstrap-icons';

interface TopMenuProps extends RouteComponentProps<any> {
    isUserLoaded: boolean;
    currentUser: UserData;
}

const TopMenu: React.FC<TopMenuProps> = (props) => {
    const [userName, setUserName] = React.useState<string>("");
    const [isUserLoaded, setIsUserLoaded] = React.useState<boolean>(props.isUserLoaded);

    React.useEffect(() => {
        if (props.currentUser && props.isUserLoaded) {
            setUserName(props.currentUser.userName);
        }

        setIsUserLoaded(props.isUserLoaded);
    }, [props.currentUser, props.isUserLoaded])

    const mainNavItems = [
        { name: "Home", url: '/' },
        // { name: "What is TrashMob?", url: "/aboutus" },
        { name: "Get Started", url: "/gettingstarted" },
        { name: "My Dashboard", url: "/mydashboard" }
    ];

    function signOut(e: any) {
        e.preventDefault();
        const logoutRequest = {
            account: msalClient.getActiveAccount(),

        }

        msalClient.logout(logoutRequest);
    }

    function signIn(e: any) {
        e.preventDefault();
        msalClient.loginRedirect();
    }

    return (
        <header className="tm-header">
            <div className="container bg-light tm-mainNav">
                <div className="navbar navbar-expand-lg navbar-light navbar-static-top" id="navbar">
                    <a className="navbar-brand" href="/" id="navbarBrand"><img src={logo} alt="TrashMob Logo" id="logo" /></a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="navbar-collapse collapse" id="navbarNav">
                        {/* <Navbar.Toggle aria-controls="basic-navbar-nav" /> */}
                        <ul className="nav navbar-nav">
                            {mainNavItems.map(item => (
                                <li><Nav.Link href={item.url} key={item.name}>{item.name}</Nav.Link></li>
                            ))}
                        </ul>
                        <Button hidden={isUserLoaded} className="btn btn-primary" onClick={(e) => signIn(e)} id="loginBtn">Sign in</Button>
                        <Button hidden={isUserLoaded} className="btn btn-primary" onClick={(e) => signIn(e)} id="registerBtn">Sign up</Button>
                        <Dropdown hidden={!isUserLoaded}>
                            <Dropdown.Toggle id="userBtn" variant="light">
                                <PersonCircle className="mr-3" size={32} color="#96ba00" aria-labelledby="userName" />
                                {userName ? userName : 'Welcome'}
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="shadow border-0">
                                <Dropdown.Item eventKey="1" href="/mydashboard"><Speedometer2 aria-hidden="true" />My dashboard</Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item eventKey="2" href="/userprofile"><Person aria-hidden="true" />My profile</Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item eventKey="3" href="/notificationpreferences"><Person aria-hidden="true" />Notification preferences</Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item eventKey="4" href="/manageeventdashboard"><PlusLg aria-hidden="true" />Add event</Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item eventKey="5" href="/partnerdashboard"><PlusLg aria-hidden="true" />Partner dashboard</Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item eventKey="6" href="/siteadmin" disabled={!props.currentUser.isSiteAdmin}><PlusLg aria-hidden="true" />Site administration</Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item eventKey="7" onClick={(e) => signOut(e)}><Power aria-hidden="true" />Sign out</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default withRouter(TopMenu);