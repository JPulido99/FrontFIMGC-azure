import axios from 'axios';

function registrarDatos() {
<<<<<<< HEAD
    axios.post('https://fimgc-back.rj.r.appspot.com/api/escuela/listEscuelas/registrar', {
=======
    axios.post('http://localhost:8081/api/escuela/registrar', {
>>>>>>> 897c32758b4047b74e155829361d27a771460fa3
      nombre: 'fisma',
      director: 'Eloy vila',
      descripcion: 'escuela fisma'
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  export default registrarDatos