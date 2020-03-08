require('dotenv').config();

const axios = require('axios')
const cheerio = require('cheerio')

const STELLAR_REGEX = 'G([a-zA-z0-9]){55}'

const fetchURL = async (url) => {
    const { data } = await axios.get(url);
    return data;
}

const select = (html, selector) => {
    const $ = cheerio.load(html);
    return $(selector);
}

const regexAddress = (text) => {
    if (text) {
        const match = text.match(STELLAR_REGEX)
        if (match) return match[0]
    }

    return null;
}

const getYouTube = async (username) => {
    const resp  = await axios.get("https://www.googleapis.com/youtube/v3/channels", {
        params: {
            part: "snippet",
            forUsername: username,
            key: process.env.YOUTUBE_API_KEY
        }
    }) 
    const { items } = resp.data || {};
    const { snippet } = items[0]
    return regexAddress(snippet.description)
}

const getGitHub = async (username) => {
    const { data } = await axios.get(`https://api.github.com/users/${username}`);
    const { bio } = data || {};
    return regexAddress(bio);
}

const getTwitch = async (username) => {
    const { data } = await axios.get(`https://api.twitch.tv/helix/users`, {
        headers: { 
            'Client-ID': process.env.TWITCH_ID
        },
        params: {
            login: username
        }
    })
    const { description } = data.data[0] || {}
    return regexAddress(description)
}

const findAddress = async (url, username) => {
    const domain = url.match('\/\/(.[^\/]+)')[1].split('.')[1];
    let address = null;
    switch (domain) {
        case 'youtube':
            address = await getYouTube(username);
            break;
        case 'github':
            address = await getGitHub(username);
            break;
        case 'twitch':
            address = await getTwitch(username);
            break;
        default:
            break;
    }
    console.log(address)
    return address;
}

module.exports = findAddress;
// findAddress("https://www.youtube.com/watch?v=XSrwhmU5YyU", "ZeefumD")
// findAddress("https://www.github.com/mufeez-amjad", "mufeez-amjad")
// findAddress("https://www.twitch.tv/settings/profile", "xxravagegunxx")