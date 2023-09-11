import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Button,
  Row,
  Col,
  Table,
  Form,
  Modal,
  Alert,
} from "react-bootstrap";

const Modalidad = () => {
  //Para el modal agregar
  const [modalAgregarMod, setModalAgregarMod] = useState(false);
  const handleOcultarAgregarMod = () => setModalAgregarMod(false);
  const handleMostrarAgregarMod = () => setModalAgregarMod(true);

  //Para el modal modificar
  const [modalEditarMod, setModalEditarMod] = useState(false);
  const handleOcultarEditarMod = () => setModalEditarMod(false);
  const handleMostrarEditarMod = (modalidad) => {setModalidadSeleccionadaId(modalidad.id);
    
    setNombre(modalidad.nombre);
    setDescripcion(modalidad.descripcion);
    setModalEditarMod(true);
  };

  //Para el modal eliminar
  const [modalEliminarMod, setModalEliminarMod] = useState(false);
  const handleOcultarEliminarMod = () => setModalEliminarMod(false);
  const handleMostrarEliminarMod = () => setModalEliminarMod(true);

  //Para establecer los datos iniciales (vacío)
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");

  //Para el alert
  const [showAlertM, setShowAlertM] = useState(false);

  const handleInputChange = (e) => {
    //Controlador de eventos o cambios de los inputs
    const { name, value } = e.target;

    // Actualiza el estado del campo modificado
    if (name === "nombre") {
      setNombre(value);
    } else if (name === "descripcion") {
      setDescripcion(value);
    }

    // Oculta el Alert si se comienza a escribir en un campo vacío
    if (showAlertM && value !== "") {
      setShowAlertM(false);
    }
  };
  const [modalidades, setModalidades] = useState([]);
  //Al hacer clic en el botón guardar (modal agregar)
  const handleGuardar = () => {
    if (nombre === "" || descripcion === "") {
      setShowAlertM(true);
    } else {
      setShowAlertM(false);
      handleOcultarAgregarMod();

      // Mostrar datos en consola
      console.log({ nombre, descripcion });
      //aquí va lo del axios, me parece.
      axios
        .post("https://fimgc-back.rj.r.appspot.com/api/modalidadIngreso", {
          nombre: nombre,
          descripcion: descripcion,
        })
        .then((response) => {
          setModalidades([...modalidades, response.data]);
          setNombre("");
          setDescripcion("");
        })
        .catch((error) => {
          console.error(error);
        });
      // Reinicia los valores de los inputs
      setNombre("");
      setDescripcion("");
    }
  };

  const handleModificar = () => {
    if (nombre === "" || descripcion === "") {
      setShowAlertM(true);
    } else {
      setShowAlertM(false);
      handleOcultarEditarMod();

      // Mostrar datos en consola
      console.log({ nombre, descripcion });
      //aquí va lo del axios, me parece.
      axios
      .put(`https://fimgc-back.rj.r.appspot.com/api/modalidadIngreso/${modalidadSeleccionadaId}`, {
        nombre: nombre,
        descripcion:descripcion,
      })
      .then((response) => {
        // Actualizar los datos modificados en el estado
        const index = modalidades.findIndex(
          (modalidad) => modalidad.id === modalidadSeleccionadaId
        );
        const updatedModalidades = [...modalidades];
        updatedModalidades[index] = response.data;
        setModalidades(updatedModalidades);

        // Reiniciar los valores de los inputs
        setNombre("");
        setDescripcion("");
      })
      .catch((error) => {
        console.error(error);
      });
      // Reinicia los valores de los inputs
      setNombre("");
      setDescripcion("");
    }
  };

  function cargarElementos() {
    axios
      .get("https://fimgc-back.rj.r.appspot.com/api/modalidadIngreso/list")
      .then((response) => {
        setModalidades(response.data);
        console.log("modalidadesitas:", response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }
  useEffect(() => {
    cargarElementos();
  }, []);
  const [modalidadSeleccionadaId, setModalidadSeleccionadaId] = useState(null);
  function eliminarModalidad(id) {
    axios
      .delete(`https://fimgc-back.rj.r.appspot.com/api/modalidadIngreso/${id}`)
      .then((response) => {
        setModalidades(modalidades.filter((modalidad) => modalidad.id !== id));
      })
      .catch((error) => {
        console.error(error);
      });
    console.log("Se borró");
  }

  return (
    <div>
      <Container>
        <legend className="customize-legend text-uppercase">Modalidades</legend>
        <Button variant="outline-success" onClick={handleMostrarAgregarMod}>
          Agregar <i className="fi fi-bs-add-document"></i>
        </Button>
      </Container>
      <Container className="table-container">
        <Table responsive="sm">
          <thead className="thead-text-customize">
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {modalidades.map((dato) => (
              <tr key={dato.id}>
                <td>{dato.nombre}</td>
                <td>{dato.descripcion}</td>
                <td>
                  <Button
                    size="sm"
                    variant="outline-secondary btn-into-table"
                    onClick={()=>{handleMostrarEditarMod(dato);
                        }}
                  >
                    Modificar <i className="fi fi-bs-file-edit"></i>
                  </Button>{" "}
                  <Button
                    size="sm"
                    variant="outline-danger btn-into-table"
                    onClick={() => {handleMostrarEliminarMod();
                        setModalidadSeleccionadaId(dato.id);
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

      <Modal aria-labelledby="modal-AgregarMod" centered show={modalAgregarMod}>
        <Modal.Header closeButton onHide={handleOcultarAgregarMod}>
          <Modal.Title className="title-modal1">Agregar modalidad</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {showAlertM && (
            <Alert key="danger" variant="danger">
              <i className="fi fi-br-exclamation"></i> Debe rellenar todos los
              campos.
            </Alert>
          )}
          <Form>
            <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
              <Form.Label column sm="3" className="fw-bold customize-flabel">
                Nombre
              </Form.Label>
              <Col sm="9">
                <Form.Control
                  type="text"
                  name="nombre"
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
              <Form.Label column sm="3" className="fw-bold customize-flabel">
                Descripción
              </Form.Label>
              <Col sm="9">
                <Form.Control
                  as="textarea"
                  name="descripcion"
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
            onClick={handleGuardar}
          >
            Guardar <i className="fi fi-bs-disk"></i>
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal aria-labelledby="modal-modificarEP" centered show={modalEditarMod}>
        <Modal.Header closeButton onHide={handleOcultarEditarMod}>
          <Modal.Title className="title-modal1">Modificar datos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {showAlertM && (
            <Alert key="danger" variant="danger">
              <i className="fi fi-br-exclamation"></i> Debe rellenar todos los
              campos.
            </Alert>
          )}
          <Form>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="3" className="fw-bold customize-flabel">
                Nombre
              </Form.Label>
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
                Descripción
              </Form.Label>
              <Col sm="9">
                <Form.Control
                  as="textarea"
                  name="descripcion"
                  value={descripcion}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button className="customize-btn-1" onClick={handleModificar}type="submit">
            Guardar <i className="fi fi-bs-disk"></i>
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        aria-labelledby="modal-eliminarEP"
        centered
        show={modalEliminarMod}
        size="sm"
      >
        <Modal.Header closeButton onHide={handleOcultarEliminarMod}>
          <Modal.Title className="title-modal1">Eliminar</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>¿Está seguro que desea eliminar esta modalidad de la BD?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="customize-btn-1"
            onClick={() => {
                eliminarModalidad(modalidadSeleccionadaId);
                handleOcultarEliminarMod();
              }}
          >
            Si
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Modalidad;
