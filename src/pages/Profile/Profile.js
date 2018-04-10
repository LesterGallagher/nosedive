import React, { Component } from 'react';
import './Profile.css';
import UserStore from '../../stores/UserStore';
import MyProfile from '../../components/MyProfile/MyProfile';
import OtherProfile from '../../components/OtherProfile/OtherProfile';

class Profile extends Component {
    constructor(props) {
        super();
        this.state = {
            userid: props.userid || props.match.params.userid,
            loggedin: UserStore.loggedin,
            loggedinUser: UserStore.user,
            user: UserStore.users[props.userid],
        };
        this.handleUserStoreChange = this.handleUserStoreChange.bind(this);
        if (UserStore.users[props.userid] === undefined) {
            this.state.user = null;
            UserStore.fetchUser(this.state.userid);
        }
    }

    componentWillMount() {
        UserStore.on('change', this.handleUserStoreChange);
    }

    componentWillUnmount() {
        UserStore.removeListener('change', this.handleUserStoreChange);
    }

    handleUserStoreChange() {
        this.setState({loggedin: UserStore.loggedin, loggedinUser: UserStore.user, user: UserStore.users[this.state.userid]}, () => {
            if (this.state.user === undefined) {
                UserStore.users[this.state.userid] = null; // fetching
                UserStore.fetchUser(this.state.userid);
            }
        });
    }

    isMyProfile() {
        console.log('ismyprofile')
        return UserStore.loggedin && UserStore.user.id === this.state.userid;
    }
    
    render() {
        if (this.isMyProfile()) {
            return <div className="Profile">
                <MyProfile/>
            </div>
        }
        else {
            return <div className="Profile">
                <OtherProfile userid={this.state.userid} />
            </div>
        }
    }

    getRating() {
        if (this.state.user && typeof this.state.user.avgreceivedrating === 'number')
            return this.state.user.avgreceivedrating;
        return null;
    }
}

export default Profile;
