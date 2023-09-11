import React from 'react';
import Login_Reg from './components/Login_Reg';
import reactLogo from './assets/react.svg';
import SolicitanteExpedientesObservados from './components/SolicitanteExpedientesObservados';
import BienvenidoInicio from './components/BienvenidoInicio';
import Solicitante from './components/Solicitante';
import Documentos from './components/Documentos';
import Params from './components/Params';
import Bandeja from './components/Bandeja';
import TokenExpirado from './components/verificacion/TokenExpirado';
import EnviarExpediente from './components/EnviarExpediente';
import EnviarDictamen from './components/EnviarDictamen';
import EnviarConstTurnitin from './components/EnviarConstTurnitin';
import VerificadoExitoso from './components/verificacion/VerificadoExitoso';
import RestablecerCont from './components/verificacion/RestablecerCont';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Public from "./routes/Public";
import Private from "./routes/Private";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>

          <Route path="/" element={<Public> <Login_Reg /></Public>} />

          <Route path="/tokenExpirado" element={<Public> <TokenExpirado /> </Public>} />
          <Route path="/verificadoExitoso" element={<Public> <VerificadoExitoso /> </Public>} />
          <Route path="/resetPassword" element={<Public> <RestablecerCont /> </Public>} />
          <Route path="/bandeja" element={<Private> <Bandeja /></Private>} />
          <Route path="/bienvenido" element={<Private> <BienvenidoInicio /> </Private>} />
          <Route path="/enviar-dictamen" element={<Private> <EnviarDictamen /> </Private>} />
          <Route path="/enviar-expediente" element={<Private> <EnviarExpediente /> </Private>} />
          <Route path="/documentos" element={<Private> <Documentos /> </Private>} />
          <Route path="/params" element={<Private> <Params /> </Private>} />
          <Route path="/tramites" element={<Private> <Solicitante /> </Private>} />
          <Route path="/expediente-observado/id" element={<SolicitanteExpedientesObservados />}/>
          <Route path="*" element={<Private> <BienvenidoInicio /> </Private>} />
          {/* <Route path='/DetailProduct/:id' element={<DetailProduct />} /> */}

           {/*<Route path='/correo-verificado' element={<VerificadoExitoso />} />*/}
          <Route path='/enviar-constancia' element={<Private>  <EnviarConstTurnitin /></Private>} />
          <Route path='/restablecer/idUsuario' element={<RestablecerCont />} />
          <Route path='/token-expirado' element={<TokenExpirado />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App
