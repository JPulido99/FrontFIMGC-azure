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

const Rol = () => {
  //Para alerts
  const [showAlert, setShowAlert] = useState(false);
  const handleInputChange = (e) => {
    //Controlador de eventos o cambios de los inputs
    const { name, value } = e.target;

    // Actualiza el estado del campo modificado
    if (name === "nombre") {
      setNombre(value);
    }
    // Oculta el Alert si se comienza a escribir en un campo vacío
    if (showAlert && value !== "") {
      setShowAlert(false);
    }
  };
  
  //Para el modal agregar
  const [nombre, setNombre] = useState("");
  const [modalAgregarRol, setModalAgregarRol] = useState(false);
  const handleOcultarModalAgregarRol = () => {
    setModalAgregarRol(false);
    setNombre("");
    setIsFormSubmitted(false);
  };
  const handleMostrarModalAgregarRol = () => setModalAgregarRol(true);
  const handleNombreChange = (event) => setNombre(event.target.value);

  //Para el modal modificar
  const [modalModificarRol, setModalModificarRol] = useState(false);
  const handleOcultarModalModificarRol = () => setModalModificarRol(false);
  const handleMostrarModalModificarRol = (rol) => {
    setRolSeleccionadoId(rol.id);
    setNombre(rol.nombre);
    setModalModificarRol(true);
  };

  //Para el modal eliminar
  const [modalEliminarRol, setModalEliminarRol] = useState(false);
  const handleOcultarModalEliminarRol = () => setModalEliminarRol(false);
  const handleMostrarModalEliminarRol = () => setModalEliminarRol(true);

  const [roles, setRoles] = useState([]); //se usa para eliminar roles
  const [rolSeleccionadoId, setRolSeleccionadoId] = useState(null); //Se usa para eliminar el rol

  //PROBANDO METODO DE MODIFICAR
  const [rolSeleccionado, setRolSeleccionado] = useState(null);
  const [nombreModificado, setNombreModificado] = useState("");
  const [showAgregarModal, setShowAgregarModal] = useState(false);

  //Para la validacion de no aceptar espacios vacios
  const [error, setError] = useState("");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const [formValues, setFormValues] = useState({
    nombre: "",
  });
  //PRACTICANDO MODALES

  const agregarRol = () => {
    if (nombre === "") {
      setShowAlert(true);
    } else {
      setShowAlert(false);
      handleOcultarModalAgregarRol();
      axios
        .post("https://backfimgc.azurewebsites.net/api/rol", {
          nombre: nombre,
        })
        .then((response) => {
          setRoles([...roles, response.data]);
          handleOcultarModalAgregarRol();
          setNombre("");
        })
        .catch((error) => {
          console.error(error);
        });
      setNombre("");
      setShowAgregarModal(true);
    }
  };
  function eliminarRol(id) {
    axios
      .delete(`https://backfimgc.azurewebsites.net/api/rol/${id}`)
      .then((response) => {
        setRoles(roles.filter((rol) => rol.id !== id));
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const handleGuardarModificacion = () => {
    if (nombre === "") {
      setShowAlert(true);
    } else {
      setShowAlert(false);
      handleOcultarModalModificarRol();

      //aquí va lo del axios para actualizar los datos
      axios
        .put(`https://backfimgc.azurewebsites.net/api/rol/${rolSeleccionadoId}`, {
          nombre: nombre,
        })
        .then((response) => {
          // Actualizar los datos modificados en el estado
          const index = roles.findIndex(
            (rol) => rol.id === rolSeleccionadoId
          );
          const updatedRoles = [...roles];
          updatedRoles[index] = response.data;
          setRoles(updatedRoles);

          // Reiniciar los valores de los inputs
          setNombre("");
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  function cargarElementos() {
    axios
      .get("https://backfimgc.azurewebsites.net/api/rol")
      .then((response) => {
        setRoles(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }
  useEffect(() => {
    cargarElementos();
  }, []);


  return (
    <div>
      <Container>
        <legend className="customize-legend text-uppercase">Roles</legend>
        <Button variant="outline-success" onClick={handleMostrarModalAgregarRol}>
          Agregar <i className="fi fi-bs-add-document"></i>
        </Button>
      </Container>
      <Container className="table-container">
        <Table responsive="sm">
          <thead className="thead-text-customize">
            <tr>
              <th>Id</th>
              <th>Nombre</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((dato) => (
              <tr key={dato.id}>
                <td>{dato.id}</td>
                <td>{dato.nombre}</td>
                <td>
                  <Button size="sm"variant="outline-secondary btn-into-table"onClick={() => {handleMostrarModalModificarRol(dato);setRolSeleccionadoId(dato.id);}
                  }
                  >
                    Modificar <i className="fi fi-bs-file-edit"></i>
                  </Button>

                  <Button size="sm"variant="outline-danger btn-into-table"onClick={() => {handleMostrarModalEliminarRol();
                      setRolSeleccionadoId(dato.id);
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

      <Modal aria-labelledby="modal-agregarRol" centered show={modalAgregarRol} size="sm">
        <Modal.Header closeButton onHide={handleOcultarModalAgregarRol}>
          <Modal.Title>Agregar rol</Modal.Title>
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
              <Form.Label column sm="4" className="fw-bold customize-flabel">
                Nombre</Form.Label>
              <Col sm="8">
                <Form.Control
                  type="text"
                  name="nombre"
                  autoFocus
                  value={nombre}
                  onChange={handleNombreChange}
                />
              </Col>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="customize-btn-1"
            type="submit"
            onClick={agregarRol}
          >
            Guardar datos
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showAgregarModal} onHide={() => setShowAgregarModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Rol agregado correctamente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>¡El nuevo rol ha sido agregada correctamente!</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowAgregarModal(false)}
          >
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal aria-labelledby="modal-modificarRol" centered show={modalModificarRol} size="sm">
        <Modal.Header closeButton onHide={handleOcultarModalModificarRol}>
          <Modal.Title>Modificar rol</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {showAlert && (
            <Alert key="danger" variant="danger">
              <i className="fi fi-br-exclamation"></i> Debe rellenar todos los campos.
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
                value={nombre}
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

      <Modal
        aria-labelledby="modal-eliminarEP"
        centered
        show={modalEliminarRol}
        size="sm"
      >
        <Modal.Header closeButton onHide={handleOcultarModalEliminarRol}>
          <Modal.Title>Eliminar</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>¿Está seguro que desea eliminar este rol de la BD?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="customize-btn-1"
            type="submit"
            onClick={() => {
              eliminarRol(rolSeleccionadoId);
              handleOcultarModalEliminarRol();
            }}
          >
            Si
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Rol;
