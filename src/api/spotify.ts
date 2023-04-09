import axios from "axios";
import querystring from 'querystring';
import { User, Track, Artist, Playlist, TrackResults } from "../constants/models";

const apiKey = process.env.REACT_APP_SPOTIFY_API_KEY;

const url = "https://api.spotify.com/v1/";

const client_id = "70fb8c5868134dca9c054b90498949e5";
// const redirect_uri = "https://music-gpt.herokuapp.com/callback";
const redirect_uri = "http://localhost:3000/callback";

let auth: string | undefined = undefined;

const signIn = () => {
    // executes the authorization pipeline
    const scope = 'user-read-private user-top-read playlist-modify-private';
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
        'redirect_uri': redirect_uri,
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
        limit: 5,
        offset: 0
    })}`, {headers: getHeaders()});

    return result.data;
}

const getTracks = async (term: string) => {
    const result = await axios.get(`${url}me/top/tracks?${querystring.stringify({
        time_range: term,
        limit: 5,
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
            },
            id: item.id,
            duration_ms: item.duration_ms
        });
    });

    return {
        id: meData.id,
        name: meData.display_name,
        image: meData.images.length > 0 ? meData.images[0].url : "https://static.thenounproject.com/png/5034901-200.png",
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
            id: trackData.id,
            name: trackData.name,
            image: trackData.album.images[0].url,
            duration_ms: trackData.duration_ms,
            url: trackData.external_urls.spotify
        };
    
        return track;
    }
    catch (e) {
        return null;
    }
}

const generatePlaylist: (userID: string, tracks: TrackResults) => Promise<Playlist | null> = async (userID: string, tracks: TrackResults) => {
    try {
        const playlistResponse = await axios.post(`${url}users/${userID}/playlists`,
            {
                name: tracks.playlist_title,
                public: false,
                description: tracks.playlist_description
            },
            {
                headers: getHeaders()    
            }
        );
        const id = playlistResponse.data.id;
        const playlist: Playlist = {
            url: playlistResponse.data.external_urls.spotify,
            name: tracks.playlist_title,
            tracks: tracks.tracks
        }

        const uris = tracks.tracks.map((track: Track, _: number) => `spotify:track:${track.id}`).join(',');

        // add all tracks to the playlist.
        await axios.post(`${url}playlists/${id}/tracks?${querystring.stringify({
            uris
        })}`,
            {}, // nothing in body
            {
                headers: getHeaders()
            });
        

        return playlist;
    }
    catch (e) {
        console.log(e);
        return null;
    }
}

// returns up to 5 artists from the given search term
const searchArtists: (term: string) => Promise<Artist[]> = async (term: string) => {
    const result = await axios.get(`${url}search?${querystring.stringify({
        q: `artist:${term}`,
        type: ['artist'],
        limit: 5,
        offset: 0
    })}`, {headers: getHeaders()});

    const artists: Artist[] = [];
    result.data.artists.items.forEach((item: any) => {
        artists.push({
            name: item.name,
            image: item.images[0].url,
            url: item.external_urls.spotify
        });
    });

    return artists;
}

export { signIn, setAuth, isSignedIn, getUserData, findSong, generatePlaylist, searchArtists }