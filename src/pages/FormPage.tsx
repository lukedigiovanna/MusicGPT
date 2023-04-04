import React from "react";
import * as Spotify from "../api/spotify";
import { useNavigate } from "react-router-dom";

import styled from "styled-components";

import { Background, Title, GPTSpan, Header, Italic } from "../constants/theme";
import { User } from "../constants/models";

const Greeting = styled.p`
    text-align: center;
    color: #ddd;
    font-size: 1.2rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: auto;
    width: fit-content;
`

const ProfileImage = styled.img`
    width: 20px;
    height: 20px;
    border: 1px solid black;
    margin-inline: 8px;
    border-radius: 10px;
`

const FormPage = () => {
    const navigate = useNavigate();

    const [user, setUser] = React.useState<User | null>(null);

    React.useEffect(() => {
        if (!Spotify.isSignedIn()) {
            navigate("/");
        }
        else {
            // get me information
            Spotify.getUserData().then(data => {
                setUser(data);
                console.log(data);
            })
        }
    }, [navigate]); 

    return (
        <Background>
            <Header>
                <Title colors={["#0d259d","#008baa"]}>
                    Music<GPTSpan>GPT</GPTSpan>
                </Title>
            </Header>
            {
                user == null &&
                <Greeting>
                    Loading...
                </Greeting>
            }
            {
                user != null && 
                <Greeting>
                    Welcome, <ProfileImage src={user.image}/> <Italic>{user.id}</Italic>
                </Greeting>

            }
        </Background>
    )
};

export default FormPage;