export default interface diplomaModel {
  diplomaNumber: string;
  registryNumber: string;
  diplomaRegisterID: number;
  diplomaName: string;
  issueDate: Date;
  isValid: boolean;
  issuingOrganization: string;
  examResultID: number;
  image: string;
  description?: string;
}
