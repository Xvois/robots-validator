import {Radio, RadioProps, styled, TextField} from "@mui/material";


export const StyledTextField = styled(TextField)({
    "& .MuiInputBase-root": {
        background: 'var(--secondary-colour)',
        color: 'var(--primary-colour)'
    },
    '& .MuiInput-underline': {
        color: `var(--secondary-colour)`,
    },
    '& .MuiFormLabel-root.Mui-disabled': {
        color: `var(--border-colour)`,
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: 'var(--border-colour)',
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: 'var(--border-colour)',
            borderRadius: `0px`,
            borderWidth: '1px',
            transition: `all 0.1s ease-in`
        },
        '&:hover fieldset': {
            borderColor: 'var(--border-colour)',
        },
        '&.Mui-focused fieldset': {
            borderColor: 'var(--border-colour)',
            borderWidth: '1px',
            transition: `all 0.1s ease-in`
        },
    },
    '& label.Mui-focused': {
        color: 'var(--primary-colour)',
        fontFamily: '"Poppins", sans-serif',
    },
    '& .MuiFormLabel-root': {
        color: 'var(--primary-colour)',
        marginLeft: `5px`,
        fontFamily: '"Poppins", sans-serif',
    },
});


const StyledRadioIcon = styled('span')(({}) => ({
    borderRadius: '50%',
    width: 16,
    height: 16,
    boxShadow: '0 0 0 1px var(--bg-colour)',
    backgroundColor: 'var(--secondary-colour)',
    backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.05),hsla(0,0%,100%,0))',
    '.Mui-focusVisible &': {
        outline: '2px auto rgba(19,124,189,.6)',
        outlineOffset: 2,
    },
    'input:hover ~ &': {
        backgroundColor: 'var(--border-colour)'
    },
    'input:disabled ~ &': {
        boxShadow: 'none',
        background: 'rgba(57,75,89,.5)'
    },
}));

const StyledCheckRadioIcon = styled(StyledRadioIcon)({
    backgroundColor: 'var(--accent-colour)',
    backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
    '&:before': {
        display: 'block',
        width: 16,
        height: 16,
        backgroundImage: 'radial-gradient(#fff,#fff 28%,transparent 32%)',
        content: '""',
    },
    'input:hover ~ &': {
        backgroundColor: 'var(--accent-colour)',
    },
});

export function StyledRadio(props: RadioProps) {
    return (
        <Radio
            disableRipple
            color="default"
            checkedIcon={<StyledCheckRadioIcon/>}
            icon={<StyledRadioIcon/>}
            {...props}
        />
    );
}