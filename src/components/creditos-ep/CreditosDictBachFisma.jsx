import React from 'react';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';

const CreditosDictBachFisma = () => {
  return (
    <Table responsive="sm">
      <tbody>
        <tr>
          <td>Asignaturas obligatorias de formación general</td>
          <td>
            <Form.Select aria-label="Estado de requisito">
              <option>Seleccione</option>
              <option value="CONFORME">CONFORME</option>
              <option value="INCONFORME">INCONFORME</option>
            </Form.Select>
          </td>
        </tr>
        <tr>
          <td>Asignaturas obligatorias de formación profesional general</td>
          <td>
            <Form.Select aria-label="Estado de requisito">
              <option>Seleccione</option>
              <option value="CONFORME">CONFORME</option>
              <option value="INCONFORME">INCONFORME</option>
            </Form.Select>
          </td>
        </tr>
        <tr>
          <td>Asignaturas obligatorias de formación profesional específica</td>
          <td>
            <Form.Select aria-label="Estado de requisito">
              <option>Seleccione</option>
              <option value="CONFORME">CONFORME</option>
              <option value="INCONFORME">INCONFORME</option>
            </Form.Select>
          </td>
        </tr>
        <tr>
          <td>Asignaturas obligatorias del Área de Investigación</td>
          <td>
            <Form.Select aria-label="Estado de requisito">
              <option>Seleccione</option>
              <option value="CONFORME">CONFORME</option>
              <option value="INCONFORME">INCONFORME</option>
            </Form.Select>
          </td>
        </tr>
        <tr>
          <td>Asignaturas de actividades co-curriculares</td>
          <td>
            <Form.Select aria-label="Estado de requisito">
              <option>Seleccione</option>
              <option value="CONFORME">CONFORME</option>
              <option value="INCONFORME">INCONFORME</option>
            </Form.Select>
          </td>
        </tr>
        <tr>
          <td>Asignaturas electivas</td>
          <td>
            <Form.Select aria-label="Estado de requisito">
              <option>Seleccione</option>
              <option value="CONFORME">CONFORME</option>
              <option value="INCONFORME">INCONFORME</option>
            </Form.Select>
          </td>
        </tr>
      </tbody>
    </Table>
  )
}

export default CreditosDictBachFisma