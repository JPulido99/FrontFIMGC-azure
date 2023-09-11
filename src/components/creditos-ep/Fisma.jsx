import React from 'react';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';

const Fisma = () => {
    return (
        <Table responsive="sm">
            <tbody>
                <tr>
                    <td>Asignaturas obligatorias de formación general:</td>
                    <td>
                        <Form.Control type="number" />
                    </td>
                    <td>créditos</td>
                </tr>
                <tr>
                    <td>Asignaturas obligatorias de formación profesional general:</td>
                    <td>
                        <Form.Control type="number" />
                    </td>
                    <td>créditos</td>
                </tr>
                <tr>
                    <td>Asignaturas obligatorias de formación profesional específica:</td>
                    <td>
                        <Form.Control type="number" />
                    </td>
                    <td>créditos</td>
                </tr>
                <tr>
                    <td>Asignaturas obligatorias del Área de Investigación:</td>
                    <td>
                        <Form.Control type="number" />
                    </td>
                    <td>créditos</td>
                </tr>
                <tr>
                    <td>Asignaturas de actividades co-curriculares:</td>
                    <td>
                        <Form.Control type="number" />
                    </td>
                    <td>créditos</td>
                </tr>
                <tr>
                    <td>Asignaturas electivas:</td>
                    <td>
                        <Form.Control type="number" />
                    </td>
                    <td>créditos</td>
                </tr>
            </tbody>
        </Table>
    )
}

export default Fisma