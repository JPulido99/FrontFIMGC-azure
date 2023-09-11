import React, { useState, useEffect } from "react";
import axios from "axios";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";

const Tramite = () => {
  //Para el modal agregar
  const [modalAgregarTramite, setModalAgregarTramite] = useState(false);
  const handleOcultarModalAgregarTramite = () => setModalAgregarTramite(false);
  const handleMostrarModalAgregarTramite = () => setModalAgregarTramite(true);

  const handleNombreChange = (event) => setNombre(event.target.value);
  const handleDescripcionChange = (event) => setDescripcion(event.target.value);

  //Para el modal modificar
  const [modalModificarTramite, setModalModificarTramite] = useState(false);
  const handleOcultarModalModificarTramite = () =>
    setModalModificarTramite(false);
  const handleMostrarModalModificarTramite = (tramite) => {
    setTramiteSeleccionado(tramite);
    setModalModificarTramite(true);
    setIsFormSubmitted(false);
  };

  //Para el modal eliminar
  const [modalEliminarTramite, setModalEliminarTramite] = useState(false);
  const handleOcultarModalEliminarTramite = () =>
    setModalEliminarTramite(false);
  const handleMostrarModalEliminarTramite = () => setModalEliminarTramite(true);

  //FUNCION PARA ELIMINAR ELEMENTO
  function eliminarTramite(id) {
    axios
      .delete(`https://backfimgc.azurewebsites.net/api/tramite/${id}`)
      .then((response) => {
        setTramites(tramites.filter((tramite) => tramite.id !== id));
      })
      .catch((error) => {
        console.error(error);
      });
    console.log("Se borró");
  }
  const [tramiteSeleccionadoId, setTramiteSeleccionadoId] = useState(null);
  //CARGAR ELEMENTOS
  const [tramites, setTramites] = useState([]);
  function cargarElementos() {
    axios
      .get("https://backfimgc.azurewebsites.net/api/tramite")
      .then((response) => {
        setTramites(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }
  //cargar tabla
  useEffect(() => {
    cargarElementos();
  }, []);
  //MODIFICAR TRAMITE
  const [tramiteSeleccionado, setTramiteSeleccionado] = useState({});

  function modificarTramite() {
    const { id } = tramiteSeleccionado;
    axios
      .put(`https://backfimgc.azurewebsites.net/api/tramite/${id}`, {
        nombre: nombreModificado,
        descripcion: descripcionModificada,
      })
      .then((response) => {
        // Realiza cualquier otra acción necesaria después de modificar el trámite
        cargarElementos(); // Vuelve a cargar los elementos después de modificar el trámite
        handleOcultarModalModificarTramite(); // Oculta el modal de modificación
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const [nombreModificado, setNombreModificado] = useState("");
  const [descripcionModificada, setDescripcionModificada] = useState("");

  //PARA MOSTRAR LOS ELEMENTOS A MODIFICAR
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const [formValues, setFormValues] = useState({
    nombre: "",
    descripcion: "",
  });

  //FUNCION AGREGAR TRAMITE
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const agregarTramite = () => {
    
    axios
      .post("https://backfimgc.azurewebsites.net/api/tramite", {
        nombre: nombre,
        descripcion:descripcion,
      })
      .then((response) => {
        setTramites([...tramites, response.data]);
        handleOcultarModalAgregarTramite();
        setNombre("");
        setDescripcion("");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      <Container>
        <legend className="customize-legend text-uppercase">Trámites</legend>
        <Button
          variant="outline-success"
          onClick={handleMostrarModalAgregarTramite}
        >
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
            {tramites.map((dato) => (
              <tr key={dato.id}>
                <td>{dato.nombre}</td>
                <td>{dato.descripcion}</td>
                <td>
                  <Button size="sm" variant="outline-secondary btn-into-table" onClick={() => handleMostrarModalModificarTramite(dato)}
                  >
                    Modificar <i className="fi fi-bs-file-edit"></i>
                  </Button>{" "}
                  <Button
                    size="sm"
                    variant="outline-danger btn-into-table"
                    onClick={() => {
                      handleMostrarModalEliminarTramite();
                      setTramiteSeleccionadoId(dato.id);
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

      <Modal aria-labelledby="modal-AgregarTramite" centered show={modalAgregarTramite} >
        <Modal.Header closeButton onHide={handleOcultarModalAgregarTramite}>
          <Modal.Title>Agregar trámite</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {isFormSubmitted && nombre === "" && descripcion === ""&& (
            <p className="error-message">Todos los campos.</p>
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
                  onChange={handleNombreChange}
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
                  onChange={handleDescripcionChange}
                />
              </Col>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="customize-btn-1"
            type="submit"
            onClick={agregarTramite}
          >
            Guardar <i className="fi fi-bs-disk"></i>
          </Button>
        </Modal.Footer>
      </Modal>


      <Modal aria-labelledby="modal-modificarTramite" centered show={modalModificarTramite}>
        <Modal.Header closeButton onHide={handleOcultarModalModificarTramite}>
          <Modal.Title className='title-modal1'>Modificar Tramite</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isFormSubmitted && nombre === "" && (
            <p className="error-message">Llene el campo por favor.</p>
          )}
          <Form>
          <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="3" className="fw-bold customize-flabel">Nombre</Form.Label>
              <Col sm="9">
              <Form.Control
              type="text"
                  value={nombreModificado}
                  onChange={(e) => setNombreModificado(e.target.value)}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="3" className="fw-bold customize-flabel">Descripción</Form.Label>
              <Col sm="9">
              <Form.Control
              as="textarea"
                  value={descripcionModificada}
                  onChange={(e) => setDescripcionModificada(e.target.value)}
                />
              </Col>
            </Form.Group>
            
            
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="customize-btn-1"
            type="submit"
            onClick={modificarTramite}
          >
            Guardar modificacion
          </Button>
        </Modal.Footer>
      </Modal>


      <Modal aria-labelledby="modal-eliminarEP" centered show={modalEliminarTramite} size="sm">
        <Modal.Header closeButton onHide={handleOcultarModalEliminarTramite}>
          <Modal.Title className='title-modal1'>Eliminar</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>¿Está seguro que desea eliminar este trámite de la BD?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="customize-btn-1"
            type="submit"
            onClick={() => {
              eliminarTramite(tramiteSeleccionadoId);
              handleOcultarModalEliminarTramite();
            }}
          >
            Si
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default Tramite;
