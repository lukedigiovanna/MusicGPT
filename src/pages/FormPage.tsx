import React from "react";
import * as Spotify from "../api/spotify";

import styled from "styled-components";
import './form.css';

import { Background, Title, GPTSpan, Header, Prompt } from "../constants/theme";
import { TrackResults, User, Stage, Term } from "../constants/models";

import { LoadingScreen } from "../components/LoadingScreen";
import { ResultsScreen } from "../components/ResultsScreen";
import { FormScreen } from "../components/FormScreen";
import { useNavigate } from "react-router-dom";

const BottomSpacer = styled.div`
    height: 130px;
`

const FormPage = () => {
    const navigate = useNavigate();

    const [stage, setStage] = React.useState<Stage>('form');
    const [user, setUser] = React.useState<User | null>(null);
    const [recommendations, setRecommendations] = React.useState<TrackResults | null>(null);

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
            // get "me" information
            getUserData("medium_term");
        }
    }, [navigate]); 

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
                <LoadingScreen />
            }
            {
                stage === 'results' &&
                <ResultsScreen user={user} recommendations={recommendations} setStage={setStage} />
            }
            {
                stage === 'form' && user == null &&
                <Prompt>
                    Loading...
                </Prompt>
            }
            {
                stage === 'form' && user != null && 
                <FormScreen user={user} getUserData={getUserData} setStage={setStage} setRecommendations={setRecommendations}/>
            }
            <BottomSpacer />
        </>
    )
};

export default FormPage;