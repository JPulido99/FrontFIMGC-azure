import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Tab, Tabs, Container, Form, ListGroup, InputGroup, Button, Row, Col, Table, Modal, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import AuthContext from '../../Context/AuthProvider';



const GenerarMemorandum = () => {
    const { user } = useContext(AuthContext);

    //otras cositas
    const [nroDoc, setNroDoc] = useState('');
    const [asesor, setAsesor] = useState('');
    const [objAsesor, setObjAsesor] = useState('');

    const [tramiteExpediente, setTramiteExpediente] = useState('');

    const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);

    const handleArchivoChange = (event) => {
        const file = event.target.files[0];
        setArchivoSeleccionado(file);
    };

    //Para el modal
    const [modalDocentes, setModaldocentes] = useState(false);
    const handleHide = () => setModaldocentes(false);

    const [modalDestinatarios, setModalDestinatarios] = useState(false);
    const handleHideDestinatarios = () => setModalDestinatarios(false);
    const handleShowDestinatarios = () => setModalDestinatarios(true);

    //Para el alert de verificaciòn de expediente
    const [showAlertaExp, setShowAlertaExp] = useState(false);
    const [alertaExp, setAlertaExp] = useState({ message: "", type: "" });

    const mensajesAlert = {
        existe: "Expediente encontrado.",
        noExiste: "Expediente NO encontrado.",
    };

    const verificarExp = async () => {
        const inputNroDoc = document.getElementById('numeroExp').value;
        setNroDoc(inputNroDoc);

        try {
            const response = await axios.get(`https://backfimgc.azurewebsites.net/api/expediente/${inputNroDoc}`);
            console.log(response.data)
            setTramiteExpediente(response.data.tramite.nombre)
            console.log(response.data.tramite.nombre)

            if (response.data.tramite.nombre === 'Obtención de Bachiller') {
                setAlertaExp({ message: mensajesAlert.existe, type: 'success' });
                console.log("Este es un bachiller")


            } else if (response.data.tramite.nombre === 'Plan de Tesis') {
                setAlertaExp({ message: mensajesAlert.existe, type: 'success' });
                console.log("Este es un plan")

                // Obtener el ID del asesor desde la respuesta del backend
                const asesorId = response.data.asesor.id;

                // Hacer una nueva consulta para obtener los datos del asesor por su ID
                const asesorResponse = await axios.get(`https://backfimgc.azurewebsites.net/users/findUsuarioById/${asesorId}`);
                if (asesorResponse.data) {
                    const nombreAsesor = `${asesorResponse.data.firstName} ${asesorResponse.data.lastName}`;
                    setAsesor(nombreAsesor);
                    setObjAsesor(asesorResponse.data);
                } else {
                    console.log('El asesor no se encontró en la base de datos.');
                }
            } else if (response.data.tramite.nombre === 'Borrador de Tesis') {
                setAlertaExp({ message: mensajesAlert.existe, type: 'success' });
                console.log("Este es un borrador")

                docentesSeleccionados.push(response.data.miembro)
                docentesSeleccionados.push(response.data.presidente)

                setObjAsesor(response.data.asesor);

            } else if (response.data.tramite.nombre === 'Obtención de Título Profesional') {
                setAlertaExp({ message: mensajesAlert.existe, type: 'success' });
                console.log("Este es un titulo")


            } else {
                setAlertaExp({ message: mensajesAlert.noExiste, type: 'danger' });
            }
        } catch (error) {
            setAlertaExp({ message: 'Ocurrió un error al realizar la solicitud.', type: 'danger' });
        }
        setShowAlertaExp(true);
    };


    //Para buscar docentes
    const [nombre, setNombre] = useState('');
    const [docentes, setDocentes] = useState([]);

    //Desde aqui es prueba

    const [rolesSeleccionados, setRolesSeleccionados] = useState([]);

    const handleRoleChange = (index, newRole) => {
        const updatedRoles = [...rolesSeleccionados];
        updatedRoles[index] = newRole;
        setRolesSeleccionados(updatedRoles);
    };

    useEffect(() => {
        console.log(rolesSeleccionados);
    }, [rolesSeleccionados]);
    //Hasta aquí es prueba


    //Para los docentes seleccionados
    const [docentesSeleccionados, setDocentesSeleccionados] = useState([]);

    const handleNombreChange = (event) => {
        setNombre(event.target.value);
    };

    const handleBuscarClick = () => {
        // Solo permitir búsqueda si no se han realizado 2 búsquedas aún
        //if (busquedasRealizadas < 2) {
        axios
            .get(`https://backfimgc.azurewebsites.net/users/buscarDocentes?firstName=${nombre}`)
            .then((response) => {
                if (response.data && response.data.length > 0) {
                    setDocentes(response.data);
                    setModaldocentes(true);
                } else {
                    console.log('La respuesta del servidor está vacía o incompleta.');
                }
            })
            .catch((error) => {
                console.error(error);
            });
        // Incrementar el contador de búsquedas realizadas
        //setBusquedasRealizadas((prevBusquedas) => prevBusquedas + 1);
        //}
    };

    const handleSeleccionarDocente = (docente) => {
        const isAlreadySelected = docentesSeleccionados.some(
            (selectedDocente) => selectedDocente.id === docente.id
        );

        if (!isAlreadySelected && docentesSeleccionados.length < 2) {
            setDocentesSeleccionados([...docentesSeleccionados, docente]);
            setModaldocentes(false);
            // Actualizar el número de docentes restantes
            //setDocentesRestantes((prevRestantes) => prevRestantes - 1);
        }
    };

    const handleQuitarDocente = (index) => {
        const nuevosDocentesSeleccionados = [...docentesSeleccionados];
        nuevosDocentesSeleccionados.splice(index, 1);
        setDocentesSeleccionados(nuevosDocentesSeleccionados);

    };


    //Para mandar el form a la base de datos
    const handleGenerar = () => {
        // Verificar que los roles de presidente y miembro hayan sido seleccionados
        if (rolesSeleccionados.includes("Presidente") && rolesSeleccionados.includes("Miembro")) {
            // Obtener los IDs de los docentes asignados como presidente y miembro
            const presidenteIndex = rolesSeleccionados.indexOf("Presidente");
            const miembroIndex = rolesSeleccionados.indexOf("Miembro");

            const presidenteId = docentesSeleccionados[presidenteIndex].id;
            const miembroId = docentesSeleccionados[miembroIndex].id;

            if (tramiteExpediente === 'Plan de Tesis' || tramiteExpediente === 'Obtención de Título Profesional' || tramiteExpediente == "Obtención de Bachiller") {
                console.log(docentesSeleccionados);
                // Enviar la información al backend
                axios
                    .post(`https://backfimgc.azurewebsites.net/api/expediente/${nroDoc}/actualizarMiembros?miembroId=${miembroId}&presidenteId=${presidenteId}`)
                    .then((response) => {
                        // Procesar la respuesta del backend si es necesario
                        console.log('Expediente creado exitosamente:', response.data);

                        if (tramiteExpediente === 'Obtención de Bachiller') {
                            //Endpoint de generacion para MM de bachiller
                            const url = `https://backfimgc.azurewebsites.net/reporte/MMBachiller/download?NroExp=${nroDoc}&tipo=PDF`;
                            window.open(url, '_blank');
                        } else if (tramiteExpediente === 'Obtención de Título Profesional') {
                            //Endpoint de generacion para MM de titulo
                            const url = `https://backfimgc.azurewebsites.net/reporte/MMTitulo/download?NroExp=${nroDoc}&tipo=PDF`;
                            window.open(url, '_blank');
                        } else {
                            //Endpoint de generacion para MM de Plan y Borradora
                            const url = `https://backfimgc.azurewebsites.net/reporte/MM/download?NroExp=${nroDoc}&tipo=PDF`;
                            window.open(url, '_blank');
                        }
                    })
                    .catch((error) => {
                        // Manejar errores si los hay
                        console.error('Error al crear el expediente:', error);
                    });
            }
        } else if (tramiteExpediente === 'Borrador de Tesis') {
            //Endpoint de generacion para MM de Plan y Borradora
            const url = `https://backfimgc.azurewebsites.net/reporte/MM/download?NroExp=${nroDoc}&tipo=PDF`;
            window.open(url, '_blank');

        } else {
            console.log("Por favor, seleccione roles para presidente y miembro.");
        }

    };

    const [enviandoCorreo, setEnviandoCorreo] = useState(false);
    const [envioExitoso, setEnvioExitoso] = useState(false);

    const [shouldReload, setShouldReload] = useState(false);

    const enviarCorreo = async () => {
        setEnviandoCorreo(true);
        // Primero, realizamos la carga del archivo al backend
        try {
            const formData = new FormData();
            formData.append('file', archivoSeleccionado); // Añade el archivo seleccionado al FormData
            formData.append('nroExpediente', nroDoc);

            // Envía el archivo al backend para guardarlo
            const uploadResponse = await axios.post('https://backfimgc.azurewebsites.net/api/expediente/upload', formData);
            const rutaArchivo = uploadResponse.data;
            if (uploadResponse.data && tramiteExpediente === 'Obtención de Bachiller') {
                // Si la carga del archivo fue exitosa, continuamos con el envío del correo electrónico
                //docentesSeleccionados.push(objAsesor);
                const destinatarios = docentesSeleccionados.map((docente) => docente.username);

                // Creamos el objeto con los datos para el correo electrónico
                const dataToSend = {
                    "to": destinatarios,
                    "subject": "Revisión de Expediente de Obtención de Grado de Bachiller (MM+Exp)",
                    "body": "Estimados docentes, se remite el Memorando Múltiple para la revisión del Expediente del Sr.",
                    "pdfFilePath": rutaArchivo
                };
                const sendResponse = await axios.post('https://backfimgc.azurewebsites.net/sendEmail', dataToSend);
                console.log('Correo enviado:', sendResponse.data);
                setEnvioExitoso(true);
                setShouldReload(true);

            } else if (uploadResponse.data && tramiteExpediente === 'Plan de Tesis') {
                // Si la carga del archivo fue exitosa, continuamos con el envío del correo electrónico
                docentesSeleccionados.push(objAsesor);
                const destinatarios = docentesSeleccionados.map((docente) => docente.username);

                // Creamos el objeto con los datos para el correo electrónico
                const dataToSend = {
                    "to": destinatarios,
                    "subject": "Revisión de Plan de Tesis (MM+Exp)",
                    "body": "Estimados docentes, se remite el Memorando Múltiple para la revisión del Plan de Tesis del Bach.",
                    "pdfFilePath": rutaArchivo
                };
                const sendResponse = await axios.post('https://backfimgc.azurewebsites.net/sendEmail', dataToSend);
                console.log('Correo enviado:', sendResponse.data);
                setEnvioExitoso(true);
                setShouldReload(true);

            } else if (uploadResponse.data && tramiteExpediente === 'Borrador de Tesis') {
                // Si la carga del archivo fue exitosa, continuamos con el envío del correo electrónico
                docentesSeleccionados.push(objAsesor);
                const destinatarios = docentesSeleccionados.map((docente) => docente.username);

                // Creamos el objeto con los datos para el correo electrónico
                const dataToSend = {
                    "to": destinatarios,
                    "subject": "Revisión de Borrador de Tesis (MM+Exp)",
                    "body": "Estimados docentes, se remite el Memorando Múltiple para la revisión del Borrador de Tesis del Bach.",
                    "pdfFilePath": rutaArchivo
                };
                const sendResponse = await axios.post('https://backfimgc.azurewebsites.net/sendEmail', dataToSend);
                console.log('Correo enviado:', sendResponse.data);
                setEnvioExitoso(true);
                setShouldReload(true);

            } else if (uploadResponse.data && tramiteExpediente === 'Obtención de Título Profesional') {
                // Si la carga del archivo fue exitosa, continuamos con el envío del correo electrónico
                //docentesSeleccionados.push(objAsesor);
                const destinatarios = docentesSeleccionados.map((docente) => docente.username);

                // Creamos el objeto con los datos para el correo electrónico
                const dataToSend = {
                    "to": destinatarios,
                    "subject": "Revisión de Expediente de Obtención de Título Profesional (MM+Exp)",
                    "body": "Estimados docentes, se remite el Memorando Múltiple para la revisión del Expediente del Bach.",
                    "pdfFilePath": rutaArchivo
                };
                const sendResponse = await axios.post('https://backfimgc.azurewebsites.net/sendEmail', dataToSend);
                console.log('Correo enviado:', sendResponse.data);
                setEnvioExitoso(true);
                setShouldReload(true);

            } else {
                console.log('Error al cargar el archivo PDF.');
            }
        } catch (error) {
            console.error('Error al realizar la carga del archivo o enviar el correo electrónico:', error);
        } finally {
            setEnviandoCorreo(false);
        }
    };

    return (

        <div>
            <Tabs defaultActiveKey="memo_multiple" className="mb-3">
                <Tab tabClassName='horizontal-nav-link' eventKey="memo_simple" title="Memorando simple">
                    <p>Form para MS</p>
                </Tab>
                <Tab tabClassName='horizontal-nav-link' eventKey="memo_multiple" title="Memorando múltiple">
                    <Container>
                        <Form>
                            <fieldset className='customize-fielset'>
                                <legend className='customize-legend-2 text-uppercase'> Generar Memorando múltiple</legend>

                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="3" className="fw-bold customize-label">Nº de expediente</Form.Label>
                                    <Col sm="9">
                                        <InputGroup>
                                            <Form.Control type="text" placeholder="Ingrese el número de expediente."
                                                aria-label="Ingrese el número de expediente."
                                                id="numeroExp"
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


                                {tramiteExpediente == "Plan de Tesis" && (
                                    <>
                                        {
                                            <Form.Group as={Row} className="mb-3">
                                                <Form.Label column sm="3" className="fw-bold customize-label">Miembros</Form.Label>
                                                <Col sm="9">
                                                    <InputGroup>
                                                        <Form.Control type="text" placeholder="Ingrese el nombre del docente."
                                                            aria-label="Ingrese el nombre del docente."
                                                            aria-describedby="basic-addon2"
                                                            value={nombre} onChange={handleNombreChange} disabled={!showAlertaExp || alertaExp.type !== 'success'/*|| docentesRestantes === 0*/} // Deshabilitar el botón "Buscar" cuando no hay más docentes disponibles
                                                        />
                                                        <Button variant="outline-dark" id="button-addon2" onClick={handleBuscarClick}><i className="fi fi-bs-search"></i> Buscar</Button>
                                                    </InputGroup>

                                                    <legend className='customize-table-legend'>Jurado</legend>
                                                    <Table responsive="sm" className='table-container'>
                                                        <thead className='thead-text-customize'>
                                                            <tr>
                                                                <th>Nombre completo</th>
                                                                <th>Cargo</th>
                                                                <th></th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {showAlertaExp && alertaExp.type === 'success' && (
                                                                <tr>
                                                                    <td>{asesor}</td>
                                                                    <td>
                                                                        <Form.Select size='sm' aria-label="Seleccione rol" defaultValue="Miembro" disabled>
                                                                            <option value="Presidente">Presidente</option>
                                                                            <option value="Miembro">Miembro</option>
                                                                        </Form.Select>
                                                                    </td>
                                                                    <td></td>
                                                                </tr>
                                                            )}

                                                            {docentesSeleccionados.map((docente, index) => (
                                                                <tr key={index}>
                                                                    <td>{`${docente.firstName} ${docente.lastName}`}</td>
                                                                    <td>
                                                                        <Form.Select size='sm' aria-label="Seleccione rol" value={rolesSeleccionados[index] || ""}
                                                                            onChange={(e) => handleRoleChange(index, e.target.value)}
                                                                        >
                                                                            <option>Seleccione un cargo</option>
                                                                            <option value="Presidente">Presidente</option>
                                                                            <option value="Miembro">Miembro</option>
                                                                        </Form.Select>
                                                                    </td>
                                                                    <td>
                                                                        <Button size='sm' variant="outline-danger btn-into-table" onClick={() => handleQuitarDocente(index)}>
                                                                            Quitar <i className="fi fi-bs-trash"></i>
                                                                        </Button>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </Table>
                                                </Col>
                                            </Form.Group>
                                        }
                                    </>
                                )}

                                {(tramiteExpediente === 'Obtención de Título Profesional' || tramiteExpediente === 'Obtención de Bachiller') && (
                                    <>
                                        {
                                            <Form.Group as={Row} className="mb-3">
                                                <Form.Label column sm="3" className="fw-bold customize-label">Miembros</Form.Label>
                                                <Col sm="9">
                                                    <InputGroup>
                                                        <Form.Control type="text" placeholder="Ingrese el nombre del docente."
                                                            aria-label="Ingrese el nombre del docente."
                                                            aria-describedby="basic-addon2"
                                                            value={nombre} onChange={handleNombreChange} disabled={!showAlertaExp || alertaExp.type !== 'success'/*|| docentesRestantes === 0*/} // Deshabilitar el botón "Buscar" cuando no hay más docentes disponibles
                                                        />
                                                        <Button variant="outline-dark" id="button-addon2" onClick={handleBuscarClick}><i className="fi fi-bs-search"></i> Buscar</Button>
                                                    </InputGroup>

                                                    <legend className='customize-table-legend'>Jurado</legend>
                                                    <Table responsive="sm" className='table-container'>
                                                        <thead className='thead-text-customize'>
                                                            <tr>
                                                                <th>Nombre completo</th>
                                                                <th>Cargo</th>
                                                                <th></th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {docentesSeleccionados.map((docente, index) => (
                                                                <tr key={index}>
                                                                    <td>{`${docente.firstName} ${docente.lastName}`}</td>
                                                                    <td>
                                                                        <Form.Select size='sm' aria-label="Seleccione rol" value={rolesSeleccionados[index] || ""}
                                                                            onChange={(e) => handleRoleChange(index, e.target.value)}
                                                                        >
                                                                            <option>Seleccione un cargo</option>
                                                                            <option value="Presidente">Presidente</option>
                                                                            <option value="Miembro">Miembro</option>
                                                                        </Form.Select>
                                                                    </td>
                                                                    <td>
                                                                        <Button size='sm' variant="outline-danger btn-into-table" onClick={() => handleQuitarDocente(index)}>
                                                                            Quitar <i className="fi fi-bs-trash"></i>
                                                                        </Button>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </Table>
                                                </Col>
                                            </Form.Group>
                                        }
                                    </>
                                )}

                                <div className="col-md-2 mx-auto">
                                    <Button variant="success btn-into-row" onClick={handleGenerar}>Generar <i className="fi fi-bs-document"></i></Button>
                                </div>


                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="3" className="fw-bold customize-label"><i className="fi fi-bs-file-upload"></i> Subir nuevo expediente</Form.Label>
                                    <Col sm="9">
                                        <InputGroup>
                                            <Form.Control name="pdf" type="file" onChange={handleArchivoChange} />
                                            <Button variant="outline-dark" onClick={handleShowDestinatarios}>Enviar  <i className="fi fi-bs-paper-plane"></i></Button>
                                        </InputGroup>
                                    </Col>
                                </Form.Group>

                            </fieldset>
                        </Form>
                    </Container>
                </Tab>
            </Tabs>

            <Modal aria-labelledby="modal-de-docentes" size="lg" show={modalDocentes}>
                <Modal.Header closeButton onHide={handleHide}>
                    <Modal.Title className='title-modal1'>Seleccionar docente</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container className='table-container'>
                        <Table responsive="sm">
                            <thead className='thead-text-customize'>
                                <tr>
                                    <th>Nombre completo</th>
                                    <th>Escuela profesional</th>
                                    <th>Correo electrónico</th>
                                    <th>Teléfono</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {docentes.map((docente) => (
                                    <tr key={docente.id} >
                                        <td>{`${docente.firstName} ${docente.lastName}`}</td>
                                        <td>{docente.escuela.nombre}</td>
                                        <td>{docente.username}</td>
                                        <td>{docente.telefono}</td>
                                        <td><Button size='sm' variant="outline-success btn-into-table" onClick={() => handleSeleccionarDocente(docente)}>Seleccionar <i className="fi fi-br-check"></i></Button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Container>
                </Modal.Body>
            </Modal>

            <Modal aria-labelledby="modal-de-destinatarios" size="lg" centered show={modalDestinatarios}>
                {envioExitoso ? (
                    <>
                        <Modal.Header closeButton onHide={() => {
                            handleHideDestinatarios();
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
                        <Modal.Header closeButton onHide={handleHideDestinatarios}>
                            <Modal.Title className='title-modal1'>Destinatarios</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Container className='table-container'>
                                <Table responsive="sm">
                                    <thead className='thead-text-customize'>
                                        <tr>
                                            <th>Nombre completo</th>
                                            <th>Correo electrónico</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {docentesSeleccionados.map((docente) => (
                                            <tr key={docente.id}>
                                                <td>{`${docente.firstName} ${docente.lastName}`}</td>
                                                <td>{docente.username}</td>
                                            </tr>
                                        ))}

                                        {(tramiteExpediente == "Plan de Tesis" ||tramiteExpediente == "Borrador de Tesis" ) && (
                                            <>
                                                <tr key={objAsesor.id}>
                                                    <td>{`${objAsesor.firstName} ${objAsesor.lastName}`}</td>
                                                    <td>{objAsesor.username}</td>
                                                </tr>
                                            </>
                                        )}

                                    </tbody>
                                </Table>
                            </Container>

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
        </div>
    )
}

export default GenerarMemorandum