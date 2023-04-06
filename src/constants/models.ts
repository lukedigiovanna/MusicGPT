export interface Artist {
    name: string;
    image: string;
    url?: string; // optionally throw in url to artist
}

export interface Track {
    name: string;
    artist: Artist;
    image: string;
    url?: string; // optionally throw in the url to the track
}

export interface User {
    id: string;
    name: string;
    image: string;
    topTracks: Track[];
    topArtists: Artist[];
}