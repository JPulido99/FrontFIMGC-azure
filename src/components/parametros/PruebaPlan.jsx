import React, { useState, useEffect } from "react";
import axios from "axios";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";

const PruebaPlan = () => {
  const [planIdModificar, setPlanIdModificar] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const handleModificar = (id) => {
    setPlanIdModificar(id);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setPlanIdModificar("");
    setShowModal(false);
  };

  const [formularioModificar, setFormularioModificar] = useState({
    nombrePlan: "",
    anioPlan: "",
    c_cocurriculares: "",
    idEscuela: "",
  });

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

  useEffect(() => {
    if (planIdModificar !== "") {
      axios
        .get(`https://fimgc-back.rj.r.appspot.com/api/plan/${planIdModificar}`)
        .then((response) => {
          const plan = response.data;
          setFormularioModificar({
            nombrePlan: plan.nombrePlan,
            anioPlan: plan.anioPlan,
            c_cocurriculares: plan.c_cocurriculares,
            idEscuela: plan.escuela.id,
          });
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [planIdModificar]);

  const handleModificarChange = (event) => {
    const { name, value } = event.target;
    setFormularioModificar((prevFormularioModificar) => ({
      ...prevFormularioModificar,
      [name]: value,
    }));
  };

  const handleModificarSubmit = (event) => {
    event.preventDefault();

    const postData = {
      nombrePlan: formularioModificar.nombrePlan,
      anioPlan: formularioModificar.anioPlan,
      c_cocurriculares: formularioModificar.c_cocurriculares,
      escuela: {
        id: formularioModificar.idEscuela,
      },
    };

    axios
      .put(`https://fimgc-back.rj.r.appspot.com/api/plan/${planIdModificar}`, postData)
      .then((response) => {
        console.log(response.data);
        handleModalClose();
        setFormularioModificar({
          nombrePlan: "",
          anioPlan: "",
          creditos: "",
          idEscuela: "",
        });
        actualizarTabla();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const [formulario, setFormulario] = useState({
    nombrePlan: "",
    anioPlan: "",
    credito:"",
    idEscuela: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormulario((prevFormulario) => ({
      ...prevFormulario,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const postData = {
      nombrePlan: formulario.nombrePlan,
      anioPlan: formulario.anioPlan,
      c_cocurriculares: formulario.c_cocurriculares,
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
  };

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
      });
  };

  const [datos, setDatos] = useState([]);
  const [escuelas, setEscuelas] = useState([]);

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
      .get("https://fimgc-back.rj.r.appspot.com/api/escuela/list")
      .then((response) => {
        setEscuelas(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div>
      <h1>Datos del servidor</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Nombre del Plan de Estudios:
          <input
            type="text"
            name="nombrePlan"
            value={formulario.nombrePlan}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Año del Plan de Estudios:
          <input
            type="text"
            name="anioPlan"
            value={formulario.anioPlan}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          C Cocurriculares:
          <input
            type="text"
            name="c_cocurriculares"
            value={formulario.c_cocurriculares}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          ID de Escuela:
          <select
            name="idEscuela"
            value={formulario.idEscuela}
            onChange={handleChange}
          >
            <option value="">Seleccionar Escuela</option>
            {escuelas.map((escuela) => (
              <option key={escuela.id} value={escuela.id}>
                {escuela.nombre}
              </option>
            ))}
          </select>
        </label>
        <br />
        <button type="submit">Agregar</button>
      </form>

      <br />
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre del Plan de Estudios</th>
            <th>Año del Plan de Estudios</th>
            <th>C Cocurriculares</th>
            <th>ID de Escuela</th>
            <th>Nombre de Escuela</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {datos.map((item) => {
            const escuela = escuelas.find((escuela) => escuela.id === item.escuela.id);
            const nombreEscuela = escuela ? escuela.nombre : "";
            return (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.nombrePlan}</td>
                <td>{item.anioPlan}</td>
                <td>{item.c_cocurriculares}</td>
                <td>{item.escuela?.id}</td>
                <td>{nombreEscuela}</td>
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
      </table>
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modificar Plan de Estudios</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleModificarSubmit}>
            <Form.Group>
              <Form.Label>Nombre del Plan de Estudios</Form.Label>
              <Form.Control
                type="text"
                name="nombrePlan"
                value={formularioModificar.nombrePlan}
                onChange={handleModificarChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Año del Plan de Estudios</Form.Label>
              <Form.Control
                type="text"
                name="anioPlan"
                value={formularioModificar.anioPlan}
                onChange={handleModificarChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>C Cocurriculares</Form.Label>
              <Form.Control
                type="text"
                name="c_cocurriculares"
                value={formularioModificar.c_cocurriculares}
                onChange={handleModificarChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>ID de Escuela</Form.Label>
              <Form.Control
                as="select"
                name="idEscuela"
                value={formularioModificar.idEscuela}
                onChange={handleModificarChange}
              >
                <option value="">Seleccionar Escuela</option>
                {escuelas.map((escuela) => (
                  <option key={escuela.id} value={escuela.id}>
                    {escuela.nombre}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Button variant="primary" type="submit">
              Modificar
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default PruebaPlan;
