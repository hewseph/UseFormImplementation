import { useState } from 'react';

import { FmsIntegrationForm, fmsIntegrationSchema } from './fmsIntegrationSchema';

/** Core Imports */
import { H3 } from '../../core/typographies';
import { useFormImplementation } from '../../core/form/hooks/useFormImplementation';
import FormButton from '../../core/buttons/FormButton';
import FormField from '../../core/form/components/FormField';
import FormSelect from '../../core/form/components/FormSelect';
import InputSection from '../../core/data-layout/InputSection';
import Surface from '../../core/surfaces/Surface';
import { ManagementSoftware } from '../../core/enums/ManagementSoftware';

const options = [
  { value: ManagementSoftware['Not listed'], label: "Not Listed" },
  { value: ManagementSoftware.storEDGE, label: "StorEdge" },
  { value: ManagementSoftware.SiteLink, label: "SiteLink" }
]

function FmsIntegrationPage() {
  const [result, setResult] = useState("")
  const submit = async (formValues: FmsIntegrationForm) => {
    await fakeMakeRequest(formValues);

    setResult("Success!!")
  }

  const {
    fields,
    reset,
    submitPending,
    handleSubmit
  } = useFormImplementation(fmsIntegrationSchema, submit);

  const managementSoftware = fields.managementSoftware.watch();

  if (result) {
    return <Surface center><h3>{result}</h3></Surface>
  }

  return (
    <Surface>
      <H3>Fms Form</H3>

      <InputSection>
        <FormSelect
          options={options}
          label="Select Management Software"
          onSelectedValueChange={(value: ManagementSoftware) => {
            // clear out all text fields except the management software when management software is changing
            reset({ managementSoftware: value });
          }}
          {...fields.managementSoftware}
        />

        {
          managementSoftware == ManagementSoftware.storEDGE
            ? <FormField
              label="Company Api Key"
              {...fields.companyApiKey}
            />
            : managementSoftware == ManagementSoftware.SiteLink
              ? <>
                <FormField
                  label="Corporate Code"
                  {...fields.corporateCode}
                />

                <FormField
                  label="Corporate Username"
                  {...fields.corporateUsername}
                />

                <FormField
                  label="Corporate Password"
                  {...fields.corporatePassword}
                />
              </>
              : null
        }

        <FormButton
          pending={submitPending}
          disabled={!managementSoftware}
          onClick={handleSubmit}
        >
          Submit
        </FormButton>
      </InputSection>
    </Surface>
  )
}

export default FmsIntegrationPage

const fakeMakeRequest = async (payload: any) => {
  function taskDelay(milliseconds: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, milliseconds);
    });
  }

  await taskDelay(3000);

  return;
}