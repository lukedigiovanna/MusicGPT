import React from "react";
import * as Spotify from "../api/spotify";
import { useNavigate } from "react-router-dom";

import styled from "styled-components";
import './form.css';

import theme, { Background, Title, GPTSpan, Header, Italic } from "../constants/theme";
import { Artist, Track, User } from "../constants/models";
import { generatePrompt, getRecommendations } from "../api/gpt";

import { InputBox } from "../components/InputBox";
import { TrackRow } from "../components/TrackRow";

const Greeting = styled.p`
    text-align: center;
    color: #ddd;
    font-size: 1.2rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: auto;
    width: fit-content;
    margin-bottom: 6px;
`

const SignOut = styled.a`
    font-size: 0.9rem;
    text-align: center;
    margin: auto;
    display: block;
    margin: 0;
    color: #21c821;
    text-decoration: none;
    margin-bottom: 24px;

    transition: 0.3s ease-in-out;

    &:hover {
        color: #087208;
    }
`

const ProfileImage = styled.img`
    width: 20px;
    height: 20px;
    border: 1px solid black;
    margin-inline: 8px;
    border-radius: 10px;
`

const Table = styled.div`
    display: flex;
    flex-direction: row;
    max-width: 400px;
    color: #ddd;
    margin: auto;
    margin-bottom: 14px;
    filter: drop-shadow(0px 0px 14px #111);
`

const Column = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    font-family: ${theme.font}, sans-serif;
`

const DataRow = styled.p`
    margin: 0;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    color: #bbb;
`

const ColumnHeader = styled.p`
    font-weight: bold;
    font-size: 1.1rem;
    margin-bottom: 4px;
    text-align: center;
    color: #ccc;
`

const ArtistImage = styled.img`
    width: 22px;
    height: 22px;
    border-radius: 11px;
    margin-right: 5px;
`

const TrackImage = styled.img`
    width: 22px;
    height: 22px;
    border-radius: 1px;
    margin-right: 5px;
`

const TermButton = styled.span`
    color: #2672ff;

    transition: 0.4s ease-in-out;

    cursor: pointer;

    &:hover {
        color: #6a9eff
    }

    &:active {
        color: #c36dc3;
    }
`

const Form = styled.div`
    max-width: 400px;
    display: block;
    margin: auto;
`

const OptionButton = styled.button<{selected: boolean}>`
    background-color: ${props => props.selected ? '#74e5f4' : '#ccc'};
    border: none;
    border-radius: 14px;
    margin: 4px;
    font-size: 0.85rem;
    color: #333;
    padding: 6px;
    padding-inline: 10px;
    font-weight: 100;
    cursor: pointer;

    transition: 0.4s ease-in-out;

    &:hover {
        background-color: ${props => props.selected ? '#81e6f4' : '#bbb'};
    }
`

const Prompt = styled.p`
    color: #eee;
    font-family: sans-serif;
    font-size: 0.96rem;
    margin-bottom: 2px;
`

const SubmitButton = styled.button`
    text-align: center;
    padding-inline: 10px;
    font-size: 1.1rem;
    color: #444;
    border-radius: 5px;
    border-radius: 3px;
    display: block;
    margin: auto;
    margin-top: 10px;
    padding-block: 6px;
    font-family: sans-serif;
    border: none;
    margin-top: 25px;
    cursor: pointer;

    transition: 0.4s ease-in-out;

    background-color: #c7ffc7;
    &:hover {
        background-color: #a9f9a9;
    }

`

const LoadingMessage = styled.p`
    font-family: sans-serif;
    color: #ddd;
    text-align: center;
    font-size: 1rem;
`

const BottomSpacer = styled.div`
    height: 130px;
