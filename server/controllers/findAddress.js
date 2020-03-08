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

const getYouTube = async (username) => {
    let about_url = `https://www.youtube.com/${username}/about`;
    const about_html = await fetchURL(about_url);
    const description = select(about_html, '.about-description pre').text();
    const match = description.match(STELLAR_REGEX)
    if (match) return match[0]
    return null;
}

const getGitHub = async (username) => {
    const { data } = await axios.get(`https://api.github.com/users/${username}`);
    const { bio } = data || {};
    return bio && bio.match(STELLAR_REGEX)[0];
}

const findAddress = async (url, username) => {
    const domain = url.match('\/\/(.[^\/]+)')[1].split('.')[1];
    let address = null;
    switch (domain) {
        case 'youtube':
            address = await getYouTube(username);
        case 'github':
            address = await getGitHub(username);
            break;
        default:
            break;
    }
    console.log(address)
    return address;
}

findAddress("https://www.youtube.com/watch?v=XSrwhmU5YyU", "ZeefumD")
// findAddress("https://www.github.com/mufeez-amjad", "mufeez-amjad")