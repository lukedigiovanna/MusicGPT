import * as React from 'react';
import styled from 'styled-components';
import { Artist } from '../constants/models';
import { debounce } from '../constants/utils';
import * as Spotify from "../api/spotify";

const ArtistsBox = styled.div`
    min-height: 1.1rem;    
    width: 100%;
    border-radius: 3px;
    background: radial-gradient(#1d3d5d,#122b45);
    padding: 2px;
    font-family: sans-serif;
    box-shadow: 0px 0px 14px #373737;
    margin-top: 5px;

`

const ArtistTag = styled.button`
    font-size: 0.9rem;
    background-color: #aaaaaa;
    border-radius: 18px;
    margin: 3px;
    padding-inline: 8px;
    padding-block: 4px;
    border: none;
    color: #333;
    display: inline-flex;
    flex-direction: row;
    align-items: center;
`

const CloseButton = styled.span`
    color: #777;
    transition: 0.3s ease-in-out;
    margin-left: 4px;

    &:hover {
        color: #c00;
    }
`

const ProfileImage = styled.img`
    width: 14px;
    height: 14px;
    border-radius: 10px;
    margin-right: 4px;
`

const SearchBox = styled.div`
    margin-top: 8px;    
`

const SearchRow = styled.div`
    margin-bottom: 8px;
    display: flex;
    flex-direction: row;
    align-items: center;
    width: fit-content;
`

const SearchIcon = styled.img<{focused: boolean}>`
    width: ${props => props.focused ? "22px" : "18px"};
    height: ${props => props.focused ? "22px" : "18px"};

    margin-right: 4px;
    transition: 0.4s ease-in-out;
`

const SearchInput = styled.input<{focused: boolean}>`
    width: ${props => props.focused ? "220px" : "0px"};
    transition: 0.4s ease-in-out;
    background-color: rgba(12,12,24,0.65);
    border: none;
    outline: none;
    border-radius: 6px;
    opacity: ${props => props.focused ? "1.0" : "0.0"};
    font-family: sans-serif;
    color: #ccc;
    padding-inline: 9px;
    padding-block: 5px;
    font-size: 1rem;
`

const SearchResults = styled.div<{focused: boolean, numResults: number}>`
    display: flex;
    flex-direction: column;
    overflow-y: hidden;
    opacity: ${props => props.focused ? "1.0" : "0.0"};
    height: ${props => props.focused ? `${props.numResults * 28.5}px` : "0px"};
    transition: 0.8s ease-in-out;
`

const SearchResult = styled.button`
    width: fit-content;
    min-width: 180px;
    text-align: left;
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 0.9rem;
    font-family: sans-serif;
    background-color: #aaa;
    color: #333;
    border-radius: 6px;
    padding-inline: 4px;
    padding-block: 4px;
    border: none;
    outline: none;
    margin: 2px;
    margin-left: 10px;
    cursor: pointer;

    opacity: 1.0;

    transition: 0.4s ease-in-out;
    &:hover {
        opacity: 0.8;
    }

    &:disabled {
        opacity: 0.5;
    }
`

const searchArtists = debounce(async (term: string, setResults: any) => {
    setResults(await Spotify.searchArtists(term))
}, 500);

export const ArtistSelect = (props: {artists: Artist[], setArtists: React.Dispatch<React.SetStateAction<Artist[]>>}) => {
    const [searchResults, setSearchResults] = React.useState<Artist[]>([]);
    const [searchTerm, setSearchTerm] = React.useState<string>("");

    const [searchFocused, setSearchFocused] = React.useState<boolean>(false);
    const [mouseOnSearch, setMouseOnSearch] = React.useState<boolean>(false);

    const isFocused = () => {
        return searchFocused || mouseOnSearch;
    }

    return (
        <>
            <ArtistsBox>
                {
                    props.artists.length === 0 &&
                    <>
                        <ArtistTag style={{opacity: 0.3}}>
                            <ProfileImage src={"avatar.png"} />
                            Artist
                            <CloseButton>
                                ×
                            </CloseButton>
                        </ArtistTag>
                    </>
                }
                {
                    props.artists.length > 0 &&
                    <>
                        {
                            props.artists.map((artist: Artist, index: number) => {
                                return (
                                    <ArtistTag key={index}>
                                        <ProfileImage src={artist.image} />
                                        {artist.name}
                                        <CloseButton onClick={() => {
                                            // removes the artist from the list of artists.
                                            props.setArtists(props.artists.filter((value: Artist) => value !== artist));
                                        }}>
                                            ×
                                        </CloseButton>
                                    </ArtistTag>
                                )
                            })
                        }
                    </>
                }
            </ArtistsBox>
            <SearchBox onMouseEnter={() => {
                setMouseOnSearch(true);
            }} onMouseLeave={() => {
                setMouseOnSearch(false);
            }}>
                <SearchRow>
                    <SearchIcon src={"magnifying_glass.png"} focused={isFocused()} />
                    <SearchInput value={searchTerm} focused={isFocused()} 
                    onFocus={() => {
                        setSearchFocused(true);
                    }}
                    onBlur={() => {
                        setSearchFocused(false);
                    }}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        searchArtists(e.target.value, setSearchResults);
                    }} />
                </SearchRow>
                <SearchResults focused={isFocused()} numResults={searchResults.length}>
                    {
                        searchResults.map((artist: Artist, index: number) => {
                            return (
                                <SearchResult key={index} disabled={props.artists.includes(artist) || props.artists.length >= 5} onClick={() => {
                                    props.setArtists([...props.artists, artist]);
                                }}>
                                    <ProfileImage src={artist.image} />
                                    {artist.name}
                                </SearchResult>
                            )
                        })
                    }
                </SearchResults>
            </SearchBox>
        </>
    )
}