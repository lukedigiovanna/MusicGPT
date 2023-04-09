import * as React from 'react';
import styled from 'styled-components';
import { Artist } from '../constants/models';
import { debounce } from '../constants/utils';
import * as Spotify from "../api/spotify";

const ArtistsBox = styled.div`
    height: 1.1rem;
    width: 100%;
    border-radius: 3px;
    background-color: #5a6579;
    padding: 6px;
    font-family: sans-serif;
`

const ArtistTag = styled.div`
    font-size: 1rem;
    background-color: #aaaaaa;
    border-radius: 4px;
    color: #333;
`

export const ArtistSelect = () => {
    const [artists, setArtists] = React.useState<Artist[]>([]);
    const [searchTerm, setSearchTerm] = React.useState<string>("");

    return (
        <>
            <ArtistsBox>
                {
                    artists.length === 0 &&
                    <>
                        Nothing here!
                    </>
                }
                {
                    artists.length > 0 &&
                    <>
                        {
                            artists.map((artist: Artist, index: number) => {
                                return (
                                    <ArtistTag key={index}>
                                        {artist.name}
                                    </ArtistTag>
                                )
                            })
                        }
                    </>
                }
            </ArtistsBox>
            <input value={searchTerm} onChange={(e) => {
                setSearchTerm(e.target.value);
                debounce(async () => {
                    setArtists(await Spotify.searchArtists(e.target.value))
                }, 500);
            }} />
        </>
    )
}