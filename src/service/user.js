import {DUMMY_RESPONSE, BASEURL, del, getJson, post, put} from "./common";

export async function register(username, password) {
    const url = `${BASEURL}/users/register`;
    return post(url, {username, password});
}

export async function logout() {
    try {
        const response = await fetch(`${BASEURL}/logins/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        const result = await response.json();
        if (result.code === 200 && result.message === "success") {
            alert( result.data);
            return result;
        } else {
            throw new Error(result.data || '登出失败');
        }
    } catch (error) {
        console.error('登出请求失败:', error);
        throw error;
    }
}


export async function addAddress(username, password) {
    const url = `${BASEURL}/users/login`;
    return post(url, {username, password});
}