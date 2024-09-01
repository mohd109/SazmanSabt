import {FC} from 'react'
import {PageTitle} from '../../../lib/layout/core'
import {BuilderPage} from './BuilderPage'

const BuilderPageWrapper: FC = () => {
  return (
    <>
      <PageTitle breadcrumbs={[]}>Layout</PageTitle>
      <BuilderPage />
    </>
  )
}

export default BuilderPageWrapper
