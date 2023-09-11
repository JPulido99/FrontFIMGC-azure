import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Tab, Tabs, Container, Form, FormCheck, ListGroup, InputGroup, Button, Row, Col, Table, Modal, Alert, OverlayTrigger, Tooltip, Spinner } from 'react-bootstrap';
import axios from 'axios';
import AuthContext from '../Context/AuthProvider';


const Expediente = () => {

    const { user } = useContext(AuthContext);

    //Para los tooltip
    const tooltipsMensajes = {
        concursoAdmision: "Ejemplo: 2017-II",
        resolucionIngreso: "Ejemplo: Resolución de Consejo Universitario Nº0215-2015-UNSCH-CU",
        expediente: "Ejemplo: 2312286.001",
        planEstudios: "Ejemplo: 2005-R",
        similitud: "Si su índice de similitud es 12%, coloque: 12",
    };

    const renderTooltip = (props, field) => (
        <Tooltip {...props}>{tooltipsMensajes[field]}</Tooltip>
    );


    //FUNCION VERIFICAR EXPEDIENTE
    const [nroDoc, setNroDoc] = useState('');
    const [interesadoEmail, setInteresadoEmail] = useState('');
    const [miembroId, setMiembroId] = useState('');
    const [presidenteId, setPresidenteId] = useState('');
    const [showAlertaExp, setShowAlertaExp] = useState(false);
    const [alertaExp, setAlertaExp] = useState({ message: "", type: "" });

    const mensajesAlert = {
        existe: "Expediente encontrado.",
        noExiste: "Expediente NO encontrado.",
    };

    const verificarExp = async () => {
        const inputNroDoc = document.getElementById('numeroExpBH2').value;
        setNroDoc(inputNroDoc);
        console.log(inputNroDoc);
        try {
            const veriResponse = await axios.get(`https://fimgc-back.rj.r.appspot.com/api/expediente/${inputNroDoc}`);
            console.log(veriResponse.data);

            setInteresadoEmail(user.username);
            if (veriResponse.data) {
                setAlertaExp({ message: mensajesAlert.existe, type: 'success' });
            } else {
                setAlertaExp({ message: mensajesAlert.noExiste, type: 'danger' });
            }
        } catch (error) {
            setAlertaExp({ message: 'Ocurrió un error al realizar la solicitud.', type: 'danger' });
        }
        setShowAlertaExp(true);
    };

    //Para el modal docentesMiembro
    const [modalDocentesMiembro, setModaldocentesMiembro] = useState(false);
    const handleHideMiembro = () => setModaldocentesMiembro(false);
    //Para el modal docentesPresidente
    const [modalDocentesPresidente, setModaldocentesPresidente] = useState(false);
    const handleHidePresidente = () => setModaldocentesPresidente(false);

    //Para buscar docentes
    const [nombre, setNombre] = useState('');
    const [docentes, setDocentes] = useState([]);
    const [nombreMiembro, setNombreMiembro] = useState('');
    const [nombrePresidente, setNombrePresidente] = useState('');

    const handleMiembroChange = (event) => {
        setNombreMiembro(event.target.value);
    };

    const handlePresidenteChange = (event) => {
        setNombrePresidente(event.target.value);
    };

    const handleBuscarMiembro = () => {
        axios
            .get(`https://fimgc-back.rj.r.appspot.com/users/buscarDocentes?firstName=${nombreMiembro}`)
            .then((response) => {
                if (response.data && response.data.length > 0) {
                    setDocentes(response.data);
                    setModaldocentesMiembro(true);
                } else {
                    console.log('La respuesta del servidor está vacía o incompleta.');
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const handleBuscarPresidente = () => {
        axios
            .get(`https://fimgc-back.rj.r.appspot.com/users/buscarDocentes?firstName=${nombrePresidente}`)
            .then((response) => {
                if (response.data && response.data.length > 0) {
                    setDocentes(response.data);
                    setModaldocentesPresidente(true);
                } else {
                    console.log('La respuesta del servidor está vacía o incompleta.');
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };


    const handleSeleccionarDocenteMiembro = (docente) => {
        setNombreMiembro(`${docente.firstName} ${docente.lastName}`);
        setMiembroId(docente.id);
        console.log("miembro escuela", docente.id);
        setModaldocentesMiembro(false);
    };

    const handleSeleccionarDocentePresidente = (docente) => {
        setNombrePresidente(`${docente.firstName} ${docente.lastName}`);
        setPresidenteId(docente.id);
        console.log("presidente escuela", docente.id);
        setModaldocentesPresidente(false);
    };




    //PARA EL GUARDADO DE DATOS, SUBIDA DE ARCHIVO Y ENVIO DE GMAIL
    const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);

    const handleArchivoChange = (event) => {
        const file = event.target.files[0];
        setArchivoSeleccionado(file);
    };


    //Para el modal en el que se ven los datos ingresados
    const [modalDatosBH2, setModalDatosBH2] = useState(false);
    const handleOcultarBH2 = () => setModalDatosBH2(false);


    //Para los datos a visualizarse en el modal
    const [prevExpediente, setPrevExpediente] = useState({});


    const [expediente, setExpediente] = useState({
        nroMemoEscuela: '',
        fechaMemoEscuela: '',
        nroDictEscuela: '',
        fechaDictEscuela: '',
    });


    //Función para limpiar luego de Tramitar
    const limpiarFormulario = () => {
        setExpediente({
            nroMemoEscuela: '',
            fechaMemoEscuela: '',
            nroDictEscuela: '',
            fechaDictEscuela: '',
        });
        setSelectedEscuelaId('');
        setNombreMiembro('');
        setNombrePresidente('');
        setTelefono('');
    };


    const handleInputChange2 = async (event) => {
        const { name, value } = event.target;

        if (name === 'escuela') {
            setSelectedEscuelaId(value);
        } else if (name === 'nroExpediente') {
            // Validar que solo se ingresen números
            const regex = /^[0-9.]+$/;
            if (value === '' || regex.test(value)) {
                setExpediente((prevExpediente) => ({
                    ...prevExpediente,
                    [name]: value,
                }));
            }
        } else {
            setExpediente((prevExpediente) => ({
                ...prevExpediente,
                [name]: value
            }));
        }
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
                "nroMemoEscuela": expediente.nroMemoEscuela,
                "fechaMemoEscuela": expediente.fechaMemoEscuela,
                "nroDictEscuela": expediente.nroDictEscuela,
                "fechaDictEscuela": expediente.fechaDictEscuela,
            };
            const documentoResponse = await axios.post(`https://fimgc-back.rj.r.appspot.com/api/expediente/${nroDoc}/actualizarExpedienteEscuela?miembroId=${miembroId}&presidenteId=${presidenteId}`, dataToSendDoc);
            //const rutaArchivo = uploadResponse.data;
            console.log(documentoResponse);

            if (documentoResponse.data) {
                const formData = new FormData();
                formData.append('file', archivoSeleccionado); // Añade el archivo seleccionado al FormData
                formData.append('nroExpediente', nroDoc);
                // Envía el archivo al backend para guardarlo
                const uploadResponse = await axios.post('https://fimgc-back.rj.r.appspot.com/api/expediente/upload', formData);
                const rutaArchivo = uploadResponse.data;

                if (uploadResponse.data) {
                    // Si la carga del archivo fue exitosa, continuamos con el envío del correo electrónico

                    /*const recipientEmail = documentoDictamen.resultado === "Apto"
                        ? "junior.pulido.27@unsch.edu.pe" // Replace this with the appropriate email address for Apto resultado
                        : interesadoEmail; // Replace this with the appropriate email address for No Apto resultado*/

                    // Creamos el objeto con los datos para el correo electrónico
                    const dataToSendEmail = {
                        "to": ["junior.pulido.27@unsch.edu.pe"],
                        "subject": "Veredicto de la Revision de Escuela (Exp)",
                        "body": "Holiwi :3",
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
                console.log('Error al actualiar los campos de documento.');
        } catch (error) {
            console.error('Error al realizar la carga del archivo o enviar el correo electrónico:', error);
        } finally {
            setEnviandoCorreo(false);
        }
    };

    //ACCION DE CLICK EN BOTON
    const VerificarGuardarEnviar = () => {
        setPrevExpediente({
            nroMemoEsc: expediente.nroMemoEscuela,
            fechaMemoEsc: expediente.fechaMemoEscuela,
            nroDictEsc: expediente.nroDictEscuela,
            fechaDictEsc: expediente.fechaDictEscuela,

        });
        setModalDatosBH2(true);
    }



    return (
        <div>
            <Container>
                <Form>
                    <fieldset className='customize-fielset'>
                        <legend className='customize-legend text-uppercase'>Enviar expediente</legend>

                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="2" className="fw-bold customize-label">Nº de expediente</Form.Label>
                            <Col sm="10">
                                <InputGroup>
                                    <Form.Control type="text" placeholder="Ingrese el número de expediente."
                                        aria-label="Ingrese el número de expediente."
                                        id="numeroExpBH2"
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
                            <Form.Label column sm="4" className="fw-bold customize-label">Nº de Memorando de Escuela</Form.Label>
                            <Col sm="3">
                                <Form.Control type="text" name="nroMemoEscuela" placeholder="" value={expediente.nroMemoEscuela} onChange={handleInputChange2} />
                            </Col>

                            <Form.Label column sm="3" className="fw-bold customize-label">Fecha de memorando</Form.Label>
                            <Col sm="2">
                                <Form.Control type="date" name="fechaMemoEscuela" value={expediente.fechaMemoEscuela} onChange={handleInputChange2} />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="4" className="fw-bold customize-label">Nº de Dictamen de Escuela</Form.Label>
                            <Col sm="3">
                                <Form.Control type="text" name="nroDictEscuela" placeholder="" value={expediente.nroDictEscuela} onChange={handleInputChange2} />
                            </Col>

                            <Form.Label column sm="3" className="fw-bold customize-label">Fecha de dictamen</Form.Label>
                            <Col sm="2">
                                <Form.Control type="date" name="fechaDictEscuela" value={expediente.fechaDictEscuela} onChange={handleInputChange2} />
                            </Col>
                        </Form.Group>


                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="4" className="fw-bold customize-label">Presidente - Comision de escuela</Form.Label>
                            <Col sm="8">
                                <InputGroup>
                                    <Form.Control type="text" id="nombrePresidente" name="nombrePresidente" placeholder="Ingrese el nombre de su presidente." value={nombrePresidente} onChange={handlePresidenteChange} />
                                    <Button variant="outline-dark" id="button-addon2" onClick={handleBuscarPresidente}><i className="fi fi-bs-search"></i> Buscar</Button>
                                </InputGroup>
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="4" className="fw-bold customize-label">Miembro - Comision de escuela</Form.Label>
                            <Col sm="8">
                                <InputGroup>
                                    <Form.Control type="text" id="nombreMiembro" name="nombreMiembro" placeholder="Ingrese el nombre de su miembro." value={nombreMiembro} onChange={handleMiembroChange} />
                                    <Button variant="outline-dark" id="button-addon2" onClick={handleBuscarMiembro}><i className="fi fi-bs-search"></i> Buscar</Button>
                                </InputGroup>
                            </Col>
                        </Form.Group>


                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="2" className="fw-bold customize-label"><i className="fi fi-bs-file-upload"></i> Subir expediente</Form.Label>
                            <Col sm="10">
                                <InputGroup>
                                    <Form.Control name="pdf" type="file" onChange={handleArchivoChange} />
                                    <Button variant="outline-dark" onClick={VerificarGuardarEnviar} >Enviar  <i className="fi fi-bs-paper-plane"></i></Button>
                                </InputGroup>
                            </Col>
                        </Form.Group>

                    </fieldset>
                </Form>

                <Modal aria-labelledby="modal-de-docentes" size="lg" show={modalDocentesMiembro}>
                    <Modal.Header closeButton onHide={handleHideMiembro}>
                        <Modal.Title className='title-modal1'>Seleccionar Miembro</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Container className='table-container'>
                            <Table responsive="sm">
                                <thead className='thead-text-customize'>
                                    <tr>
                                        <th>Nombre completo</th>
                                        <th>Escuela profesional</th>
                                        <th>Correo electrónico</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {docentes.map((docente) => (
                                        <tr key={docente.id} >
                                            <td>{`${docente.firstName} ${docente.lastName}`}</td>
                                            <td>{docente.escuela.nombre}</td>
                                            <td>{docente.email}</td>
                                            <td><Button size='sm' variant="outline-success btn-into-table" onClick={() => handleSeleccionarDocenteMiembro(docente)}>Seleccionar <i className="fi fi-br-check"></i></Button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Container>
                    </Modal.Body>
                </Modal>

                <Modal aria-labelledby="modal-de-docentes" size="lg" show={modalDocentesPresidente}>
                    <Modal.Header closeButton onHide={handleHidePresidente}>
                        <Modal.Title className='title-modal1'>Seleccionar Presidente</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Container className='table-container'>
                            <Table responsive="sm">
                                <thead className='thead-text-customize'>
                                    <tr>
                                        <th>Nombre completo</th>
                                        <th>Escuela profesional</th>
                                        <th>Correo electrónico</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {docentes.map((docente) => (
                                        <tr key={docente.id} >
                                            <td>{`${docente.firstName} ${docente.lastName}`}</td>
                                            <td>{docente.escuela.nombre}</td>
                                            <td>{docente.email}</td>
                                            <td><Button size='sm' variant="outline-success btn-into-table" onClick={() => handleSeleccionarDocentePresidente(docente)}>Seleccionar <i className="fi fi-br-check"></i></Button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Container>
                    </Modal.Body>
                </Modal>

                <Modal aria-labelledby="modal-previsulizacion" size="lg" show={modalDatosBH2}>
                    {envioExitoso ? (
                        <>
                            <Modal.Header closeButton onHide={() => {
                                handleOcultarBH2();
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



                            <Modal.Header closeButton onHide={handleOcultarBH2}>
                                <Modal.Title className='title-modal1'>Verificar datos</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <p className='p-modal-bold'>¿Los datos que se muestran a continuación son correctos?</p>
                                <Form>
                                    <Form.Group as={Row} className="mb-3">
                                        <Form.Label column sm="4" className="fw-bold customize-label">Nº de Memorando</Form.Label>
                                        <Col sm="2">
                                            <Form.Control plaintext readOnly value={prevExpediente.nroMemoEsc} />
                                        </Col>
                                        <Form.Label column sm="4" className="fw-bold customize-label">Fecha de Memorando</Form.Label>
                                        <Col sm="2">
                                            <Form.Control plaintext readOnly value={prevExpediente.fechaMemoEsc} />
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} className="mb-3">
                                        <Form.Label column sm="4" className="fw-bold customize-label">Número de Dictamen</Form.Label>
                                        <Col sm="2">
                                            <Form.Control plaintext readOnly value={prevExpediente.nroDictEsc} />
                                        </Col>
                                        <Form.Label column sm="4" className="fw-bold customize-label">Fecha de Dictamen</Form.Label>
                                        <Col sm="2">
                                            <Form.Control plaintext readOnly value={prevExpediente.fechaDictEsc} />
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} className="mb-3">
                                        <Form.Label column sm="5" className="fw-bold customize-label">Presidente - Comision de escuela</Form.Label>
                                        <Col sm="7">
                                            <Form.Control plaintext readOnly value={nombrePresidente} />
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} className="mb-3">
                                        <Form.Label column sm="5" className="fw-bold customize-label">Miembro - Comision de escuela</Form.Label>
                                        <Col sm="7">
                                            <Form.Control plaintext readOnly value={nombreMiembro} />
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
        </div>
    )
}

export default Expediente
