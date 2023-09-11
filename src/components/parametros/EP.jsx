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

const EP = () => {
  //Para el modal agregar EP
  const [modalAgregar, setModalAgregar] = useState(false);
  const handleOcultarModalAgregarEP = () => {
    setModalAgregar(false);
    setNombre("");
    setDirector("");
  };
  const handleMostrarModalAgregarEP = () => setModalAgregar(true);
  //Para establecer los datos iniciales (vacío) de la escuela a agregar
  const [nombre, setNombre] = useState("");
  const [director, setDirector] = useState("");

  //Para los alert (funciona para el de agregar y modificar) cuando un input esté vacío
  const [showAlert, setShowAlert] = useState(false); //valor inicial en falso para que no se muestre

  const handleInputChange = (e) => {
    //Controlador de eventos o cambios de los inputs
    const { name, value } = e.target;

    // Actualiza el estado del campo modificado
    if (name === "nombre") {
      setNombre(value);
    } else if (name === "director") {
      setDirector(value);
    }

    // Oculta el Alert si se comienza a escribir en un campo vacío
    if (showAlert && value !== "") {
      setShowAlert(false);
    }
  };

  //Al hacer clic en el botón guardar (modal agregar)
  const handleGuardar = () => {
    if (nombre === "" || director === "") {
      setShowAlert(true);
    } else {
      setShowAlert(false);
      handleOcultarModalAgregarEP();

      // Mostrar datos en consola
      cargarElementos();
      //aquí va lo del axios, me parece.
      axios
        .post("https://backfimgc.azurewebsites.net/api/escuela", {
          nombre: nombre,
          director: director,
        })
        .then((response) => {
          setEscuelas([...escuelas, response.data]);
          handleOcultarModalAgregarEP();
          setNombre("");
          setDirector("");
        })
        .catch((error) => {
          console.error(error);
        });
      // Reinicia los valores de los inputs
      setNombre("");
      setDirector("");
      cargarElementos();
    }
  };
  //MOSTRAR ELEMENTOS
  function cargarElementos() {
    axios
      .get("https://backfimgc.azurewebsites.net/api/escuela")
      .then((response) => {
        setEscuelas(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }
  useEffect(() => {
    cargarElementos();
  }, []);

  //Para el modal modificar EP
  

  const [modalModificar, setModalModificar] = useState(false);
  const handleOcultarModalModificar = () => setModalModificar(false);
  const handleMostrarModalModificar = (escuela) => {
    setEscuelaSeleccionadaId(escuela.id);
    setNombre(escuela.nombre);
    setDirector(escuela.director);
    setModalModificar(true);
  };
  //FUNCION PARA MODIFICAR
  const handleGuardarModificacion = () => {
    if (nombre === "" || director === "" ) {
      setShowAlert(true);
    } else {
      setShowAlert(false);
      handleOcultarModalModificar();

      //aquí va lo del axios para actualizar los datos
      axios
        .put(`https://backfimgc.azurewebsites.net/api/escuela/${escuelaSeleccionadaId}`, {
          nombre: nombre,
          director: director,
        })
        .then((response) => {
          // Actualizar los datos modificados en el estado
          const index = escuelas.findIndex(
            (escuela) => escuela.id === escuelaSeleccionadaId
          );
          const updatedEscuelas = [...escuelas];
          updatedEscuelas[index] = response.data;
          setEscuelas(updatedEscuelas);

          // Reiniciar los valores de los inputs
          setNombre("");
          setDirector("");
          setDescripcion("");
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  //Para el modal eliminar EP
  const [modalEliminar, setModalEliminar] = useState(false);
  const handleOcultarModalEliminar = () => setModalEliminar(false);
  const handleMostrarModalEliminar = () => setModalEliminar(true);

  //La URL del controlador en el back

  //Para modificar escuela
  const [escuelaSeleccionadaId, setEscuelaSeleccionadaId] = useState(null);

  //Para obtener escuelas
  const [escuelas, setEscuelas] = useState([]);

  //FUNCION PARA ELIMINAR
  function eliminarEP(id) {
    axios
      .delete(`https://backfimgc.azurewebsites.net/api/escuela/${id}`)
      .then((response) => {
        setEscuelas(escuelas.filter((escuela) => escuela.id !== id));
      })
      .catch((error) => {
        console.error(error);
      });
  }

  

  return (
    <div>
      <Container>
        <legend className="customize-legend text-uppercase">
          Escuelas profesionales
        </legend>
        <Button variant="outline-success" onClick={handleMostrarModalAgregarEP}>
          Agregar <i className="fi fi-bs-add-document"></i>
        </Button>
      </Container>
      <Container className="table-container">
        <Table responsive="sm">
          <thead className="thead-text-customize">
            <tr>
              <th>Nombre</th>
              <th>Director</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {escuelas.map((dato) => (
              <tr key={dato.id}>
                <td>{dato.nombre}</td>
                <td>{dato.director}</td>
                <td>
                  <Button
                    size="sm"
                    variant="outline-secondary btn-into-table"
                    onClick={() => handleMostrarModalModificar(dato)}
                  >
                    Modificar <i className="fi fi-bs-file-edit"></i>
                  </Button>

                  <Button
                    size="sm"
                    variant="outline-danger btn-into-table"
                    onClick={() => {
                      handleMostrarModalEliminar();
                      setEscuelaSeleccionadaId(dato.id);
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

      <Modal aria-labelledby="modal-agregarEP" centered show={modalAgregar}>
        <Modal.Header closeButton onHide={handleOcultarModalAgregarEP}>
          <Modal.Title>Agregar Escuela Profesional</Modal.Title>
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
                  autoFocus
                  value={nombre}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
              <Form.Label column sm="3" className="fw-bold customize-flabel">
                Director</Form.Label>
              <Col sm="9">
                <Form.Control
                  type="text"
                  name="director"
                  required
                  value={director}
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
            onClick={() => {
              handleGuardar();
            }}
          >
            Guardar <i className="fi fi-bs-disk"></i>
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal aria-labelledby="modal-modificarEP" centered show={modalModificar}>
        <Modal.Header closeButton onHide={handleOcultarModalModificar}>
          <Modal.Title>Modificar datos de la Escuela Profesional</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {showAlert && (
            <Alert key="danger" variant="danger">
              <i className="fi fi-br-exclamation"></i> Debe rellenar todos los campos.
            </Alert>
          )}
          <Form>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="3" className="fw-bold customize-flabel">Nombre de escuela</Form.Label>
              <Col sm="9">
              <Form.Control
                type="text"
                name="nombre"
                value={nombre}
                onChange={handleInputChange}
              />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
              <Form.Label column sm="3" className="fw-bold customize-flabel">Director</Form.Label>
              <Col sm="9">
              <Form.Control
                type="text"
                name="director"
                value={director}
                onChange={handleInputChange}
              />
              </Col>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button className="customize-btn-1" onClick={handleGuardarModificacion}>Guardar <i className="fi fi-bs-disk"></i></Button>
        </Modal.Footer>
      </Modal>

      <Modal aria-labelledby="modal-eliminarEP" centered show={modalEliminar}>
        <Modal.Header closeButton onHide={handleOcultarModalEliminar}>
          <Modal.Title>Eliminar Escuela Profesional</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            ¿Está seguro que desea eliminar esta escuela profesional de la BD?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="customize-btn-1"
            type="submit"
            onClick={() => {
              eliminarEP(escuelaSeleccionadaId);
              handleOcultarModalEliminar();
            }}
          >
            Si
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EP;
