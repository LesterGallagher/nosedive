import UserStore from "./stores/UserStore";
import Axios from "axios";

import conf from './conf.json';

export const audio = {
    star1: new Audio('assets/media/star1.mp3'),
    star2: new Audio('assets/media/star2.mp3'),
    star3: new Audio('assets/media/star3.mp3'),
    star4: new Audio('assets/media/star4.mp3'),
    star5: new Audio('assets/media/star5.mp3'),
    rate: new Audio('assets/media/rate.mp3'),
    swoosh: new Audio('assets/media/swoosh.mp3'),
    send: new Audio('assets/media/send.mp3'),
}


export const pushRating = (receiverid, rating) => {
    if (!UserStore.loggedin) throw Error('You cannot give ratings when your not logged in');
    const { email, password } = UserStore.user;
    return Axios.post(`${conf.apiurl}/userratings`, {receiverid, rating, email, password});
}

