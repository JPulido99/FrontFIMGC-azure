import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Tab, Tabs, Container, Form, FormCheck, ListGroup, InputGroup, Button, Row, Col, Table, Modal, Alert, OverlayTrigger, Tooltip, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { unstable_batchedUpdates } from 'react-dom';

const Dictamen = () => {

  //FUNCION VERIFICAR EXPEDIENTE
  const [nroDoc, setNroDoc] = useState('');
  const [interesadoEmail, setInteresadoEmail] = useState('');
  
  const [tramiteExpediente, setTramiteExpediente] = useState('');

  const [showAlertaExp, setShowAlertaExp] = useState(false);
  const [alertaExp, setAlertaExp] = useState({ message: "", type: "" });

  const mensajesAlert = {
    existe: "Expediente encontrado.",
    noExiste: "Expediente NO encontrado.",
  };

  const verificarExp = async () => {
    const inputNroDoc = document.getElementById('numeroExpDTP').value;
    setNroDoc(inputNroDoc);
    console.log(inputNroDoc);
    try {
      const veriResponse = await axios.get(`https://fimgc-back.rj.r.appspot.com/api/expediente/${inputNroDoc}`);
      console.log(veriResponse.data)
      setTramiteExpediente(veriResponse.data.tramite.nombre)      
      console.log(veriResponse.data.tramite.nombre)

      if (veriResponse.data) {
        setAlertaExp({ message: mensajesAlert.existe, type: 'success' });

        const emailiResponse = await axios.get(`https://fimgc-back.rj.r.appspot.com/api/expediente/emaili/${inputNroDoc}`);
        console.log(emailiResponse.data);
        setInteresadoEmail(emailiResponse.data);

      } else {
        setAlertaExp({ message: mensajesAlert.noExiste, type: 'danger' });
      }
    } catch (error) {
      setAlertaExp({ message: 'Ocurrió un error al realizar la solicitud.', type: 'danger' });
    }
    setShowAlertaExp(true);
  };

  //PAL MODAL DE VISUALIZAR
  //Para el modal en el que se ven los datos ingresados
  const [modalDatosDt, setModalDatosDt] = useState(false);
  const handleOcultarDt = () => setModalDatosDt(false);

  const [prevDocumento, setprevDocumento] = useState({});

  //PARA SETEAR LOS INPUTS EN EL OBJETO DOCUMENTO

  const [documentoDictamen, setDocumentoDictamen] = useState({
    numeroDocumento: '',
    fechaGeneracion: '',
    resultado: '',
  });

  const handleInputChange2 = (event) => {
    const { name, value } = event.target;

    setDocumentoDictamen((prevDocumento) => ({
      ...prevDocumento,
      [name]: value,
    }));
  };

  //PARA EL GUARDADO DE DATOS, SUBIDA DE ARCHIVO Y ENVIO DE GMAIL
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);

  const handleArchivoChange = (event) => {
    const file = event.target.files[0];
    setArchivoSeleccionado(file);
  };



  const [enviandoCorreo, setEnviandoCorreo] = useState(false);
  const [envioExitoso, setEnvioExitoso] = useState(false);

  const [shouldReload, setShouldReload] = useState(false);

  const enviarCorreo = async () => {
    setEnviandoCorreo(true);
    // Primero, realizamos la carga del archivo al backend
    try {
      // Envía el datos de documento al backend para guardarlo
      const dataToSendDoc = {
        "numeroDocumento": documentoDictamen.numeroDocumento,
        "fechaGeneracion": documentoDictamen.fechaGeneracion,
        "resultado": documentoDictamen.resultado,
      };
      const documentoResponse = await axios.post(`https://fimgc-back.rj.r.appspot.com/api/documento/${nroDoc}/actualizarDictamen`, dataToSendDoc);
      //const rutaArchivo = uploadResponse.data;
      console.log(documentoResponse);

      if (documentoResponse.data) {
        const formData = new FormData();
        formData.append('file', archivoSeleccionado); // Añade el archivo seleccionado al FormData
        formData.append('nroExpediente', nroDoc);
        // Envía el archivo al backend para guardarlo
        const uploadResponse = await axios.post('https://fimgc-back.rj.r.appspot.com/api/expediente/upload', formData);
        const rutaArchivo = uploadResponse.data;

        if (uploadResponse.data && tramiteExpediente === 'Obtención de Bachiller') {
          // Si la carga del archivo fue exitosa, continuamos con el envío del correo electrónico
          const recipientEmail = documentoDictamen.resultado === "Apto"
            ? "junior.pulido.27@unsch.edu.pe" // correo decanatura - Replace this with the appropriate email address for Apto resultado
            : interesadoEmail; // Replace this with the appropriate email address for No Apto resultado

          // Creamos el objeto con los datos para el correo electrónico
          const dataToSendEmail = {
            "to": [recipientEmail],
            "subject": "Dictamen Aprobatorio para Obtención de Bachiller (Dict+MM+Exp)",
            "body": "Hola :)",
            "pdfFilePath": rutaArchivo
          };
          const sendResponse = await axios.post('https://fimgc-back.rj.r.appspot.com/sendEmail', dataToSendEmail);
          console.log('Correo enviado:', sendResponse.data);
          setEnvioExitoso(true);
          setShouldReload(true);
        } else if (uploadResponse.data && tramiteExpediente === 'Plan de Tesis') {
          // Si la carga del archivo fue exitosa, continuamos con el envío del correo electrónico
          const recipientEmail = documentoDictamen.resultado === "Apto"
            ? "junior.pulido.27@unsch.edu.pe" // correo decanatura - Replace this with the appropriate email address for Apto resultado
            : interesadoEmail; // Replace this with the appropriate email address for No Apto resultado

          // Creamos el objeto con los datos para el correo electrónico
          const dataToSendEmail = {
            "to": [recipientEmail],
            "subject": "Dictamen Aprobatorio de Plan de Tesis (Dict+MM+Exp)",
            "body": "Hola :)",
            "pdfFilePath": rutaArchivo
          };
          const sendResponse = await axios.post('https://fimgc-back.rj.r.appspot.com/sendEmail', dataToSendEmail);
          console.log('Correo enviado:', sendResponse.data);
          setEnvioExitoso(true);
          setShouldReload(true);
        } else if (uploadResponse.data && tramiteExpediente === 'Borrador de Tesis') {
          // Si la carga del archivo fue exitosa, continuamos con el envío del correo electrónico
          const recipientEmail = documentoDictamen.resultado === "Apto"
            ? "junior.pulido.27@unsch.edu.pe" // correo decanatura - Replace this with the appropriate email address for Apto resultado
            : interesadoEmail; // Replace this with the appropriate email address for No Apto resultado

          // Creamos el objeto con los datos para el correo electrónico
          const dataToSendEmail = {
            "to": [recipientEmail],
            "subject": "Dictamen Aprobatorio de Borrador de Tesis (Dict+MM+Exp)",
            "body": "Hola :)",
            "pdfFilePath": rutaArchivo
          };
          const sendResponse = await axios.post('https://fimgc-back.rj.r.appspot.com/sendEmail', dataToSendEmail);
          console.log('Correo enviado:', sendResponse.data);
          setEnvioExitoso(true);
          setShouldReload(true);
        } else if (uploadResponse.data && tramiteExpediente === 'Obtención de Título Profesional') {
          // Si la carga del archivo fue exitosa, continuamos con el envío del correo electrónico
          const recipientEmail = documentoDictamen.resultado === "Apto"
            ? "junior.pulido.27@unsch.edu.pe" // correo decanatura - Replace this with the appropriate email address for Apto resultado
            : interesadoEmail; // Replace this with the appropriate email address for No Apto resultado

          // Creamos el objeto con los datos para el correo electrónico
          const dataToSendEmail = {
            "to": [recipientEmail],
            "subject": "Dictamen Aprobatorio para Obtención de Título Profesional (Dict+MM+Exp)",
            "body": "Hola :)",
            "pdfFilePath": rutaArchivo
          };
          const sendResponse = await axios.post('https://fimgc-back.rj.r.appspot.com/sendEmail', dataToSendEmail);
          console.log('Correo enviado:', sendResponse.data);
          setEnvioExitoso(true);
          setShouldReload(true);
        } else {
          console.log('Error al cargar el archivo PDF.');
        }
      } else
        console.log('Error al actualizar los campos de documento.');
    } catch (error) {
      console.error('Error al realizar la carga del archivo o enviar el correo electrónico:', error);
    } finally {
      setEnviandoCorreo(false);
    }
  };

  //ACCION DE CLICK EN BOTON
  const VerificarGuardarEnviar = () => {
    setprevDocumento({

      numeroDoc: documentoDictamen.numeroDocumento,
      fechaGen: documentoDictamen.fechaGeneracion,
      res: documentoDictamen.resultado,

    });
    setModalDatosDt(true);
  }

  return (
    <div>
      <Container>
        <Form>
          <fieldset className='customize-fielset'>
            <legend className='customize-legend text-uppercase'>Enviar dictamen</legend>

            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="2" className="fw-bold customize-label">Nº de expediente</Form.Label>
              <Col sm="10">
                <InputGroup>
                  <Form.Control type="text" placeholder="Ingrese el número de expediente."
                    aria-label="Ingrese el número de expediente."
                    id="numeroExpDTP"
                  />
                  <Button variant="outline-dark" onClick={verificarExp}><i className="fi fi-bs-search-alt"></i> Verificar</Button>
                </InputGroup>
                {showAlertaExp && (
                  <Alert variant={alertaExp.type} className='customize-alert-input' show={showAlertaExp}>
                    {alertaExp.message}
                  </Alert>
                )}
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="2" className="fw-bold customize-label">Título de dictamen</Form.Label>
              <Col sm="5">
                <Form.Control type="text" id="numeroDocumento" name="numeroDocumento" placeholder="Ejemplo: dictamen segun criterio escuelas"
                  aria-label="Ingrese el número de expediente." value={documentoDictamen.numeroDocumento}
                  aria-describedby="basic-addon1" onChange={handleInputChange2}
                />
              </Col>

              <Form.Label column sm="2" className="fw-bold customize-label">Fecha de dictamen</Form.Label>
              <Col sm="3">
                <Form.Control type="date" id="fechaGeneracion" name="fechaGeneracion" value={documentoDictamen.fechaGeneracion} onChange={handleInputChange2} />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="2" className="fw-bold customize-label">
                Resultado
              </Form.Label>
              <Col sm="10">
                <FormCheck
                  inline
                  label="Apto/Procedente"
                  name="resultado"
                  value="Apto"
                  type="radio"
                  checked={documentoDictamen.resultado === "Apto"}
                  onChange={handleInputChange2}
                />
                <FormCheck
                  inline
                  label="No apto/Improcedente"
                  name="resultado"
                  value="No apto"
                  type="radio"
                  checked={documentoDictamen.resultado === "No apto"}
                  onChange={handleInputChange2}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="2" className="fw-bold customize-label"><i className="fi fi-bs-file-upload"></i> Subir dictamen</Form.Label>
              <Col sm="10">
                <InputGroup>
                  <Form.Control name="pdf" type="file" onChange={handleArchivoChange} />
                  <Button variant="outline-dark" onClick={VerificarGuardarEnviar} >Enviar  <i className="fi fi-bs-paper-plane"></i></Button>
                </InputGroup>
              </Col>
            </Form.Group>

          </fieldset>
        </Form>

        <Modal aria-labelledby="modal-previsulizacion" size="lg" show={modalDatosDt}>

          {envioExitoso ? (
            <>
              <Modal.Header closeButton onHide={() => {
                handleOcultarDt();
                if (shouldReload) {
                  window.location.reload(); // Reload the page
                }
              }}>
                  <Modal.Title className='title-modal1'>Envío exitoso</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <p>Párrafo de prueba: Ëxito al enviar</p>
                </Modal.Body>
              </>
              ) : (
              <>



                <Modal.Header closeButton onHide={handleOcultarDt}>
                  <Modal.Title className='title-modal1'>Verificar datos</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <p className='p-modal-bold'>¿Los datos que se muestran a continuación son correctos?</p>
                  <Form>
                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm="4" className="fw-bold customize-label">Número de Dictamen</Form.Label>
                      <Col sm="8">
                        <Form.Control plaintext readOnly value={prevDocumento.numeroDoc} />
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm="4" className="fw-bold customize-label">Fecha de Dictamen</Form.Label>
                      <Col sm="8">
                        <Form.Control plaintext readOnly value={prevDocumento.fechaGen} />
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm="4" className="fw-bold customize-label">Resultado</Form.Label>
                      <Col sm="8">
                        <Form.Control plaintext readOnly value={prevDocumento.res} />
                      </Col>
                    </Form.Group>
                  </Form>

                  <div className='customize-btn-div justify-content-end'>
                    <Button className='customize-btn-1' onClick={enviarCorreo} disabled={enviandoCorreo}>
                      {enviandoCorreo ? (
                        <>
                          <Spinner as="span" animation="border" role="status" aria-hidden="true" />
                          <span> Enviando...</span>
                        </>
                      ) : (
                        <>Enviar</>
                      )}
                    </Button>
                  </div>
                </Modal.Body>
              </>
          )}


            </Modal>

      </Container>

    </div >
  )
}

export default Dictamen