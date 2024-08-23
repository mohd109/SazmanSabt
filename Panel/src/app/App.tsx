import {Suspense} from 'react'
import {Outlet} from 'react-router-dom'
import {I18nProvider} from '../lib/i18n/i18nProvider'
import {LayoutProvider, LayoutSplashScreen} from '../lib/layout/core'
import {MasterInit} from '../lib/layout/MasterInit'
import {AuthInit} from './modules/auth'
import {ThemeModeProvider} from '../lib/partials'

const App = () => {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <I18nProvider>
        <LayoutProvider>
          <ThemeModeProvider>
            <AuthInit>
              <Outlet />
              <MasterInit />
            </AuthInit>
          </ThemeModeProvider>
        </LayoutProvider>
      </I18nProvider>
    </Suspense>
  )
}

export {App}
