import { ChatCompletionRequestMessageRoleEnum, Configuration, OpenAIApi } from "openai";

import { Artist, Track, User } from "../constants/models";
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
ONLY output each artist and song on each line. Your response should strictly follow the following form:

"""
<Artist Name 1>: <Song Name 1>
<Artist Name 2>: <Song Name 2>
...
"""
`;

export const generatePrompt = (user: User, genres: string[], moods: string[], when: string, where: string, how: string, extraContent: string) => {
    // Uses the given content to generate a prompt to the AI
    let prompt = "";
    prompt += `My top artists are: ${user.topArtists.slice(0,5).map((v: Artist) => v.name).join(", ")}\n`;
    prompt += `My top songs are: ${user.topTracks.slice(0,5).map((v: Track) => v.name).join(", ")}\n`;
    if (genres.length > 0)
        prompt += `My favorite genres are: ${genres.join(", ")}\n`;
    if (moods.length > 0)
        prompt += `I currently want the following moods: ${moods.join(", ")}\n`;
    if (when.length > 0)
        prompt += `When do you usually listen to music?\n${when}\n`;
    if (where.length > 0)
        prompt += `Do you like any particular music at different times of day or different seasons?\n${where}\n`;
    if (how.length > 0)
        prompt += `How do you usually discover new music?\n${how}\n`;
    if (extraContent.length > 0)
        prompt += `Any additional information?\n${extraContent}`;

    return prompt;
}

const parseResults: (results: string) => Promise<Track[] | null> = async (results: string) => {
    // first parse by newline chars.
    const lines = results.split("\n");

    const tracks = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].replace(/^\d+\./, "");
        const idx = line.indexOf(":");
        const artist = line.substring(0, idx);
        const trackName = line.substring(idx + 2);
        const track = await findSong(artist, trackName);
        if (track !== null) {
            tracks.push(track);
        }
    }

    if (tracks.length === 0) {
        return null;
    }
    else {
        return tracks;
    }
}

export const getRecommendations = async (user: User, genres: string[], moods: string[], when: string, where: string, how: string, extraContent: string) => {
    const userPrompt = generatePrompt(user, genres, moods, when, where, how, extraContent);
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
