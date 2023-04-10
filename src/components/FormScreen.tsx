import styled from "styled-components"
import * as React from 'react';
import { useNavigate } from "react-router-dom";

import { Bold, Form, Italic, Prompt, SubmitButton } from "../constants/theme";
import { User, Term, Artist, TrackResults, Stage, ArtistOption, Track } from "../constants/models";

import { InputBox } from "./InputBox";
import { ArtistSelect } from "./ArtistSelect";
import { generatePrompt, getRecommendations } from "../api/gpt";
import { DropDown } from "./DropDown";
import { PromptExampleBlock } from "./PromptExampleBlock";

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

const Table = styled.div<{enabled: boolean}>`
    display: flex;
    flex-direction: row;
    max-width: 400px;
    color: #ddd;
    margin: auto;
    margin-bottom: 14px;
    filter: drop-shadow(0px 0px 14px #111);
    transition: 0.5s ease-in-out;
    opacity: ${props => props.enabled ? 1.0 : 0.25};
`

const Column = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    font-family: sans-serif;
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
    margin-top: 0px;
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

    &:disabled {
        opacity: 0.5;
        background-color: #bbb;
    }
`

const LimitSpan = styled.span`
    color: #999;
    font-size: 0.7rem;
`

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
    "Acoustic", "Alternative", "Ambient", "Avant-garde", "Blues", "Celtic", "Chamber music", "Chant", "Children's", "Christian", "Classical", "Country", "Dance", "Disco", "Electronic", "Experimental", "Folk", "Funk", "Gospel", "Heavy metal", "Hip hop", "House", "Indie", "Industrial", "Instrumental", "Jazz", "Latin", "Medieval", "Metal", "Motown", "New age", "Opera", "Pop", "Progressive", "Punk", "R&B/Soul", "Rap", "Reggae", "Rock", "Ska", "Soft rock", "Soundtrack", "Swing", "Techno", "Trance", "World"
]

const moods = [
    "Aggressive", "Angry", "Calm", "Cheerful", "Confident", "Dark", "Dreamy", "Energetic", "Epic", "Happy", "Hopeful", "Inspirational", "Intense", "Light", "Melancholic", "Mellow", "Nostalgic", "Peaceful", "Playful", "Reflective", "Romantic", "Sad", "Sentimental", "Serious", "Soothing", "Suspenseful", "Thoughtful", "Uplifting"
]

const promptExamples = [
    "I'm feeling rather medieval. Give me a playlist that you think some punks from the 1400's could bop their heads to.",
    "I'm working on connecting to my Italian roots. Give me a playlist of Italian classics from the 70s that will make me feel the same as when I eat spaghetti.",
    "I am hosting a party celebrating the end of the lizard overlord rule. We finally toppled the evil lizards controlling our governments. Success at last! And now we need some beats to drink lizard blood to.",
]

export const FormScreen = (props: {
    user: User,
    getUserData: (term: Term) => void,
    setStage: React.Dispatch<React.SetStateAction<Stage>>,
    setRecommendations: React.Dispatch<React.SetStateAction<TrackResults | null>> 
}) => {
    const [term, setTerm] = React.useState<Term>("medium_term");

    const [includeTop, setIncludeTop] = React.useState<boolean>(false);
    
    const [selectedArtists, setSelectedArtists] = React.useState<Artist[]>([]);
    const [artistOption, setArtistOption] = React.useState<ArtistOption>();

    const [selectedGenres, setSelectedGenres] = React.useState<string[]>([]);
    const [selectedMoods, setSelectedMoods] = React.useState<string[]>([]);

    const [extraRequest, setExtraRequest] = React.useState<string>("");

    const {getUserData} = props; 

    return (
        <Form>
            <Greeting>
                Welcome, <ProfileImage src={props.user.image}/> <Italic>{props.user.id}</Italic>
            </Greeting>
            <SignOut href="/">
                Sign Out
            </SignOut>
            <Prompt>
                Here are your most listened to artists and tracks 
                <Italic>{term_lengths[term][0]}</Italic>: 
            </Prompt>
            <label className="switch">
            <input type="checkbox" checked={includeTop} onChange={(e) => {
                setIncludeTop(e.target.checked);
            }}/>
            <span className="slider round"></span>
            </label>
            <Table enabled={includeTop}>
                <Column>
                    <ColumnHeader>
                        Artists
                    </ColumnHeader>
                    {props.user.topArtists.map((artist: Artist, index: number) => {
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
                    {props.user.topTracks.map((track: Artist, index: number) => {
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
                                    getUserData(term);
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
            <Prompt>
                {
                    includeTop ?
                    "Want something else? Tell the AI to ignore your top artists and tracks using the toggle."
                    :
                    "Want to use these? Tell the AI to include your top artists and tracks using the toggle."
                }
            </Prompt>
            {
                !includeTop &&
                <>
                    <hr />
                    <Prompt style={{marginBottom: 6}}>
                        Search for up to <Bold>5</Bold> artists to draw inspiration from:
                    </Prompt>
                    <DropDown label="Option" options={[
                        {value: "some", text: "Include SOME songs by these artists"}, 
                        {value: "only", text: "Include ONLY songs by these artists"}, 
                        {value: "none", text: "Include ZERO songs by these artists"}
                    ]} onChange={(value: any) => {
                        setArtistOption(value);
                    }}/>
                    <ArtistSelect artists={selectedArtists} setArtists={setSelectedArtists} />
                </>
            }
            <hr/>
            <Prompt>
                Select what genres you are looking for: <LimitSpan>({selectedGenres.length}/3)</LimitSpan>
            </Prompt>
            <div>
                {genres.map((genre: string, index: number) => {
                    return (
                        <OptionButton key={index} selected={selectedGenres.includes(genre)}
                            disabled={!selectedGenres.includes(genre) && selectedGenres.length >= 3}
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
                Choose any moods you are looking for: <LimitSpan>({selectedMoods.length}/3)</LimitSpan>
            </Prompt>
            <div>
                {moods.map((mood: string, index: number) => {
                    return (
                        <OptionButton key={index} selected={selectedMoods.includes(mood)}
                            disabled={!selectedMoods.includes(mood) && selectedMoods.length >= 3}
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
                Describe to the AI what type of music you are looking for or what mood you are in.
                <Italic><Bold> Feel free to be creative</Bold></Italic>
            </Prompt>
            <InputBox value={extraRequest} setValue={setExtraRequest} />
            
            {
                extraRequest.length === 0 &&
                <Prompt style={{color: "#bb0"}}>
                    <Italic>
                        *Warning: It is highly recommended to provide some prompt to the AI.
                    </Italic>
                </Prompt>
            }

            <SubmitButton onClick={async () => {
                let artists: Artist[] = [], tracks: Track[] = [];
                let option: ArtistOption = "none";
                if (includeTop) {
                    artists = props.user.topArtists;
                    tracks = props.user.topTracks;
                }
                else {
                    artists = selectedArtists;
                    option = artistOption as ArtistOption;
                }
                console.log(generatePrompt(artists, option, tracks, selectedGenres, selectedMoods, extraRequest));
                props.setStage('loading');
                const results = await getRecommendations(artists, artistOption as ArtistOption, tracks, selectedGenres, selectedMoods, extraRequest);
                props.setStage('results');
                props.setRecommendations(results);
            }}>
                Summon AI's Magic
            </SubmitButton>

            <Prompt>
                Not sure what to write? Use these examples for inspiration.
            </Prompt>

            {
                promptExamples.map((example: string, index: number) => {
                    return (
                        <PromptExampleBlock prompt={example} onClick={() => {
                            setExtraRequest(example);
                        }}/>
                    );
                })
            }
        </Form>
    )
}