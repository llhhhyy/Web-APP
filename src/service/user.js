import { DUMMY_RESPONSE, BASEURL, del, getJson, post, put } from "./common";

export async function register(username, password) {
    const url = `${BASEURL}/users/register`;
    return post(url, { username, password });
}

export async function addAddress(username, password) {    const url = `${BASEURL}/users/login`;return post(url, { username, password });
}