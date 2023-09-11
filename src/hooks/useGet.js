//Hook personalizado, puede ser una función/método tradicional, arrow function. 
import { useState } from 'react';
import axios from 'axios';

const useGet = (url) => {
    const [datos, setDatos] = useState([]);

    const getEscuelas = () => {
        axios.get(url)
            .then(response => setDatos(response.data))
            .catch(error => console.error(error));
    };

    //retorno un arreglo cuyo 1er elemento es donde se guarda la info, y la 2da es la posición para consumir la API.
    return [datos, getEscuelas] 
}

export default useGet