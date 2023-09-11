import React from 'react'

const CreditosDictBachMinas = () => {
  return (
    <Table responsive="sm">
      <tbody>
        <tr>
          <td>Formación general</td>
          <td>
            <Form.Select aria-label="Estado de requisito">
              <option>Seleccione</option>
              <option value="CONFORME">CONFORME</option>
              <option value="INCONFORME">INCONFORME</option>
            </Form.Select>
          </td>
        </tr>
        <tr>
          <td>Formación profesional general</td>
          <td>
            <Form.Select aria-label="Estado de requisito">
              <option>Seleccione</option>
              <option value="CONFORME">CONFORME</option>
              <option value="INCONFORME">INCONFORME</option>
            </Form.Select>
          </td>
        </tr>
        <tr>
          <td>Formación profesional especializada</td>
          <td>
            <Form.Select aria-label="Estado de requisito">
              <option>Seleccione</option>
              <option value="CONFORME">CONFORME</option>
              <option value="INCONFORME">INCONFORME</option>
            </Form.Select>
          </td>
        </tr>
        <tr>
          <td>Cursos electivos</td>
          <td>
            <Form.Select aria-label="Estado de requisito">
              <option>Seleccione</option>
              <option value="CONFORME">CONFORME</option>
              <option value="INCONFORME">INCONFORME</option>
            </Form.Select>
          </td>
        </tr>
        <tr>
          <td>Co-curricular</td>
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

export default CreditosDictBachMinas