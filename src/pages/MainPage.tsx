import React from "react";
import styled from "styled-components";

import { Title, Background, GPTSpan, Bold, Header } from "../constants/theme";
import * as Spotify from "../api/spotify";

const Body = styled.p`
    max-width: 400px;
    font-family: sans-serif;
    color: #ddd;
    text-align: justify;
    margin: auto;
    display: block;
    font-size: 1.1rem;
`

const SpotifyButton = styled.button`
    text-align: center;
    color: #eee;
    background: #131313;
    width: 160px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    border: none;
    padding-inline: 18px;
    padding-block: 10px;    
    box-shadow: 1px 1px 3px #3a3939;
    margin: auto;
    margin-top: 50px;
    
    transition: 0.4s ease-in-out;

    opacity: 1.0;

    &:hover {
        box-shadow: none;
        opacity: 0.8;
    }
`

const SpotifyLogo = styled.img`
    width: 22px;
    height: 22px;
    margin-right: 10px;
`

const LoginText = styled.p`
    margin: 0;
`

const MainPage = () => {
    React.useEffect(() => {

    }, []);

    return (
        <Background>
            <Header>
                <Title colors={["#0d259d","#008baa"]}>
                    Music<GPTSpan>GPT</GPTSpan>
                </Title>
            </Header>
            <Body>
                <Bold>MusicGPT</Bold> is an expert assistant in finding you fresh music
                based on your current listening habits and opinions. Simply link your
                Spotify account and fill out a short questionaire to get started 
                on your AI sponsored listening journey.
            </Body>
            <SpotifyButton onClick={() => {
                console.log("Bringing you to Spotify signin.");
                Spotify.signIn();

            }}>
                <SpotifyLogo src="spotify.png"/>
                <LoginText>Log In</LoginText>
            </SpotifyButton>
        </Background>
    )
}

export default MainPage;