import styled from "styled-components";
import { Track } from "../constants/models";

const Row = styled.div`    
    display: flex;
    flex-direction: row;
    background-color: rgba(0,0,0,0.25);
    padding-block: 3px;
    padding-inline: 10px;
    margin: 6px;
    border-radius: 3px;
`

const TitleName = styled.a`
    font-size: 1rem;
    margin: 0;
    color: #ccc;
    font-family: sans-serif;

    cursor: pointer;
    text-decoration: none;

    &:hover {
        text-decoration: underline;
    }
`

const ArtistName = styled.a`
    font-size: 0.8rem;
    margin: 0;
    color: #aaa;
    font-family: sans-serif;

    cursor: pointer;
    text-decoration: none;

    &:hover {
        text-decoration: underline;
    }
`

const Image = styled.img`
    width: 36px;
    height: 36px;
    margin-right: 12px;
    border-radius: 2px;
`

export const TrackRow = (props: { track: Track }) => {
    return (
        <Row>
            <Image src={props.track.image} />
            <div>
                <TitleName target="_blank" href={props.track.url}>
                    {props.track.name}
                </TitleName>
                <br />
                <ArtistName target="_blank" href={props.track.artist.url}>
                    {props.track.artist.name}
                </ArtistName>
            </div>
        </Row>
    )
}