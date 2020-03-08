const axios = require('axios')
const cheerio = require('cheerio')

const STELLAR_REGEX = 'G([a-zA-z0-9]){0,55}'

const fetchURL = async (url) => {
    const { data } = await axios.get(url);
    return data;
}

const select = (html, selector) => {
    const $ = cheerio.load(html);
    return $(selector);
}

const findToken = async (url) => {
    const client_html = await fetchURL(url);
    const domain = url.match('\/\/(.[^\/]+)')[1]
    const domainName = domain.split('.')[1]
    let token = "";
    switch (domainName) {
        case 'youtube':
            const link = select(client_html, '.yt-user-info a').attr('href');
            about_url = 'https://' + domain + link + '/about';
            const about_html = await fetchURL(about_url);
            const description = select(about_html, '.about-description pre').text();
            const address = description.match(STELLAR_REGEX)[0]
            token = address;
            break;
        default:
            console.log(domainName);
    }
    return token;
}

module.exports = findToken;