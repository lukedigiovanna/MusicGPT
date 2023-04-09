import styled from "styled-components";

import { TrackResults, Stage, Track, User } from "../constants/models";
import { TrackRow } from "./TrackRow";
import { SubmitButton, Form, Prompt } from "../constants/theme";

import * as Spotify from "../api/spotify";

const PlaylistTitle = styled.p`
    margin-bottom: 4px;
    margin-top: 15px;
    font-size: 1.1rem;
    color: #eee;
    font-family: sans-serif; 
    font-weight: bold;
`

const PlaylistDescription = styled.p`
    font-size: 0.7rem;
    color: #999;
    font-family: sans-serif;
    margin-bottom: 8px;
    margin-top: 0px;
`

export const ResultsScreen = (props: {user: User | null, recommendations: TrackResults | null, setStage: React.Dispatch<React.SetStateAction<Stage>>}) => {
    return (
        <Form>
            <>
                {
                    !props.recommendations &&
                    <Prompt>
                        Something went wrong!
                    </Prompt>
                }
                {
                    props.recommendations &&
                    <>
                        <Prompt>
                            Here's your AI generated playlist
                        </Prompt>
                        <hr />
                        <PlaylistTitle>
                            {props.recommendations.playlist_title}
                        </PlaylistTitle>
                        <PlaylistDescription>
                            {props.recommendations.playlist_description}
                        </PlaylistDescription>
                        {props.recommendations.tracks.map((track: Track, index: number) => {
                            return (
                                <TrackRow track={track} key={index} />
                            )
                        })}
                        <SubmitButton onClick={async () => {
                            if (props.user && props.recommendations) {
                                const result = await Spotify.generatePlaylist(props.user.id, props.recommendations);
                                if (result) {
                                    alert(`Made playlist ${result.name}`)
                                }
                                else {
                                    alert("Something went wrong");
                                }
                            }
                            else {
                                alert("Something went wrong");
                            }
                        }}>
                            Export to Spotify
                        </SubmitButton>
                    </>
                }
                <SubmitButton onClick={() => {
                    props.setStage("form");
                }}>
                    Try Again
                </SubmitButton>
            </>
        </Form>
    )
}