import { DefaultValues, FieldPathValue, FieldValues, Noop, Path, PathValue, RefCallBack, UseControllerReturn, UseFormSetValue, useController, useForm } from "react-hook-form";
import { ObjectSchema, AnyObject } from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from "react";

export interface IFieldProps<TName extends string> extends UseControllerReturn<any, TName> {
    error: boolean,
    helperText: string,
    initialValue?: any,
    onChange: (...event: any[]) => void;
    onBlur: (_: any) => void;
    value: FieldPathValue<FieldValues, TName>;
    setValue: (arg0: PathValue<any, any>) => void;
    disabled?: boolean;
    name: TName;
    ref: RefCallBack;
}

/**
 * Custom hook for an abstraction layer for react-hook-form.
 * 
 * @param {ObjectSchema<TFieldValues, AnyObject, { [key in keyof TFieldValues]: any }, "">} schema 
 * *** The yup validation schema used to enforce rules on the form fields. ***
 * *** NOTE: You don't need to inject the type. It will recognize the yup schema automatically
 * 
 * @param {DefaultValues<TFieldValues>} [initialValues] 
 * Optional. The initial values to populate the form with. If not provided, defaults to an empty object.
 * 
 * @returns {object} 
 * *** @prop {fieldName}: {
 * ***      @prop {watch} // this is the normal react hook form watch method, but it does not require a string.
 * ***      @prop {useFieldProps} // this is the same as useController({ name, control }), but it doesn't require any arguments
 * ***      @prop {setValue}: (arg0: TFieldValue) => void
 * *** }
 * *** @prop {reset}: (arg0: TFieldValues) => void
 * *** @prop {submitPending}: boolean
 * *** @prop {handleSubmit}: () => void // while function is running, {submitPending} will return true
 * *** @prop {errors}: // list of errors if needed at a high level
 * Example:
 * ```tsx
 *  const { fields } = useFormImplementation(schema, initialValues);
 *  const name = fields.name.watch()
 *  const nameField = fields.name.useFieldProps()
 * ```
 */
export function useFormImplementation<TFieldValues extends FieldValues>(
    schema: ObjectSchema<TFieldValues, AnyObject, { [key in keyof TFieldValues]: any }, "">,
    submit: (formValues: TFieldValues) => void,
    initialValues?: DefaultValues<TFieldValues>
) {
    const [submitPending, setSubmitPending] = useState(false)

    const fieldNames = Object.keys(schema.fields) as Path<TFieldValues>[];

    const { handleSubmit, reset, setValue, formState: { errors }, control, watch } = useForm({
        mode: "onBlur",
        // @ts-expect-error
        resolver: yupResolver(schema),
        defaultValues: initialValues
    });

    /**
     * This create the additional properties:
     * @prop {fieldName}: {
     *      @prop {watch}: () => value
     *      @prop {useFieldProps}: () => ({
                onChange: (...event: any[]) => void;
                onBlur: Noop;
                value: any;
                name: TName;
                error: boolean;
                helperText?: string;
                initialValue?: any;
     *      })
     *      @prop {setValue}: (arg0: TFieldValue) => void
     * }
     */
    const fields = createFields<TFieldValues>(
        {
            fieldNames,
            control,
            initialValues,
            watch,
            setValue
        }
    )

    const onSubmit = async (formValues: TFieldValues) => {
        setSubmitPending(true);

        await submit(formValues)

        setSubmitPending(false);
    }

    return {
        fields,
        errors,
        handleSubmit: handleSubmit(onSubmit),
        reset,
        submitPending,
    }
}

function createFields<TFieldValues extends FieldValues>(
    {
        fieldNames,
        control,
        initialValues,
        watch,
        setValue
    }: {
        fieldNames: Path<TFieldValues>[],
        control: any,
        initialValues: DefaultValues<TFieldValues> | undefined,
        watch: (_: string) => any,
        setValue: UseFormSetValue<TFieldValues>,
    },
) {
    return fieldNames.reduce<{
        [key in keyof TFieldValues]: {
            useFieldProps: () => IFieldProps<string>;
            watch: () => any;
        };
    }>((
        acc,
        name: Path<TFieldValues>
    ) => ({
        ...acc,
        [name]: {
            name,
            watch: () => watch(name),
            setValue: (arg0: PathValue<TFieldValues, Path<TFieldValues>>) => setValue(name, arg0),
            useFieldProps: () => {
                const { field, fieldState } = useController({ name, control });
                const error = fieldState.error;
                return {
                    ...field,
                    error: !!error,
                    helperText: error?.message || " ",
                    name,
                    initialValue: initialValues?.[name] || "",
                };
            },
        },
    }), {} as {
        [key in keyof TFieldValues]: {
            useFieldProps: () => IFieldProps<string>;
            watch: () => any;
        };
    });
}
