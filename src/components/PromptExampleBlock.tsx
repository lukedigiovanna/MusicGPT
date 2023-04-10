import styled from "styled-components"

const Block = styled.div`
    border: 2px solid black;
    border-radius: 5px;
    background-color: #ddd;
    padding: 9px;
    font-size: 0.8rem;
    color: #444;
    font-family: sans-serif;
    margin-block: 5px;
    cursor: pointer;
`

export const PromptExampleBlock = (props: {prompt: string, onClick?: () => void}) => {
    return (
        <Block onClick={() => {
            if (props.onClick) {
                props.onClick();
            }
        }}>
            "{props.prompt}"
        </Block>
    )
}