import React, { useState, useEffect } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import axios from "axios";
import Modal from 'react-bootstrap/Modal';
//Comentario

const AdminParametros = () => {
  const [modalConfirmacion, setModalConfirmacion] = useState(false);
  const handleHideConfirmacion = () => setModalConfirmacion(false);
  const handleShowConfirmacion = () => setModalConfirmacion(true);

  const [escuelas, setEscuelas] = useState([]);

  useEffect(() => {
    cargarElementos();
  }, []);

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

  function eliminarEscuela(id) {
    axios
      .delete(`https://backfimgc.azurewebsites.net/api/escuela/${id}`)
      .then((response) => {
        console.log(response.data);
        setEscuelas(escuelas.filter((escuela) => escuela.id !== id));
      })
      .catch((error) => {
        console.error(error);
      });
    console.log("Se borró");
  }

  return (
    <div>
      <div>
        <Tabs defaultActiveKey="memo_multiple" className="mb-3">
          <Tab tabClassName="horizontal-nav-link" eventKey="rol" title="ROL">
            <Container>
              <Button variant="outline-dark">Nuevo/Agregar</Button>{" "}
              <Button variant="outline-secondary">Modificar</Button>{" "}
              <Button variant="outline-success">Eliminar</Button>{" "}
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
                  <tr>
                    <td>Nombre rol</td>
                    <td>Descrip.</td>
                    <td>Columna por si las dudas</td>
                  </tr>
                </tbody>
              </Table>
            </Container>
          </Tab>
          <Tab
            tabClassName="horizontal-nav-link"
            eventKey="escuela_prof"
            title="ESCUELA PROFESIONAL"
          >
            <Container>
              <Button variant="outline-dark">Nuevo/Agregar</Button>{" "}
              <Button variant="outline-secondary">Modificar</Button>{" "}
            </Container>
            <Container className="table-container">
              <Table responsive="sm">
                <thead className="thead-text-customize">
                  <tr>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Director</th>
                    <th>Nombre</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {escuelas.map((dato) => (
                    <tr key={dato.id}>
                      <td>{dato.id}</td>
                      <td>{dato.nombre}</td>
                      <td>{dato.director}</td>
                      <td>{dato.descripcion}</td>
                      <td>
                      <button onClick={() => eliminarEscuela(dato.id)}>
                          Eliminar
                        </button>

                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Container>
          </Tab>
          <Tab
            tabClassName="horizontal-nav-link"
            eventKey="tipo_documento"
            title="TIPO DOCUMENTO"
          >
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
                  <tr>
                    <td>Nombre documento</td>
                    <td>Descrip(?)</td>
                    <td>Columna por si las dudas</td>
                  </tr>
                </tbody>
              </Table>
            </Container>
          </Tab>
          <Tab
            tabClassName="horizontal-nav-link"
            eventKey="plan"
            title="PLAN DE ESTUDIOS"
          >
            <Container className="table-container">
              <Table responsive="sm">
                <thead className="thead-text-customize">
                  <tr>
                    <th>Denominación del plan</th>
                    <th>Descripción</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Denominación del plan</td>
                    <td>Descrip(?)</td>
                    <td>Columna por si las dudas</td>
                  </tr>
                </tbody>
              </Table>
            </Container>
          </Tab>
          <Tab
            tabClassName="horizontal-nav-link"
            eventKey="tramite"
            title="TRÁMITE"
          >
            <Container className="table-container">
              <Table responsive="sm">
                <thead className="thead-text-customize">
                  <tr>
                    <th>Nombre trámite</th>
                    <th>Descripción</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Nombre trámite</td>
                    <td>Descrip(?)</td>
                    <td>Columna por si las dudas</td>
                  </tr>
                </tbody>
              </Table>
            </Container>
          </Tab>
        </Tabs>
        <Modal aria-labelledby="modal-de-confirmacion-de-eliminacion" size="sm"centered
                show={modalConfirmacion}>
                    <Modal.Header closeButton onHide={handleHideConfirmacion}>
                    <Modal.Title>¿Seguro que desea eliminar?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container className='table-container d-flex justify-content-center'>
                        <Table responsive="md">
                            <tbody >
                                <tr>
                                <td><Button onClick={handleShowConfirmacion}> SI</Button></td>
                                    <td><Button onClick={handleShowConfirmacion}> NO</Button></td>
                                    
                                </tr>
                            </tbody>
                        </Table>
                    </Container>
                </Modal.Body>

      </Modal>
      </div>
      
    </div>
  );
};

export default AdminParametros;
