import React, { useState, useEffect } from "react";
import axios from "axios";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Alert from "react-bootstrap/Alert";

const TipoDocumento = () => {
  //Para el modal agregar
  const [nombre, setNombre] = useState("");
  const [sigla, setSigla] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [modalAgregarTD, setModalAgregarTD] = useState(false);
  const handleOcultarModalAgregarTD = () => {
    setModalAgregarTD(false);
    setNombre("");
    setSigla("");
    setDescripcion("");
  };
  const handleMostrarModalAgregarTD = () => setModalAgregarTD(true);

  // Para el modal modificar
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [tiposDocumentos, setTiposDocumentos] = useState([]);
  const [modalModificarTD, setModalModificarTD] = useState(false);
  const handleOcultarModalModificarTD = () => setModalModificarTD(false);

  const [showModificarModal, setShowModificarModal] = useState(false);
  const handleMostrarModificarModal = () => setShowModificarModal(true);
  const handleOcultarModificarModal = () => setShowModificarModal(false);
  //Para el modal eliminar
  const [modalEliminarTD, setModalEliminarTD] = useState(false);
  const handleOcultarModalEliminarTD = () => setModalEliminarTD(false);
  const handleMostrarModalEliminarTD = () => setModalEliminarTD(true);
  //Con esto captamos el valor del id del elemento que deseamos eliminar
  const [tipoDocumentoSeleccionadoId, setTipoDocumentoSeleccionadoId] =
    useState(null);
  const [tipoDocumentoSeleccionado, setTipoDocumentoSeleccionado] = useState(
    {}
  );
  //Funcion para eliminar tipoDocumento
  function eliminarTipoDocumento(id) {
    axios
      .delete(`https://backfimgc.azurewebsites.net/api/tipoDocumento/${id}`)
      .then((response) => {
        setTiposDocumentos(
          tiposDocumentos.filter((tipoDocumento) => tipoDocumento.id !== id)
        );
      })
      .catch((error) => {
        console.error(error);
      });
  }
  //Para poder observar la lista de elementos en la tabla
  function cargarElementos() {
    axios
      .get("https://backfimgc.azurewebsites.net/api/tipoDocumento")
      .then((response) => {
        setTiposDocumentos(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }
  useEffect(() => {
    cargarElementos();
  }, []);
  //HACIENDO COSITAS PARA MODIFICAR
  const handleGuardarModificacion = () => {
    if (nombre === "" || sigla === "" || descripcion === "") {
      setShowAlert(true);
    } else {
      setShowAlert(false);
      handleOcultarModalModificarTD();

      //aquí va lo del axios para actualizar los datos
      axios
        .put(
          `https://backfimgc.azurewebsites.net/api/tipoDocumento/${tipoDocumentoSeleccionadoId}`,
          {
            nombre: nombre,
            sigla: sigla,
            descripcion: descripcion,
          }
        )
        .then((response) => {
          // Actualizar los datos modificados en el estado
          const index = tiposDocumentos.findIndex(
            (tipoDocumento) => tipoDocumento.id === tipoDocumentoSeleccionadoId
          );
          const updatedTiposDocumentos = [...tiposDocumentos];
          updatedTiposDocumentos[index] = response.data;
          setTiposDocumentos(updatedTiposDocumentos);

          // Reiniciar los valores de los inputs
          setNombre("");
          setSigla("");
          setDescripcion("");
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  // ...

  const handleMostrarModalModificarTD = (tipoDocumento) => {
    setTipoDocumentoSeleccionadoId(tipoDocumento.id);
    setNombre(tipoDocumento.nombre);
    setSigla(tipoDocumento.sigla);
    setDescripcion(tipoDocumento.descripcion);
    setModalModificarTD(true);
  };

  const agregarTipoDocumento = () => {
    if (nombre === "" || descripcion === "" || sigla === "") {
      setShowAlert(true);
    } else {
      setShowAlert(false);
      handleOcultarModalAgregarTD();
      axios
        .post("https://backfimgc.azurewebsites.net/api/tipoDocumento", {
          nombre: nombre,
          sigla: sigla,
          descripcion: descripcion,
        })
        .then((response) => {
          setTiposDocumentos([...tiposDocumentos, response.data]);
          handleOcultarModalAgregarTD();
        })

        .catch((error) => {
          console.error(error);
        });
    }
  };

  // ALERT PARA VALIDAR ESPACIOS
  const [showAlert, setShowAlert] = useState(false);
  const handleInputChange = (e) => {
    //Controlador de eventos o cambios de los inputs
    const { name, value } = e.target;

    // Actualiza el estado del campo modificado
    if (name === "nombre") {
      setNombre(value);
    } else if (name === "descripcion") {
      setDescripcion(value);
    } else if (name === "sigla") {
      setSigla(value);
    }
    // Oculta el Alert si se comienza a escribir en un campo vacío
    if (showAlert && value !== "") {
      setShowAlert(false);
    }
  };

  return (
    <div>
      <Container>
        <legend className="customize-legend text-uppercase">
          Tipos de documentos
        </legend>
        <Button variant="outline-success" onClick={handleMostrarModalAgregarTD}>
          Agregar <i className="fi fi-bs-add-document"></i>
        </Button>
      </Container>
      <Container className="table-container">
        <Table responsive="sm">
          <thead className="thead-text-customize">
            <tr>
              <th></th>
              <th>Nombre</th>
              <th>Sigla</th>
              <th>Descripción</th>
            </tr>
          </thead>
          <tbody>
            {tiposDocumentos.map((dato) => (
              <tr key={dato.id}>
                <td>{dato.id}</td>
                <td>{dato.nombre}</td>
                <td>{dato.sigla}</td>
                <td>{dato.descripcion}</td>
                <td>
                  <Button
                    size="sm"
                    variant="outline-secondary btn-into-table"
                    onClick={() => handleMostrarModalModificarTD(dato)}
                  >
                    Modificar <i className="fi fi-bs-file-edit"></i>
                  </Button>

                  <Button
                    size="sm"
                    variant="outline-danger btn-into-table"
                    onClick={() => {
                      setTipoDocumentoSeleccionadoId(dato.id);
                      handleMostrarModalEliminarTD();
                    }}
                  >
                    Eliminar <i className="fi fi-bs-trash"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>

      <Modal aria-labelledby="modal-AgregarTD" centered show={modalAgregarTD}>
        <Modal.Header closeButton onHide={handleOcultarModalAgregarTD}>
          <Modal.Title>Agregar tipo de documento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {showAlert && (
            <Alert key="danger" variant="danger">
              <i className="fi fi-br-exclamation"></i> Debe rellenar todos los
              campos.
            </Alert>
          )}
          <Form>
            <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
              <Form.Label column sm="3" className="fw-bold customize-flabel">
                Nombre</Form.Label>
              <Col sm="9">
                <Form.Control
                  type="text"
                  name="nombre"
                  autoFocus
                  value={nombre}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
              <Form.Label column sm="3" className="fw-bold customize-flabel">
                Sigla</Form.Label>
              <Col sm="9">
                <Form.Control
                  type="text"
                  name="sigla"
                  autoFocus
                  value={sigla}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
              <Form.Label column sm="3" className="fw-bold customize-flabel">
                Descripción</Form.Label>
              <Col sm="9">
                <Form.Control
                  as="textarea"
                  name="descripcion"
                  autoFocus
                  value={descripcion}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="customize-btn-1"
            type="submit"
            onClick={agregarTipoDocumento}
          >
            Guardar <i className="fi fi-bs-disk"></i>
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        aria-labelledby="modal-modificarTD"
        centered
        show={modalModificarTD}
      >
        <Modal.Header closeButton onHide={handleOcultarModalModificarTD}>
          <Modal.Title>Modificar datos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {showAlert && (
            <Alert key="danger" variant="danger">
              <i className="fi fi-br-exclamation"></i> Debe rellenar todos los
              campos.
            </Alert>
          )}
          <Form>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="3" className="fw-bold customize-flabel">
                Nombre</Form.Label>
              <Col sm="9">
                <Form.Control
                  type="text"
                  name="nombre"
                  value={nombre}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="3" className="fw-bold customize-flabel">
                Sigla</Form.Label>
              <Col sm="9">
                <Form.Control
                  type="text"
                  name="sigla"
                  value={sigla}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="3" className="fw-bold customize-flabel">
                Descripción</Form.Label>
              <Col sm="9">
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="descripcion"
                  value={descripcion}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="customize-btn-1"
            type="submit"
            onClick={handleGuardarModificacion}
          >
            Guardar <i className="fi fi-bs-disk"></i>
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showModificarModal} onHide={handleOcultarModificarModal}>
        <Modal.Header closeButton>
          <Modal.Title>Modificación exitosa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>El tipo de documento ha sido modificado correctamente.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleOcultarModificarModal}>
            Ok
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        aria-labelledby="modal-eliminarEP"
        centered
        show={modalEliminarTD}
        size="sm"
      >
        <Modal.Header closeButton onHide={handleOcultarModalEliminarTD}>
          <Modal.Title>Eliminar</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            ¿Está seguro que desea eliminar este tipo de documento de la BD?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="customize-btn-1"
            type="submit"
            onClick={() => {
              eliminarTipoDocumento(tipoDocumentoSeleccionadoId);
              handleOcultarModalEliminarTD();
            }}
          >
            Si
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TipoDocumento;
