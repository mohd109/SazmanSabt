import {FC} from 'react'
import {Field, ErrorMessage} from 'formik'

const Step3: FC = () => {
  return (
    <div className='w-100'>
      <div className='pb-10 pb-lg-12'>
        <h2 className='fw-bolder text-gray-900'>Owner Info</h2>

        <div className='text-gray-500 fw-bold fs-6'>
          Describe the company that was responsible for buying/capturing this dataset
          <a href='/dashboard' className='link-primary fw-bolder'>
            {' '}
            Help Page
          </a>
          .
        </div>
      </div>

      <div className='fv-row mb-10'>
        <label className='form-label required'>Business Name</label>

        <Field name='businessName' className='form-control form-control-lg form-control-solid' />
        <div className='text-danger mt-2'>
          <ErrorMessage name='businessName' />
        </div>
      </div>

      <div className='fv-row mb-10'>
        <label className='d-flex align-items-center form-label'>
          <span className='required'>Business Descriptor</span>
        </label>

        <Field
          name='businessDescriptor'
          className='form-control form-control-lg form-control-solid'
        />
        <div className='text-danger mt-2'>
          <ErrorMessage name='businessDescriptor' />
        </div>

        <div className='form-text'>
          Users will see this shortened version of your statement descriptor
        </div>
      </div>

      <div className='fv-row mb-10'>
        <label className='form-label required'>Corporation Type</label>

        <Field
          as='select'
          name='businessType'
          className='form-select form-select-lg form-select-solid'
        >
          <option></option>
          <option value='1'>Ltd Company</option>
          <option value='1'>Government Organization</option>
          <option value='2'>Website</option>
          <option value='3'>Proxy/Person</option>
          <option value='4'>Hacked/Extracted Data</option>
          <option value='5'>Previous/Owned Data</option>
        </Field>
        <div className='text-danger mt-2'>
          <ErrorMessage name='businessType' />
        </div>
      </div>

      <div className='fv-row mb-10'>
        <label className='form-label'>Business Description</label>

        <Field
          as='textarea'
          name='businessDescription'
          className='form-control form-control-lg form-control-solid'
          rows={3}
        ></Field>
      </div>

      <div className='fv-row mb-0'>
        <label className='fs-6 fw-bold form-label required'>Contact Email/Number</label>

        <Field name='businessEmail' className='form-control form-control-lg form-control-solid' />
        <div className='text-danger mt-2'>
          <ErrorMessage name='businessEmail' />
        </div>
      </div>
    </div>
  )
}

export {Step3}
