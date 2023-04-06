import axios from "axios";
import querystring from 'querystring';
import { User, Track, Artist } from "../constants/models";

const apiKey = process.env.REACT_APP_SPOTIFY_API_KEY;

console.log(apiKey);

const url = "https://api.spotify.com/v1/";

// AQDFJ-f-THHnsxErN8x2L3zgyUDOpHNXI8HiR7f5kb-eWqWK3x8rZ_M0HkngpJunnFp_XTz-eEXpYWUEShG0WsPBgZYOgJqVuOmCldNnyz19KcpQ3Mu9sEWLyPlYe_C1f3UohTXVwuqPkm_ejg5TyiAfIeuQNmeyR9PhklI71kfiJwqtQKdv_tuo_U0RCRFr8y9zl43xG3JQGNd79JMJaXKCuIAdeQ
// BQDWT3jDdZAZO3sLLXDknAuI5nfaeTV8pS3wy9VUXeOI2aAjTc_bovcq6Gob3aKP27YGNhxu_8J6wIbdliKenSUEkw18dmve6QIyYfDN7hfr2pPher0IioBDXWBYzt1AYjntCd1uimaFKYYFS3rrJaYVRDKiyFgjHgW6OBgrlCRjcQEbJufQxwcu_LH8nReBO0-umJk

const client_id = "70fb8c5868134dca9c054b90498949e5";
// const client_id = "b2f13d4322d64717a852d0fce66572df";
const redirect_uri = "http://localhost:3000/callback";

let auth: string | undefined = undefined;

const signIn = () => {
    // executes the authorization pipeline
    const scope = 'user-read-private user-top-read';
    window.location.replace('https://accounts.spotify.com/authorize?' + querystring.stringify({
        response_type: 'code',
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
    }));
};

// set the auth code.
const setAuth = async (code: string) => {
    const res = await axios.post('https://accounts.spotify.com/api/token', {
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': 'http://localhost:3000/callback',
        'client_id': client_id,
        'client_secret': apiKey
    }, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
    auth = res.data.access_token;
}

const isSignedIn = () => {
    return auth !== undefined;
}

const getHeaders = () => {
    if (!isSignedIn()) {
        throw Error("Wtf you think u doin?");
    }

    return {
        'Authorization': `Bearer ${auth}`
    }
}

// gets the "me" information 
const getMe = async () => {
    const result = await axios.get(`${url}me`, {
        headers: getHeaders()
    });

    return result.data;
}

const getArtists = async (term: string) => {
    const result = await axios.get(`${url}me/top/artists?${querystring.stringify({
        time_range: term,
        limit: 10,
        offset: 0
    })}`, {headers: getHeaders()});

    return result.data;
}

const getTracks = async (term: string) => {
    const result = await axios.get(`${url}me/top/tracks?${querystring.stringify({
        time_range: term,
        limit: 10,
        offset: 0
    })}`, {headers: getHeaders()});

    return result.data;
}

// Collects
const getUserData: (term: string) => Promise<User> = async (term: string) => {
    const meData = await getMe();
    const artistsData = await getArtists(term);
    const artists: Artist[] = [];
    artistsData.items.forEach((item: any) => {
        artists.push({
            name: item.name,
            image: item.images[0].url
        });
    });
    const tracksData = await getTracks(term);
    const tracks: Track[] = [];
    tracksData.items.forEach((item: any) => {
        tracks.push({
            name: item.name,
            image: item.album.images[0].url,
            artist: {
                name: item.artists[0].name,
                image: ""
            }
        });
    });

    return {
        id: meData.id,
        name: meData.display_name,
        image: meData.images[0].url,
        topTracks: tracks,
        topArtists: artists
    } as User;
}

// attempts to find a song on spotify with the given artist and track
const findSong: (a: string, t: string) => Promise<Track | null> = async (artistName: string, trackName: string) => {
    try {
        const result = await axios.get(`${url}search?${querystring.stringify({
            q: `artist:${artistName} track:${trackName}`,
            type: ['track'],
            limit: 1,
            offset: 0
        })}`, {headers: getHeaders()});

        if (result.data.tracks.items.length === 0) {
            return null;
        }
    
        const trackData = result.data.tracks.items[0];
        const track: Track = {
            artist: {
                name: trackData.artists[0].name,
                image: "", // no artist image, we will only show the album cover.
                url: trackData.artists[0].external_urls.spotify
            },
            name: trackData.name,
            image: trackData.album.images[0].url,
            url: trackData.external_urls.spotify
        };
    
        return track;
    }
    catch (e) {
        return null;
    }
}

export { signIn, setAuth, isSignedIn, getUserData, findSong }