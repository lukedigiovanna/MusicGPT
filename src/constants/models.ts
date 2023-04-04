export interface Artist {
    name: string;
    image: string;
}

export interface Track {
    name: string;
    artist: Artist;
    image: string;
}

export interface User {
    id: string;
    name: string;
    image: string;
    topTracks: Track[];
    topArtists: Artist[];
}