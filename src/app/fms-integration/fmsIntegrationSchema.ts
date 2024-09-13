import * as yup from "yup";
import { ManagementSoftware } from "../../core/enums/ManagementSoftware";


const fmsValidation = {
    managementSoftware: yup.number().min(0).label("Management Software").required(),
    companyApiKey: yup.string().nullable()
        .test('companyApiKey-validation', 'Company ID is required', function (value) {
            const managementSoftware = this.parent.managementSoftware;
            if (managementSoftware == ManagementSoftware.storEDGE) {
                return !!value // value is required
            }
            return true; // value is not required
        }),
    corporateCode: yup.string().nullable().label("Corporate Code")
        .test('corporateCode-validation', 'Corporate Code is required', function (value) {
            const managementSoftware = this.parent.managementSoftware;
            return managementSoftware != ManagementSoftware.SiteLink || !!value;
        }),
    corporateUsername: yup.string().nullable().label("Corporate Username")
        .test('corporateUsername-validation', 'Corporate Username is required', function (value) {
            const managementSoftware = this.parent.managementSoftware;
            return managementSoftware != ManagementSoftware.SiteLink || !!value;
        }),
    corporatePassword: yup.string().nullable().label("Corporate Password")
        .test('corporatePassword-validation', 'Corporate Password is required', function (value) {
            const managementSoftware = this.parent.managementSoftware;
            return managementSoftware != ManagementSoftware.SiteLink || !!value;
        }),
}

export const fmsIntegrationSchema = yup.object().shape({
    id: yup.number().default(0).required(), // default(0) means you don't have to give it a value to meet the `required` validation
    name: yup.string().required(),
    ...fmsValidation
}).required();

/** 
 * You don't need to define a type or interface fo the FmsIntegrationForm
 * yup can build the type for you.
 */
export type FmsIntegrationForm = yup.InferType<typeof fmsIntegrationSchema>;

