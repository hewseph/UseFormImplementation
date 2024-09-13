
import { IFieldProps } from "../hooks/useFormImplementation";
import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'

type FormSelectProps<T> = {
    label: string;
    useFieldProps: () => IFieldProps<string>;
    options: { label: string; value: T }[];
    onSelectedValueChange?: (arg0: T) => void;
}

function FormSelect<T>({
    options,
    label,
    useFieldProps,
    onSelectedValueChange: onSelectedValueChange
}: FormSelectProps<T>) {
    const {
        value,
        onChange,
        initialValue
    } = useFieldProps();

    return (
        <FormControl fullWidth sx={{ mb: "24px" }}>
            <InputLabel>{label}</InputLabel>
            <Select
                defaultValue={initialValue}
                value={value || initialValue}
                label={label}
                onChange={(e) => {
                    onChange(e)
                    if (e.target.value != value && onSelectedValueChange) {
                        onSelectedValueChange(e.target.value)
                    }
                }}
            >
                {options.map((option, index) => (
                    <MenuItem key={option.label} value={index}>{option.label}</MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}

export default FormSelect;
