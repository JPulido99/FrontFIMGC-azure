import axios from 'axios';

function eliminarDatos() {
    axios.delete('https://fimgc-back.rj.r.appspot.com/api/escuela/listEscuelas/eliminar/4')
    .then(function (response) {
      console.log('*******',response);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

export default eliminarDatos