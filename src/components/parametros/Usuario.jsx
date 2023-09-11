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

const PlanEstudios = () => {
  const API_URL = "https://fimgc-back.rj.r.appspot.com/api";

  //Poner el url del controlador del back aquí

  const [escuelas, setEscuelas] = useState([]);

  const [formulario, setFormulario] = useState({
    nombrePlan: "",
    anioPlan: "",
    idEscuela: "",
    tipoC1: "",
    valorC1: "",
    tipoC2: "",
    valorC2: "",
    tipoC3: "",
    valorC3: "",
    tipoC4: "",
    valorC4: "",
    tipoC5: "",
    valorC5: "",
    tipoC6: "",
    valorC6: "",
    tipoC7: "",
    valorC7: "",
    tipoC8: "",
    valorC8: "",
  });
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormulario((prevFormulario) => ({
      ...prevFormulario,
      [name]: value,
    }));
  };

  //Para la visualización de la sección de los créditos
  const [verCreditos, setVerCreditos] = useState(false);

  //Para el modal agregar plan de estudios
  const [modalAgregarPE, setModalAgregarPE] = useState(false);
  const handleOcultarModalAgregarPE = () => setModalAgregarPE(false);
  const handleMostrarModalAgregarPE = () => setModalAgregarPE(true);
  //Para establecer los datos iniciales (vacío) del plan de estudios a agregar
  const [nombrePlan, setNombrePlan] = useState("");
  const [anioPlan, setAnioPlan] = useState("");
  const [idEscuela, setIdEscuela] = useState();
  const [datos, setDatos] = useState([]);
  const [tipoC1, setTipoC1] = useState("");
  const [valorC1, setValorC1] = useState("");
  const [tipoC2, setTipoC2] = useState("");
  const [valorC2, setValorC2] = useState("");
  const [tipoC3, setTipoC3] = useState("");
  const [valorC3, setValorC3] = useState("");
  const [tipoC4, setTipoC4] = useState("");
  const [valorC4, setValorC4] = useState("");
  const [tipoC5, setTipoC5] = useState("");
  const [valorC5, setValorC5] = useState("");
  const [tipoC6, setTipoC6] = useState("");
  const [valorC6, setValorC6] = useState("");
  const [tipoC7, setTipoC7] = useState("");
  const [valorC7, setValorC7] = useState("");
  const [tipoC8, setTipoC8] = useState("");
  const [valorC8, setValorC8] = useState("");

  //Para los alert cuando un input esté vacío
  const [showAlertPE, setShowAlertPE] = useState(false);

  const handleInputChangePE = (e) => {
    //Controlador de eventos o cambios de los inputs
    const { name, value } = e.target;

    // Actualiza el estado del campo modificado
    if (name === "nombrePlan") {
      setNombrePlan(value);
    } else if (name === "anioPlan") {
      setAnioPlan(value);
    } else if (name === "idEscuela") {
      setIdEscuela(value);
    } else if (name === "tipoC1") {
      setTipoC1(value);
    } else if (name === "valorC1") {
      setValorC1(value);
    } else if (name === "tipoC2") {
      setTipoC2(value);
    } else if (name === "valorC2") {
      setValorC2(value);
    } else if (name === "tipoC3") {
      setTipoC3(value);
    } else if (name === "valorC3") {
      setValorC3(value);
    } else if (name === "tipoC4") {
      setTipoC4(value);
    } else if (name === "valorC4") {
      setValorC4(value);
    } else if (name === "tipoC5") {
      setTipoC5(value);
    } else if (name === "valorC5") {
      setValorC5(value);
    } else if (name === "tipoC6") {
      setTipoC6(value);
    } else if (name === "valorC6") {
      setValorC6(value);
    } else if (name === "tipoC7") {
      setTipoC7(value);
    } else if (name === "valorC7") {
      setValorC7(value);
    } else if (name === "tipoC8") {
      setTipoC8(value);
    } else if (name === "valorC8") {
      setValorC8(value);
    }

    setFormulario((prevFormulario) => ({
      ...prevFormulario,
      [name]: value,
    }));

    // Oculta el Alert si se comienza a escribir en un campo vacío
    if (showAlertPE && value !== "") {
      setShowAlertPE(false);
    }
  };

  useEffect(() => {
    axios
      .get("https://fimgc-back.rj.r.appspot.com/api/plan")
      .then((response) => {
        setDatos(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  useEffect(() => {
    axios
      .get("https://fimgc-back.rj.r.appspot.com/api/escuela/listEscuelas")
      .then((response) => {
        setEscuelas(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  //ACTUALIZAR TABLA
  const actualizarTabla = () => {
    axios
      .get("https://fimgc-back.rj.r.appspot.com/api/plan")
      .then((response) => {
        setDatos(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  //ELIMINAR REGISTRO
  const handleEliminar = (id) => {
    axios
      .delete(`https://fimgc-back.rj.r.appspot.com/api/plan/${id}`)
      .then((response) => {
        actualizarTabla();
        // Manejar la respuesta exitosa
        console.log(response.data);
      })
      .catch((error) => {
        // Manejar el error
        console.error(error);
        console.log(id);
      });
    setModalAgregarPE(false);
  };
  const handleVerCreditos = () => {
    if (nombrePlan === "" || anioPlan === "" || idEscuela === "") {
      setShowAlertPE(true);
    } else {
      setVerCreditos(true);
    }
  };

  //Funcionalidad botón Guardar (modal agregarPE)
  const handleGuardarPE = () => {
    if (nombrePlan === "" || anioPlan === "" || idEscuela === "") {
      setShowAlertPE(true);
    } else {
      setVerCreditos(true);
      const postData = {
        nombrePlan: formulario.nombrePlan,
        anioPlan: formulario.anioPlan,
        tipoC1: formulario.tipoC1,
        valorC1: formulario.valorC1,
        tipoC2: formulario.tipoC2,
        valorC2: formulario.valorC2,
        tipoC3: formulario.tipoC3,
        valorC3: formulario.valorC3,
        tipoC4: formulario.tipoC4,
        valorC4: formulario.valorC4,
        tipoC5: formulario.tipoC5,
        valorC5: formulario.valorC5,
        tipoC6: formulario.tipoC6,
        valorC6: formulario.valorC6,
        tipoC7: formulario.tipoC7,
        valorC7: formulario.valorC7,
        tipoC8: formulario.tipoC8,
        valorC8: formulario.valorC8,
        escuela: {
          id: formulario.idEscuela,
        },
      };

      axios
        .post("https://fimgc-back.rj.r.appspot.com/api/plan/registrar", postData)
        .then((response) => {
          // Manejar la respuesta exitosa
          console.log(response.data);
          actualizarTabla();
        })
        .catch((error) => {
          // Manejar el error
          console.error(error);
        });
    }
  };

  const [creditos, setCreditos] = useState([]);
  const [creditosForm, setCreditosForm] = useState([
    { denominacion: "", creditos: "" },
  ]);
  //Para el modal modificar plan de estudios
  const [modalModificarPE, setModalModificarPE] = useState(false);
  const handleOcultarModalModificarPE = () => setModalModificarPE(false);
  const handleMostrarModalModificarPE = () => setModalModificarPE(true);

  //Para el modal eliminar plan de estudios
  const [modalEliminarPE, setModalEliminarPE] = useState(false);
  const handleOcultarModalEliminarPE = () => setModalEliminarPE(false);
  const handleMostrarModalEliminarPE = () => setModalEliminarPE(true);

  return (
    <div>
      <Container>
        <legend className="customize-legend text-uppercase">
          Planes de estudios
        </legend>
        <Button variant="outline-success" onClick={handleMostrarModalAgregarPE}>
          Agregar <i className="fi fi-bs-add-document"></i>
        </Button>
      </Container>
      <Container className="table-container">
        <Table responsive="sm">
          <thead className="thead-text-customize">
            <tr>
              <th>idPlan</th>
              <th>Nombre</th>
              <th>Año</th>
              <th>Escuela profesional</th>
              <th>Créditos</th>

              <th></th>
            </tr>
          </thead>
          <tbody>
            {datos.map((item) => {
              const escuela = escuelas.find(
                (escuela) => escuela.id === item.escuela.id
              );
              const nombreEscuela = escuela ? escuela.nombre : "";
              return (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.nombrePlan}</td>
                  <td>{item.anioPlan}</td>
                  <td>{nombreEscuela}</td>
                  <td>
                    {item.tipoC1 &&
                      item.valorC1 &&
                      `${item.tipoC1}-${item.valorC1}`}
                    <br />
                    {item.tipoC2 &&
                      item.valorC2 &&
                      `${item.tipoC2}-${item.valorC2}`}
                    <br />
                    {item.tipoC3 &&
                      item.valorC3 &&
                      `${item.tipoC3}-${item.valorC3}`}
                    <br />
                    {item.tipoC5 &&
                      item.valorC5 &&
                      `${item.tipoC5}-${item.valorC5}`}
                    <br />
                    {item.tipoC6 &&
                      item.valorC6 &&
                      `${item.tipoC6}-${item.valorC6}`}
                    <br />
                    {item.tipoC7 &&
                      item.valorC7 &&
                      `${item.tipoC7}-${item.valorC7}`}
                    <br />
                    {item.tipoC8 &&
                      item.valorC8 &&
                      `${item.tipoC8}-${item.valorC8}`}
                    <br />
                  </td>
                  <td>
                    <Button
                      onClick={() => handleEliminar(item.id)}
                      variant="danger"
                    >
                      Eliminar
                    </Button>
                    <Button
                      onClick={() => handleModificar(item.id)}
                      variant="primary"
                    >
                      Modificar
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Container>

      <Modal
        aria-labelledby="modal-agregarEP"
        centered
        show={modalAgregarPE}
        size="lg"
      >
        <Modal.Header closeButton onHide={handleEliminar}>
          <Modal.Title className="title-modal1">
            Agregar plan de estudios
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {showAlertPE && (
            <Alert key="danger" variant="danger">
              <i className="fi fi-br-exclamation"></i> Complete la información
              requerida y asegúrese que los créditos sean valores numéricos.
            </Alert>
          )}
          <Form>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="4" className="fw-bold customize-flabel">
                Nombre
              </Form.Label>
              <Col sm="3">
                <Form.Control
                  type="text"
                  name="nombrePlan"
                  autoFocus
                  value={nombrePlan}
                  onChange={handleInputChangePE}
                />
              </Col>

              <Form.Label column sm="2" className="fw-bold customize-flabel">
                Año
              </Form.Label>
              <Col sm="3">
                <Form.Control
                  type="text"
                  name="anioPlan"
                  value={anioPlan}
                  onChange={handleInputChangePE}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
              <Form.Label column sm="4" className="fw-bold customize-flabel">
                Escuela profesional
              </Form.Label>
              <Col sm="8">
                <Form.Select
                  aria-label="Nombre Escuela"
                  name="idEscuela"
                  value={formulario.idEscuela}
                  onChange={handleChange}
                >
                  <option>Seleccione</option>
                  {escuelas.map((escuela) => (
                    <option key={escuela.id} value={escuela.id}>
                      {" "}
                      {escuela.nombre}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Form.Group>
            <Button className="customize-btn-1" onClick={handleVerCreditos}>
              Añadir créditos
            </Button>

            {verCreditos && (
              <Table responsive="sm" id="tabla-creditos">
                <thead className="thead-text-customize">
                  <tr>
                    <th>Denominación de los créditos</th>
                    <th>Créditos</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <Form.Control
                        name="tipoC1"
                        type="text"
                        onChange={handleChange}
                      />
                    </td>
                    <td>
                      <Form.Control
                        name="valorC1"
                        type="number"
                        onChange={handleChange}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <Form.Control
                        name="tipoC2"
                        type="text"
                        onChange={handleChange}
                      />
                    </td>
                    <td>
                      <Form.Control
                        name="valorC2"
                        type="number"
                        onChange={handleChange}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <Form.Control
                        name="tipoC3"
                        type="text"
                        onChange={handleChange}
                      />
                    </td>
                    <td>
                      <Form.Control
                        name="valorC3"
                        type="number"
                        onChange={handleChange}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <Form.Control
                        name="tipoC4"
                        type="text"
                        onChange={handleChange}
                      />
                    </td>
                    <td></td>
                    <Form.Control
                      name="valorC4"
                      type="number"
                      onChange={handleChange}
                    />
                  </tr>
                  <tr>
                    <td>
                      <Form.Control
                        name="tipoC5"
                        type="text"
                        onChange={handleChange}
                      />
                    </td>
                    <td>
                      <Form.Control
                        name="valorC5"
                        type="number"
                        onChange={handleChange}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <Form.Control
                        name="tipoC6"
                        type="text"
                        onChange={handleChange}
                      />
                    </td>
                    <td>
                      <Form.Control
                        name="valorC6"
                        type="number"
                        onChange={handleChange}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <Form.Control
                        name="tipoC7"
                        type="text"
                        onChange={handleChange}
                      />
                    </td>
                    <td>
                      <Form.Control
                        name="valorC7"
                        type="number"
                        onChange={handleChange}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <Form.Control
                        name="tipoC8"
                        type="text"
                        onChange={handleChange}
                      />
                    </td>
                    <td>
                      <Form.Control
                        name="valorC8"
                        type="number"
                        onChange={handleChange}
                      />
                    </td>
                  </tr>
                </tbody>
              </Table>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button className="customize-btn-1" onClick={handleGuardarPE}>
            Guardar <i className="fi fi-bs-disk"></i>
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        aria-labelledby="modal-modificarEP"
        centered
        show={modalModificarPE}
        size="lg"
      >
        <Modal.Header closeButton onHide={handleOcultarModalModificarPE}>
          <Modal.Title className="title-modal1">
            Modificar datos del plan de estudios
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="4" className="fw-bold customize-flabel">
                Nombre
              </Form.Label>
              <Col sm="3">
                <Form.Control type="text" name="nombre" autoFocus />
              </Col>

              <Form.Label column sm="2" className="fw-bold customize-flabel">
                Año
              </Form.Label>
              <Col sm="3">
                <Form.Control type="text" name="anio" />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
              <Form.Label column sm="4" className="fw-bold customize-flabel">
                Escuela profesional
              </Form.Label>
              <Col sm="8">
                <Form.Control type="text" />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="4" className="fw-bold customize-flabel">
                Créditos obligatorios
              </Form.Label>
              <Col sm="2">
                <Form.Control type="text" name="anio" />
              </Col>

              <Form.Label column sm="4" className="fw-bold customize-flabel">
                Créditos co-curriculares
              </Form.Label>
              <Col sm="2">
                <Form.Control type="text" name="anio" />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="4" className="fw-bold customize-flabel">
                Créditos electivos
              </Form.Label>
              <Col sm="2">
                <Form.Control type="text" name="anio" />
              </Col>

              <Form.Label column sm="4" className="fw-bold customize-flabel">
                Créditos de especialidad
              </Form.Label>
              <Col sm="2">
                <Form.Control type="text" name="anio" />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="4" className="fw-bold customize-flabel">
                Créditos de idiomas
              </Form.Label>
              <Col sm="2">
                <Form.Control type="text" name="anio" />
              </Col>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="customize-btn-1"
            type="submit"
            onClick={handleOcultarModalModificarPE}
          >
            Guardar <i className="fi fi-bs-disk"></i>
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        aria-labelledby="modal-eliminarEP"
        centered
        show={modalEliminarPE}
        size="sm"
      >
        <Modal.Header closeButton onHide={handleOcultarModalEliminarPE}>
          <Modal.Title className="title-modal1">Eliminar</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>¿Está seguro que desea eliminar este plan de estudios de la BD?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="customize-btn-1"
            type="submit"
            onClick={handleOcultarModalEliminarPE}
          >
            Si
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PlanEstudios;
