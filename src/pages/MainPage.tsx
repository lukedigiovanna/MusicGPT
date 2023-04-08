import React from "react";
import styled from "styled-components";

import { Title, Background, GPTSpan, Bold, Header, Body, Italic } from "../constants/theme";
import * as Spotify from "../api/spotify";

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
    margin-top: 20px;
    margin-bottom: 20px;
    
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

const H = styled.p`
    color: #eee;
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom: 0px;
    text-align: left;
`

const MainPage = () => {
    React.useEffect(() => {

    }, []);

    return (
        <>
        <Background />
        <Header>
            <Title colors={["#0d259d","#008baa"]}>
                Music<GPTSpan>GPT</GPTSpan>
            </Title>
        </Header>
        <Body>
            <Bold>MusicGPT</Bold> is an expert assistant in finding you fresh music
            based on your current listening habits and opinions. Simply link your
            Spotify account and fill out a short questionnaire to get started 
            on your AI sponsored listening journey.
        </Body>
        <SpotifyButton onClick={() => {
            console.log("Bringing you to Spotify signin.");
            Spotify.signIn();

        }}>
            <SpotifyLogo src="spotify.png"/>
            <LoginText>Log In</LoginText>
        </SpotifyButton>
        <Body>
            <H>
                How This Works:
            </H>
            <br />
            <Bold>MusicGPT</Bold> is powered by ChatGPT. ChatGPT is a large language model 
            (LLM). It was "trained" on a ridiculuous amount of text data including books,
            articles, and large portions of the internet. With this vast amount of knowledge
            it is able to do a lot of things, one of which is apparently giving 
            song recommendations. <br /> <br />
            In this app, ChatGPT is "prompted" with information about your musical habits
            and desires. It is given the top 5 songs and artists from your Spotify account
            as well as some information you input manually. This is the <Italic>only</Italic>{" "}
            information it is given, so sometimes it will recommend songs that you already know.
            This is inevitible. To avoid this we would need to tell ChatGPT all of the songs
            you have ever listened to and to be sure not to recommend those. This is simply
            not possible.
            <br /> <br />
            <H>
                So, how can I get more novel recommendations?
            </H>
            <br/>
            This is best achieved by prompting the AI with a request that tells it to do so.
            You can fill out information in the boxes that guide the AI's request. For example,
            if you are looking for chill techno music you could write something along the lines 
            of "I am trying to study and want a nice playlist with techno-beats and minimal lyrics". 
            The AI will operate accordingly. Additionally, choosing specific genres that perhaps
            you don't usually listen to will be beneficial to finding new music.
        </Body>
        </>
    )
}

export default MainPage;