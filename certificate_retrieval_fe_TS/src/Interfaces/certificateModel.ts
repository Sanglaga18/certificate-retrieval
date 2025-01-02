export default interface certificateModel {
  certificateID: string;
  registryNumber: string;
  certificateRegisterID: number;
  certificateName: string;
  issueDate: Date;
  isValid: boolean;
  issuingOrganization: string;
  enrollmentID: number;
  image: string;
  description?: string;
}
