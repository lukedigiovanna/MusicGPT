import { ChatCompletionRequestMessageRoleEnum, Configuration, OpenAIApi } from "openai";

import { Artist, Track, User, TrackResults, ArtistOption } from "../constants/models";
import { findSong } from "./spotify";

const config = new Configuration({
    organization: "org-TmJDI1qNxxPsvv0sGniSnxDc",
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
})

const openai = new OpenAIApi(config);

const SYSTEM_PROMPT: string = `
You are MusicGPT, an advanced AI that recommends a 10 song playlist based on information
that the user supplies to you. Be ABSOLUTELY sure to not repeat any songs that the user tells 
you they like. Merely use these to determine their taste in music. Put much greater weight into
the other information they give, particularly the MOOD they request. 

You will report your response by simply writing on each line the artist name followed by a colon 
followed by the song name. You MUST NOT, in any circumstance output any additional information. 
ONLY output each artist and song on each line. Finish by writing a name and description for the playlist.

Your response should strictly follow the following form:

"""
<Artist Name 1>: <Song Name 1>
<Artist Name 2>: <Song Name 2>
...
playlist_title: <Playlist Title>
description: <Playlist Description>
"""

Ensure that the artist comes first and then the song name.
`;

export const generatePrompt = (topArtists: Artist[],  artistOption: ArtistOption, topTracks: Track[], genres: string[], moods: string[], extraContent: string) => {
    // Uses the given content to generate a prompt to the AI
    let prompt = "";
    if (topArtists.length > 0) {
        prompt += `My top artists are: ${topArtists.slice(0,5).map((v: Artist) => v.name).join(", ")}\n`;
    }
    if (topTracks.length > 0) {
        prompt += `My top songs are: ${topTracks.slice(0,5).map((v: Track) => v.name).join(", ")}\n`;
    }
    if (genres.length > 0)
        prompt += `My favorite genres are: ${genres.join(", ")}\n`;
    if (moods.length > 0)
        prompt += `I currently want the following moods: ${moods.join(", ")}\n`;
    if (extraContent.length > 0)
        prompt += `Any additional information?\n${extraContent}\n`;

    if (topArtists.length > 0) {
        if (artistOption == "only") {
            prompt += "Super important: ONLY INCLUDE SONGS BY MY TOP ARTISTS. DO NOT INCLUDE ANY SONGS BY ANY OTHER ARTISTS!"; 
        }
        if (artistOption == "none") {
            prompt += "Super important: INCLUDE ABSOLUTELY NO SONGS BY MY TOP ARTISTS. GIVE ME SONGS BY RELATED ARTISTS!"
        }
    }

    return prompt;
}



const parseResults: (results: string) => Promise<TrackResults | null> = async (results: string) => {
    // first parse by newline chars.
    const lines = results.split("\n");

    const tracks = [];
    let title = "MusicGPT Playlist";
    let description = "Generated for you by AI";

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].replace(/^\d+\./, "");
        const idx = line.indexOf(":");
        const artist = line.substring(0, idx);
        const trackName = line.substring(idx + 2);
        if (artist === "playlist_title") {
            title = trackName;
        }
        else if (artist === "description") {
            description = trackName;
        }
        else {
            const track = await findSong(artist, trackName);
            if (track !== null) {
                tracks.push(track);
            }
        }
    }

    if (tracks.length === 0) {
        return null;
    }
    else {
        return {
            playlist_title: title,
            playlist_description: description,
            tracks
        };
    }
}

export const getRecommendations = async (topArtists: Artist[],  artistOption: ArtistOption, topTracks: Track[], genres: string[], moods: string[], extraContent: string) => {
    const userPrompt = generatePrompt(topArtists, artistOption, topTracks, genres, moods, extraContent);
    const messages = [
        {role: ChatCompletionRequestMessageRoleEnum.System, content: SYSTEM_PROMPT},
        {role: ChatCompletionRequestMessageRoleEnum.User, content: userPrompt}
    ];
    const chat = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: messages
    });
    const response = chat.data.choices[0].message?.content;
    console.log(response);
    return parseResults(response as string);
}
