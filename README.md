# React-Hook-Form Abstratced useForm

Putting react-hook-form library behind a layer of abstraction
External libraries for components and hooks only exist in the `core` directory
This means you can easily swap out one library for another one component at a time without breaking the functionality of the application.

## Files
[useFormImplementation hook](https://github.com/hewseph/UseFormImplementation/blob/master/src/core/form/hooks/useFormImplementation.tsx)
```typescript
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

    // wraps the submit method to update submission pending state
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

```


[implementation](https://github.com/hewseph/UseFormImplementation/blob/master/src/app/fms-integration/FmsIntegrationPage.tsx)


```typescript
  const [result, setResult] = useState("")

  const submit = async (formValues: FmsIntegrationForm) => {
    // define submit method
    // ...
    setResult("Success!!")
  }

  const {
    fields,
    reset,
    submitPending,
    handleSubmit
    // schema is a yup validation schema
  } = useFormImplementation(schema, submit);
```
