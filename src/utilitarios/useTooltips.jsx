import { Tooltip } from 'react-bootstrap';

const useTooltips = () => {
    const tooltipsMensajes = {
        nombresApellidos: "Escribir tal como se muestra en su DNI.",
        correo: "Ejemplo: eliu.vargas.27@unsch.edu.pe",
        contrasena: "Ingrese la contraseña con la que se registró en esta plataforma.",
        concursoAdmision: "Ejemplo: 2017-II",
        resolucionIngreso: "Ejemplo: Resolución de Consejo Universitario Nº0215-2015-UNSCH-CU",
        certificadoEstudios: "Ejemplo: 0074861",
        expediente: "Ejemplo: 2312286",
        memoEscuela: "Ejemplo: ...",
        dictEscuela: "Ejemplo: ...",
        dictamen: "Ejemplo: ...",
        boleta: "Ejemplo: 007-00001124",
        tituloPlan: "Ingrese el título de su trabajo de investigación.",
        tituloDictamen: "Ejemplo: ...",
        planEstudios: "Ejemplo: 2005-R",
        similitud: "Si su índice de similitud es 12%, coloque: 12",
        celular: "Ingrese un número de celular válido."
    };

    const renderTooltip = (props, field) => (
        <Tooltip {...props}>{tooltipsMensajes[field]}</Tooltip>
    );


    return { renderTooltip };
}

export default useTooltips