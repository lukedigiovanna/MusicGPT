import styled from "styled-components";

const InputBoxContainer = styled.div`
    position: relative;
    width: 380px;
`

const TextArea = styled.textarea`
    width: 100%;
    display: block;
    margin: auto;
    padding: 6px;
    padding-bottom: 12px;
    resize: none;
    outline: none;
    background-color: #ddd;
    border-radius: 3px;
    font-family: sans-serif;
    margin-top: 10px;
    color: #333;
    touch-action: manipulation;
`

const WordCount = styled.span`
    position: absolute;
    right: -8px;
    bottom: 2px;
    color: #666;
    font-size: 0.75rem;
    z-index: 1;
`

export const InputBox = (props: {value: string, setValue: (v: string) => void}) => {
    return (
        <InputBoxContainer>
            <TextArea onChange={(e) => {
                const value = e.target.value.substring(0,300);
                props.setValue(value);
                e.target.value = value;
            }} />
            <WordCount>
                {props.value.length} / 300
            </WordCount>
        </InputBoxContainer>
    )
}