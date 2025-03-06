import React from 'react';
import IconsImg from '@/assets/images/icons.webp'; // Correct: using alias
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react';
import { DocsLink } from '@/components'; // Correct: using alias

const DocsIcons: React.FC = () => {
  return (
    <CCard className="mb-4">
      <CCardHeader>Icons</CCardHeader>
      <CCardBody>
        <p className="text-medium-emphasis small">
          CoreUI Free React Admin Template offers over 1500 icons in the form of a{' '}
          <DocsLink href="https://coreui.io/icons/free/">CoreUI Icons</DocsLink> component. Here is a
          list of all available icons:
        </p>
        <CRow className="text-center">
          <CCol xs={12}>
            <img src={IconsImg} style={{ width: '40%' }} alt="CoreUI Icons" />
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>
  );
};

export default DocsIcons;