`

type Term = "short_term" | "medium_term" | "long_term";

const term_lengths = {
    "short_term": [" over the last month", "last month"],
    "medium_term": [" over the last 6 months", "last 6 months"],
    "long_term": [" of all time", "all time"]
}

const getUnused: (cur: Term) => Term[] = (cur: Term) => {
    const unused: Term[] = ["short_term", "medium_term", "long_term"];
    unused.splice(unused.indexOf(cur), 1);
    return unused;
}

const genres = [
    'Hip-Hop', 'Country', 'R&B', 'Classical', 'Jazz', 'Pop', 'K-Pop',
    'J-Pop', 'Hispanic', 'Indie', 'Folk', 'Rock', 'Melodic', 'Microtonal',
    'Funk', 'Blues', 'Gospel', 'Christian', 'Electronic', 'Techno', 'Grunge',
    'Psychedelic Rock', 'Metal', 'Punk', 'Disco', '70s', '80s', '90s', '00s'
]

const moods = [
    'Upbeat', 'Energetic', 'Chill', 'Melancholic', 'Romantic', 'Angry', 'Reflective', 'Nostalgic', 'Empowering'
]

type Stage = 'form' | 'loading' | 'results';

const FormPage = () => {
    const navigate = useNavigate();

    const [user, setUser] = React.useState<User | null>(null);
    const [term, setTerm] = React.useState<Term>("medium_term")

    const [selectedGenres, setSelectedGenres] = React.useState<string[]>([]);
    const [selectedMoods, setSelectedMoods] = React.useState<string[]>([]);

    const [whenListen, setWhenListen] = React.useState<string>("");
    const [setting, setSetting] = React.useState<string>("");
    const [discovery, setDiscovery] = React.useState<string>("");
    const [extraRequest, setExtraRequest] = React.useState<string>("");

    const [stage, setStage] = React.useState<Stage>('form');

    const [recommendations, setRecommendations] = React.useState<Track[] | null>([]);

    const getUserData = (term: Term) => {
        Spotify.getUserData(term).then(data => {
            setUser(data);
        });
    }

    React.useEffect(() => {
        if (!Spotify.isSignedIn()) {
            navigate("/");
        }
        else {
            // get me information
            getUserData(term);
            Spotify.findSong("Tom Misch", "Sunshine").then((res) => {
                console.log(res);
            });
        }
    }, [navigate, term]); 

    return (
        <>
            <Background />
            <Header>
                <Title colors={["#0d259d","#008baa"]}>
                    Music<GPTSpan>GPT</GPTSpan>
                </Title>
            </Header>
            
            {
                stage === 'loading' &&
                <>
                <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                <LoadingMessage>
                    The AI is figuring you out
                </LoadingMessage>
                </>
            }
            {
                stage === 'results' &&
                <Form>
                    <>
                        <Prompt>
                            Here's what the AI thinks you might like next:
                        </Prompt>
                        {
                            !recommendations &&
                            <Prompt>
                                Something went wrong!
                            </Prompt>
                        }
                        {
                            recommendations &&
                            recommendations.map((track: Track, index: number) => {
                                return (
                                    <TrackRow track={track} key={index} />
                                )
                            })
                        }
                        <SubmitButton onClick={() => {
                            setStage("form");
                            setExtraRequest("");
                            setSetting("");
                            setDiscovery("");
                            setWhenListen("");
                        }}>
                            Try Again
                        </SubmitButton>
                    </>
                </Form>
            }
            {
                stage === 'form' && user == null &&
                <Greeting>
                    Loading...
                </Greeting>
            }
            {
                stage === 'form' && user != null && 
                <Form>
                    <Greeting>
                        Welcome, <ProfileImage src={user.image}/> <Italic>{user.id}</Italic>
                    </Greeting>
                    <SignOut href="/">
                        Sign Out
                    </SignOut>
                    <Prompt>
                        Here are your most listened to artists and tracks 
                        <Italic>{term_lengths[term][0]}</Italic>: 
                    </Prompt>
                    <Table>
                        <Column>
                            <ColumnHeader>
                                Artists
                            </ColumnHeader>
                            {user.topArtists.map((artist: Artist, index: number) => {
                                return (
                                    <DataRow key={index}>
                                        <ArtistImage src={artist.image}/>
                                        {artist.name}
                                    </DataRow>
                                );
                            })}
                        </Column>
                        <Column>
                            <ColumnHeader>
                                Tracks
                            </ColumnHeader>
                            {user.topTracks.map((track: Artist, index: number) => {
                                return (
                                    <DataRow key={index}>
                                        <TrackImage src={track.image}/>
                                        {track.name}
                                    </DataRow>
                                );
                            })}
                        </Column>
                    </Table>
                    <Prompt>
                        Don't like these? Try 
                        {
                            getUnused(term).map((term: Term, index: number) => {
                                return (
                                    <span key={index}>
                                        <TermButton key={index} onClick={() => {
                                            setTerm(term);
                                        }}>
                                            {` ${term_lengths[term][1]} `}
                                        </TermButton>
                                        {
                                            index === 0 && <> or </>
                                        }
                                    </span>
                                );
                            })
                        }
                        instead. The AI will use some of these artists and tracks to figure 
                        out what type of music you like.
                    </Prompt>
                    <hr/>
                    <Prompt>
                        Select your favorite genres
                    </Prompt>
                    <div>
                        {genres.map((genre: string, index: number) => {
                            return (
                                <OptionButton key={index} selected={selectedGenres.includes(genre)}
                                    onClick={() => {
                                        if (selectedGenres.includes(genre)) {
                                            // remove it
                                            selectedGenres.splice(selectedGenres.indexOf(genre), 1);
                                            setSelectedGenres([...selectedGenres]);
                                        }
                                        else { 
                                            // add it
                                            setSelectedGenres([...selectedGenres, genre]);
                                        }
                                    }}>
                                    {genre}
                                </OptionButton>
                            )
                        })}
                    </div>
                    <Prompt>
                        Choose any moods you are looking for:
                    </Prompt>
                    <div>
                        {moods.map((mood: string, index: number) => {
                            return (
                                <OptionButton key={index} selected={selectedMoods.includes(mood)}
                                    onClick={() => {
                                        if (selectedMoods.includes(mood)) {
                                            // remove it
                                            selectedMoods.splice(selectedMoods.indexOf(mood), 1);
                                            setSelectedMoods([...selectedMoods]);
                                        }
                                        else { 
                                            // add it
                                            setSelectedMoods([...selectedMoods, mood]);
                                        }
                                    }}>
                                    {mood}
                                </OptionButton>
                            )
                        })}
                    </div>
                    <hr />
                    <Prompt>
                        <Italic>
                            The following questions are optional, but it is highly recommended to be
                            as honest and detailed as you can to generate the best response.
                        </Italic>
                    </Prompt>
                    <Prompt>
                        When do you usually listen to music? While studying, driving, socially?
                    </Prompt>
                    <InputBox value={whenListen} setValue={setWhenListen} />

                    <Prompt>
                        Do you like any particular music at different times of day or different seasons?
                    </Prompt>
                    <InputBox value={setting} setValue={setSetting} />

                    <Prompt>
                        How do you usually discover new music?
                    </Prompt>
                    <InputBox value={discovery} setValue={setDiscovery} />

                    <Prompt>
                        Input any additional information you would like the AI to use when generating your playlist:
                    </Prompt>
                    <InputBox value={extraRequest} setValue={setExtraRequest} />
                    
                    <SubmitButton onClick={async () => {
                        console.log(generatePrompt(user, selectedGenres, selectedMoods, whenListen, setting, discovery, extraRequest));
                        setStage('loading');
                        const results = await getRecommendations(user, selectedGenres, selectedMoods, whenListen, setting, discovery, extraRequest);
                        setStage('results');
                        setRecommendations(results);
                    }}>
                        Summon AI's Magic
                    </SubmitButton>
                </Form>
            }
            <BottomSpacer />
        </>
    )
};

export default FormPage;