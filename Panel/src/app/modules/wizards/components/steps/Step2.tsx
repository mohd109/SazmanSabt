import {FC} from 'react'
import {KTIcon} from '../../../../../lib/helpers'
import {ErrorMessage, Field} from 'formik'

const Step2: FC = () => {
  return (
    <div className='w-100'>
      <div className='pb-10 pb-lg-15'>
        <h2 className='fw-bolder text-gray-900'>Dataset Parameters</h2>

        <div className='text-gray-500 fw-bold fs-6'>
          If you need more info, please check out
          <a href='/dashboard' className='link-primary fw-bolder'>
            {' '}
            Help Page
          </a>
          .
        </div>
      </div>

      <div className='mb-10 fv-row'>
        <label className='d-flex align-items-center form-label mb-3'>
          Specify Desired GSD
          <i
            className='fas fa-exclamation-circle ms-2 fs-7'
            data-bs-toggle='tooltip'
            title='Provide your desired GSD to help us setup your tiling parameters'
          ></i>
        </label>

        <div className='row mb-2' data-kt-buttons='true'>
          <div className='col'>
            <Field
              type='radio'
              className='btn-check'
              name='datasetGSD'
              value='1-1'
              id='kt_account_team_size_select_1'
            />
            <label
              className='btn btn-outline btn-outline-dashed btn-outline-default w-100 p-4'
              htmlFor='kt_account_team_size_select_1'
            >
              <span className='fw-bolder fs-3'>1-10cm</span>
            </label>
          </div>

          <div className='col'>
            <Field
              type='radio'
              className='btn-check'
              name='datasetGSD'
              value='2-10'
              id='kt_account_team_size_select_2'
            />
            <label
              className='btn btn-outline btn-outline-dashed btn-outline-default w-100 p-4'
              htmlFor='kt_account_team_size_select_2'
            >
              <span className='fw-bolder fs-3'>10-50cm</span>
            </label>
          </div>

          <div className='col'>
            <Field
              type='radio'
              className='btn-check'
              name='datasetGSD'
              value='10-50'
              id='kt_account_team_size_select_3'
            />
            <label
              className='btn btn-outline btn-outline-dashed btn-outline-default w-100 p-4'
              htmlFor='kt_account_team_size_select_3'
            >
              <span className='fw-bolder fs-3'>50cm-2m</span>
            </label>
          </div>

          <div className='col'>
            <Field
              type='radio'
              className='btn-check'
              name='datasetGSD'
              value='50+'
              id='kt_account_team_size_select_4'
            />
            <label
              className='btn btn-outline btn-outline-dashed btn-outline-default w-100 p-4'
              htmlFor='kt_account_team_size_select_4'
            >
              <span className='fw-bolder fs-3'>2m +</span>
            </label>
          </div>
        </div>

        <div className='form-text'>
          Please add a description for your dataset, e.g. the project or camera name
        </div>
      </div>

      <div className='mb-10 fv-row'>
        <label className='form-label mb-3'>Dataset Name</label>

        <Field
          type='text'
          className='form-control form-control-lg form-control-solid'
          name='datasetName'
        />
        <div className='text-danger mt-2'>
          <ErrorMessage name='datasetName' />
        </div>
      </div>

      <div className='mb-0 fv-row'>
        <label className='d-flex align-items-center form-label mb-5'>
          Select Tiling Plan
          <i
            className='fas fa-exclamation-circle ms-2 fs-7'
            data-bs-toggle='tooltip'
            title='Serving the dataset will be based on this'
          ></i>
        </label>

        <div className='mb-0'>
          <label className='d-flex flex-stack mb-5 cursor-pointer'>
            <span className='d-flex align-items-center me-2'>
              <span className='symbol symbol-50px me-6'>
                <span className='symbol-label'>
                  <KTIcon iconName='bank' className='fs-1 text-gray-600' />
                </span>
              </span>

              <span className='d-flex flex-column'>
                <span className='fw-bolder text-gray-800 text-hover-primary fs-5'>
                  Monochrome
                </span>
                <span className='fs-6 fw-bold text-gray-500'>
                  Tile dataset as monochrome imagery with only 1 band
                </span>
              </span>
            </span>

            <span className='form-check form-check-custom form-check-solid'>
              <Field className='form-check-input' type='radio' name='tilingPlan' value='1' />
            </span>
          </label>

          <label className='d-flex flex-stack mb-5 cursor-pointer'>
            <span className='d-flex align-items-center me-2'>
              <span className='symbol symbol-50px me-6'>
                <span className='symbol-label'>
                  <KTIcon iconName='chart' className='fs-1 text-gray-600' />
                </span>
              </span>

              <span className='d-flex flex-column'>
                <span className='fw-bolder text-gray-800 text-hover-primary fs-5'>
                  Color
                </span>
                <span className='fs-6 fw-bold text-gray-500'>Tile dataset as colored imagery with only 1 band</span>
              </span>
            </span>

            <span className='form-check form-check-custom form-check-solid'>
              <Field className='form-check-input' type='radio' name='tilingPlan' value='2' />
            </span>
          </label>

          <label className='d-flex flex-stack mb-0 cursor-pointer'>
            <span className='d-flex align-items-center me-2'>
              <span className='symbol symbol-50px me-6'>
                <span className='symbol-label'>
                  <KTIcon iconName='chart-pie-4' className='fs-1 text-gray-600' />
                </span>
              </span>

              <span className='d-flex flex-column'>
                <span className='fw-bolder text-gray-800 text-hover-primary fs-5'>
                  DEM
                </span>
                <span className='fs-6 fw-bold text-gray-500'>
                Tile dataset as elevation data with only 1 band
                </span>
              </span>
            </span>

            <span className='form-check form-check-custom form-check-solid'>
              <Field className='form-check-input' type='radio' name='tilingPlan' value='3' />
            </span>
          </label>
        </div>
      </div>
    </div>
  )
}

export {Step2}
