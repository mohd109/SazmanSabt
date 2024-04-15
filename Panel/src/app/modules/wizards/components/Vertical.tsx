import { useEffect, useRef, useState } from 'react'
import { KTIcon } from '../../../../_metronic/helpers'
import { Step1 } from './steps/Step1'
import { Step2 } from './steps/Step2'
import { Step3 } from './steps/Step3'
import { Step4 } from './steps/Step4'
import { Step5 } from './steps/Step5'
import { StepperComponent } from '../../../../_metronic/assets/ts/components'
import { Form, Formik, FormikValues } from 'formik'
import { createAccountSchemas, ICreateAccount, inits } from './CreateAccountWizardHelper'
import { ToolbarWrapper } from '../../../../_metronic/layout/components/toolbar'
import { Content } from '../../../../_metronic/layout/components/content'
import { AxiosResponse } from 'axios'
import { login, sendPostRequest } from '../../auth/core/_requests'
import { useAuth } from '../../auth/core/Auth'

const Vertical = () => {
  const stepperRef = useRef<HTMLDivElement | null>(null)
  const [stepper, setStepper] = useState<StepperComponent | null>(null)
  const [currentSchema, setCurrentSchema] = useState(createAccountSchemas[0])
  const [initValues] = useState<ICreateAccount>(inits)
  const [loginSuccess, setLoginSuccess] = useState(false);
  const {currentUser} = useAuth()


  async function submitDataset() {
    if (!loginSuccess) {
      let loginResponse: any = await login(currentUser?.email as any,currentUser?.password as any,currentUser?.user_name as any);
      setLoginSuccess(true);
    }
    const tempSchema = currentSchema as any;

    const tempBody = {
      id: 1,
      type_id: tempSchema.multiPart == '1' ? 1 : 0,
      creation_date_time: tempSchema.captureYear == undefined?"":tempSchema.captureYear + '-' + tempSchema.captureMonth == undefined?"":tempSchema.captureMonth  + '-' + tempSchema.captureDayHour == undefined?"":tempSchema.captureDayHour,
      access_level: 1,
      owner_id: -1,
      tile_id: -1,
      url: tempSchema.datasetName == undefined?"":tempSchema.datasetName,
      name: tempSchema.cameraModel == undefined?"":tempSchema.cameraModel,
    }
    console.log(tempBody);

    let response: AxiosResponse<any, any> = await sendPostRequest(tempBody as any,"http://panel.sabt.shankayi.ir/api/add_dataset");

    if (response.status == 200) {
      return response.data;
    }
    return [];
  }


  const loadStepper = () => {
    setStepper(StepperComponent.createInsance(stepperRef.current as HTMLDivElement))
  }

  const prevStep = () => {
    if (!stepper) {
      return
    }

    stepper.goPrev()

    setCurrentSchema(createAccountSchemas[stepper.currentStepIndex - 1])
  }

  const submitStep = (values: ICreateAccount, actions: FormikValues) => {
    if (!stepper) {
      return
    }

    if (stepper.currentStepIndex < stepper.totalStepsNumber - 1) {
      stepper.goNext()
    } else if (stepper.currentStepIndex === stepper.totalStepsNumber - 1) {
      //send add dataset request
      submitDataset().then(response => { stepper.goNext() })
    }
    else {
      stepper.goto(1)
      actions.resetForm()
    }

    console.log(values);

    setCurrentSchema(createAccountSchemas[stepper.currentStepIndex - 1])
  }

  useEffect(() => {
    if (!stepperRef.current) {
      return
    }

    loadStepper()
  }, [stepperRef])

  return (
    <>
      <ToolbarWrapper />
      <Content>
        <div
          ref={stepperRef}
          className='stepper stepper-pills stepper-column d-flex flex-column flex-xl-row flex-row-fluid'
          id='kt_create_account_stepper'
        >
          {/* begin::Aside*/}
          <div className='card d-flex justify-content-center justify-content-xl-start flex-row-auto w-100 w-xl-300px w-xxl-400px me-9'>
            {/* begin::Wrapper*/}
            <div className='card-body px-6 px-lg-10 px-xxl-15 py-20'>
              {/* begin::Nav*/}
              <div className='stepper-nav'>
                {/* begin::Step 1*/}
                <div className='stepper-item current' data-kt-stepper-element='nav'>
                  {/* begin::Wrapper*/}
                  <div className='stepper-wrapper'>
                    {/* begin::Icon*/}
                    <div className='stepper-icon w-40px h-40px'>
                      <i className='stepper-check fas fa-check'></i>
                      <span className='stepper-number'>1</span>
                    </div>
                    {/* end::Icon*/}

                    {/* begin::Label*/}
                    <div className='stepper-label'>
                      <h3 className='stepper-title'>Dataset Type</h3>

                      <div className='stepper-desc fw-semibold'>Setup Your Dataset Category</div>
                    </div>
                    {/* end::Label*/}
                  </div>
                  {/* end::Wrapper*/}

                  {/* begin::Line*/}
                  <div className='stepper-line h-40px'></div>
                  {/* end::Line*/}
                </div>
                {/* end::Step 1*/}

                {/* begin::Step 2*/}
                <div className='stepper-item' data-kt-stepper-element='nav'>
                  {/* begin::Wrapper*/}
                  <div className='stepper-wrapper'>
                    {/* begin::Icon*/}
                    <div className='stepper-icon w-40px h-40px'>
                      <i className='stepper-check fas fa-check'></i>
                      <span className='stepper-number'>2</span>
                    </div>
                    {/* end::Icon*/}

                    {/* begin::Label*/}
                    <div className='stepper-label'>
                      <h3 className='stepper-title'>Dataset Parameters</h3>
                      <div className='stepper-desc fw-semibold'>Setup Your Dataset Parameters</div>
                    </div>
                    {/* end::Label*/}
                  </div>
                  {/* end::Wrapper*/}

                  {/* begin::Line*/}
                  <div className='stepper-line h-40px'></div>
                  {/* end::Line*/}
                </div>
                {/* end::Step 2*/}

                {/* begin::Step 3*/}
                <div className='stepper-item' data-kt-stepper-element='nav'>
                  {/* begin::Wrapper*/}
                  <div className='stepper-wrapper'>
                    {/* begin::Icon*/}
                    <div className='stepper-icon w-40px h-40px'>
                      <i className='stepper-check fas fa-check'></i>
                      <span className='stepper-number'>3</span>
                    </div>
                    {/* end::Icon*/}

                    {/* begin::Label*/}
                    <div className='stepper-label'>
                      <h3 className='stepper-title'>Owner Info</h3>
                      <div className='stepper-desc fw-semibold'>Set Responsible Company Information</div>
                    </div>
                    {/* end::Label*/}
                  </div>
                  {/* end::Wrapper*/}

                  {/* begin::Line*/}
                  <div className='stepper-line h-40px'></div>
                  {/* end::Line*/}
                </div>
                {/* end::Step 3*/}

                {/* begin::Step 4*/}
                <div className='stepper-item' data-kt-stepper-element='nav'>
                  {/* begin::Wrapper*/}
                  <div className='stepper-wrapper'>
                    {/* begin::Icon*/}
                    <div className='stepper-icon w-40px h-40px'>
                      <i className='stepper-check fas fa-check'></i>
                      <span className='stepper-number'>4</span>
                    </div>
                    {/* end::Icon*/}

                    {/* begin::Label*/}
                    <div className='stepper-label'>
                      <h3 className='stepper-title'>Dataset Details</h3>
                      <div className='stepper-desc fw-semibold'>Set Your Dataset Metadata</div>
                    </div>
                    {/* end::Label*/}
                  </div>
                  {/* end::Wrapper*/}

                  {/* begin::Line*/}
                  <div className='stepper-line h-40px'></div>
                  {/* end::Line*/}
                </div>
                {/* end::Step 4*/}

                {/* begin::Step 5*/}
                <div className='stepper-item' data-kt-stepper-element='nav'>
                  {/* begin::Wrapper*/}
                  <div className='stepper-wrapper'>
                    {/* begin::Icon*/}
                    <div className='stepper-icon w-40px h-40px'>
                      <i className='stepper-check fas fa-check'></i>
                      <span className='stepper-number'>5</span>
                    </div>
                    {/* end::Icon*/}

                    {/* begin::Label*/}
                    <div className='stepper-label'>
                      <h3 className='stepper-title'>Completed</h3>
                      <div className='stepper-desc fw-semibold'>Woah, we are here</div>
                    </div>
                    {/* end::Label*/}
                  </div>
                  {/* end::Wrapper*/}
                </div>
                {/* end::Step 5*/}
              </div>
              {/* end::Nav*/}
            </div>
            {/* end::Wrapper*/}
          </div>
          {/* begin::Aside*/}

          <div className='d-flex flex-row-fluid flex-center bg-body rounded'>
            <Formik validationSchema={currentSchema} initialValues={initValues} onSubmit={submitStep}>
              {() => (
                <Form className='py-20 w-100 w-xl-700px px-9' noValidate id='kt_create_account_form' placeholder={undefined}>
                  <div className='current' data-kt-stepper-element='content'>
                    <Step1 />
                  </div>

                  <div data-kt-stepper-element='content'>
                    <Step2 />
                  </div>

                  <div data-kt-stepper-element='content'>
                    <Step3 />
                  </div>

                  <div data-kt-stepper-element='content'>
                    <Step4 />
                  </div>

                  <div data-kt-stepper-element='content'>
                    <Step5 />
                  </div>

                  <div className='d-flex flex-stack pt-10'>
                    <div className='mr-2'>
                      <button
                        onClick={prevStep}
                        type='button'
                        className='btn btn-lg btn-light-primary me-3'
                        data-kt-stepper-action='previous'
                      >
                        <KTIcon iconName='arrow-left' className='fs-4 me-1' />
                        Back
                      </button>
                    </div>

                    <div>
                      <button type='submit' className='btn btn-lg btn-primary me-3'>
                        <span className='indicator-label'>
                          {stepper?.currentStepIndex !== ((stepper?.totalStepsNumber || 2) - 1) && 'Continue'}
                          {stepper?.currentStepIndex === ((stepper?.totalStepsNumber || 2) - 1) && 'Submit'}
                          <KTIcon iconName='arrow-right' className='fs-3 ms-2 me-0' />
                        </span>
                      </button>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </Content>
    </>
  )
}

export { Vertical }
