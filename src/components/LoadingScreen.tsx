import styled from "styled-components"

const LoadingMessage = styled.p`
    font-family: sans-serif;
    color: #ddd;
    text-align: center;
    font-size: 1rem;
`

export const LoadingScreen = () => {
    return (
        <>
            <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
            <LoadingMessage>
                The AI is figuring you out
            </LoadingMessage>
        </>
    )
}