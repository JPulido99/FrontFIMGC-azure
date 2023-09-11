//Componente donde se pondrán las vistas  a las que puede tener acceso el admin o usuario privilegiado.
import React from 'react';

import Footer from './shared/Footer';

const Admin = () => {
  return (
    <div>
      <SidebarAdmin />
      <Footer />
    </div>
  )
}

export default Admin