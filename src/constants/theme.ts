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
    position: fixed;
    z-index: -1;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background: linear-gradient(to bottom, #280221, #0a1832, #012519);
`

export const Body = styled.p`
    max-width: 400px;
    padding-inline: 8px;
    font-family: sans-serif;
    color: #ccc;
    text-align: justify;
    margin: auto;
    display: block;
    font-size: 1.05rem;
    margin-block: 3px;
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

const theme = {
    font: 'Lato'
};

export default theme;