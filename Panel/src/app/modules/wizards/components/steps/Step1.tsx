import {FC} from 'react'
import {KTIcon} from '../../../../../_metronic/helpers'
import {ErrorMessage, Field} from 'formik'

const Step1: FC = () => {
  return (
    <div className='w-100'>
      <div className='pb-10 pb-lg-15'>
        <h2 className='fw-bolder d-flex align-items-center text-gray-900'>
          Choose Dataset Type
          <i
            className='fas fa-exclamation-circle ms-2 fs-7'
            data-bs-toggle='tooltip'
            title='Tiling process is based on your dataset type'
          ></i>
        </h2>

        <div className='text-gray-500 fw-bold fs-6'>
          If you need more info, please check out
          <a href='/dashboard' className='link-primary fw-bolder'>
            {' '}
            Help Page
          </a>
          .
        </div>
      </div>

      <div className='fv-row'>
        <div className='row'>
          <div className='col-lg-6'>
            <Field
              type='radio'
              className='btn-check'
              name='datasetType'
              value='personal'
              id='kt_create_account_form_account_type_personal'
            />
            <label
              className='btn btn-outline btn-outline-dashed btn-outline-default p-7 d-flex align-items-center mb-10'
              htmlFor='kt_create_account_form_account_type_personal'
            >
              <KTIcon iconName='address-book' className='fs-3x me-5' />

              <span className='d-block fw-bold text-start'>
                <span className='text-gray-900 fw-bolder d-block fs-4 mb-2'>DEM</span>
                <span className='text-gray-500 fw-bold fs-6'>
                DEM/DSM/DTM
                </span>
              </span>
            </label>
          </div>

          <div className='col-lg-6'>
            <Field
              type='radio'
              className='btn-check'
              name='datasetType'
              value='corporate'
              id='kt_create_account_form_account_type_corporate'
            />
            <label
              className='btn btn-outline btn-outline-dashed btn-outline-default p-7 d-flex align-items-center'
              htmlFor='kt_create_account_form_account_type_corporate'
            >
              <KTIcon iconName='briefcase' className='fs-3x me-5' />

              <span className='d-block fw-bold text-start'>
                <span className='text-gray-900 fw-bolder d-block fs-4 mb-2'>Imagery</span>
                <span className='text-gray-500 fw-bold fs-6'>
                  Aerial or Satellite Imagery
                </span>
              </span>
            </label>
          </div>

          <div className='text-danger mt-2'>
            <ErrorMessage name='datasetType' />
          </div>
        </div>
      </div>
    </div>
  )
}

export {Step1}
