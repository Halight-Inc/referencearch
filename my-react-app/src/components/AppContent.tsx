import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'
import type { IRoute } from '../types/routes'; // Import the IRoute type

// routes config
import routes from '../routes'

const AppContent = () => {
  return (
    <CContainer className="px-4" lg>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          {routes.map((route: IRoute, idx: number) => { // Explicitly type route and idx
            return (
              route.element && (
                <Route
                  key={idx}
                  path={route.path}
                  element={<route.element />} // Removed exact and name from here
                />
              )
            )
          })}
          <Route path="/" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </Suspense>
    </CContainer>
  )
}

export default React.memo(AppContent)
