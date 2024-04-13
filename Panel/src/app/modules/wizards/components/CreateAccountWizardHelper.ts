import * as Yup from 'yup'

export interface ICreateAccount {
  datasetType: string
  datasetGSD: string
  datasetName: string
  tilingPlan: string
  businessName: string
  businessDescriptor: string
  businessType: string
  businessDescription: string
  businessEmail: string
  cameraModel: string
  flyingHeight: string
  captureMonth: string
  captureYear: string
  captureDayHour: string
  multiPart: string
}

const createAccountSchemas = [
  Yup.object({
    datasetType: Yup.string().required().label('Dataset Type'),
  }),
  Yup.object({
    datasetName: Yup.string().required().label('Dataset Name'),
  }),
  Yup.object({
    businessName: Yup.string().required().label('Business Name'),
    businessDescriptor: Yup.string().required().label('Business Descriptor'),
    businessType: Yup.string().required().label('Corporation Type'),
    businessEmail: Yup.string().required().label('Contact Email/Number'),
  }),
  Yup.object({
    cameraModel: Yup.string().required().label('Camera/Sensor Model'),
    flyingHeight: Yup.string().required().label('Flying Height'),
    captureMonth: Yup.string().required().label('Capture Month'),
    captureYear: Yup.string().required().label('Capture Year'),
    captureDayHour: Yup.string().required().label('Day-Hour'),
  }),
]

const inits: ICreateAccount = {
  datasetType: 'personal',
  datasetGSD: '50+',
  datasetName: '',
  tilingPlan: '1',
  businessName: 'Keenthemes Inc.',
  businessDescriptor: 'KEENTHEMES',
  businessType: '1',
  businessDescription: '',
  businessEmail: 'corp@support.com',
  cameraModel: 'Max Doe',
  flyingHeight: '4111 1111 1111 1111',
  captureMonth: '1',
  captureYear: '2025',
  captureDayHour: '123',
  multiPart: '1',
}

export {createAccountSchemas, inits}
