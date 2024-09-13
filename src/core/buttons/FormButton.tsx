import React from 'react';
import { LoadingButton } from '@mui/lab';

const FormButton = (
    { pending, onClick, children, type, outlined, disabled }:
        { pending?: boolean; onClick: any; children: React.ReactNode; thick?: boolean, type?: "button" | "submit" | "reset", outlined?: boolean, disabled?: boolean, bgColor?: string }) => (
    <LoadingButton
        disabled={disabled}
        loading={pending}
        variant={outlined ? "outlined" : "contained"}
        fullWidth
        type={type}
        onClick={onClick}
    >
        {children}
    </LoadingButton>
);

export default FormButton