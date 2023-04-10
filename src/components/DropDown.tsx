import styled from "styled-components"

const Select = styled.select`
    outline: none;
    border: none;
    background-color: #445;
    border-radius: 3px;
    padding: 2px;
    margin-block: 2px;
    color: #ccc;
    font-size: 0.8rem;
    font-family: sans-serif;
    font-weight: bold;
`

const Label = styled.label`
    color: #ddd;
    font-size: 0.9rem;
    font-family: sans-serif;
    font-weight: bold;
`

export interface Option {
    value: any;
    text: string;
}

export const DropDown = (props: {label: string, options: Option[], disabled?: boolean, onChange?: (value: any) => void}) => {
    return (
        <>
            <Label>
                {props.label}:{" "}
            </Label>
            <Select disabled={props.disabled} onChange={(e) => {
                if (props.onChange) {
                    props.onChange(e.target.value);
                }
            }}>
                {
                    props.options.map((option: Option, index: number) => {
                        return (
                            <option value={option.value}>{option.text}</option>
                        )
                    })
                }
            </Select>
        </>
    )
}