import styled from "styled-components"

export const GradientText = styled.p<{colors: string[]}>`
    background-image: linear-gradient(to right, ${props => props.colors.join(", ")});
    width: fit-content;
    color: transparent;
    background-clip: text;
    -webkit-background-clip: text;
`

export const Bold = styled.span`
    font-weight: bold;
`

export const Italic = styled.span`
    font-style: italic;
`

export const Background = styled.div`
    position: absolute;
    z-index: 0;
    width: 100vw;
    height: 100vh;
    left: 0;
    top: 0;
    background: linear-gradient(to bottom, #280221, #0a1832, #012519);
`

export const Title = styled(GradientText)`
    font-size: 3rem;
    font-family: sans-serif;
    margin-top: 20px;
    font-weight: lighter;
    margin-bottom: 5px;
`

export const GPTSpan = styled.span`
    font-family: serif;
    font-weight: bold;
    font-size: 3.25rem;
`

export const Header = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-bottom: 20px;
`