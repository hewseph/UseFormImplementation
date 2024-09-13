import { IFieldProps } from "../hooks/useFormImplementation";
import { TextField } from '@mui/material'

type FormFieldProps = {
    label: string;
    useFieldProps: () => IFieldProps<string>;
}

function FormField<T>({
    label,
    useFieldProps
}: FormFieldProps) {
    const {
        error,
        helperText,
        onChange,
        onBlur,
        value,
        disabled,
        name,
    } = useFieldProps();

    return (
        <TextField
            label={label}
            error={error}
            helperText={helperText}
            fullWidth
            onChange={onChange}
            onBlur={onBlur}
            value={value || ""}
            disabled={disabled}
            name={name}
        />
    );
}

export default FormField;