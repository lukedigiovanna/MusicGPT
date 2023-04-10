export interface Artist {
    name: string;
    image: string;
    url?: string; // optionally throw in url to artist
}

export interface Track {
    name: string;
    artist: Artist;
    image: string;
    id: string; // spotify ID of the track for adding to playlists.
    duration_ms: number,
    url?: string; // optionally throw in the url to the track
}

export interface Playlist {
    url: string;
    name: string;
    tracks: Track[];
}

export interface User {
    id: string;
    name: string;
    image: string;
    topTracks: Track[];
    topArtists: Artist[];
}

export interface TrackResults {
    playlist_title: string;
    playlist_description: string;
    tracks: Track[];
}

export type Stage = 'form' | 'loading' | 'results';

export type Term = "short_term" | "medium_term" | "long_term";

export type ArtistOption = "only" | "none" | "some";