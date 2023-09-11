import React from 'react';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';

const Minas = () => {
    return (
        <Table responsive="sm">
            <tbody>
                <tr>
                    <td>Formación general:</td>
                    <td>
                        <Form.Control type="number" />
                    </td>
                    <td>créditos</td>
                </tr>
                <tr>
                    <td>Formación profesional general:</td>
                    <td>
                        <Form.Control type="number" />
                    </td>
                    <td>créditos</td>
                </tr>
                <tr>
                    <td>Formación profesional especializada:</td>
                    <td>
                        <Form.Control type="number" />
                    </td>
                    <td>créditos</td>
                </tr>
                <tr>
                    <td>Cursos electivos:</td>
                    <td>
                        <Form.Control type="number" />
                    </td>
                    <td>créditos</td>
                </tr>
                <tr>
                    <td>Co-curricular:</td>
                    <td>
                        <Form.Control type="number" />
                    </td>
                    <td>créditos</td>
                </tr>
            </tbody>
        </Table>
    )
}

export default Minas