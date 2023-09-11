import React from 'react';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';

const Civil = () => {
    return (
        <Table responsive="sm">
            <tbody>
                <tr>
                    <td>Estudios generales:</td>
                    <td>
                        <Form.Control type="number" />
                    </td>
                    <td>créditos</td>
                </tr>
                <tr>
                    <td>Estudios específicos y de especialidad:</td>
                    <td>
                        <Form.Control type="number" />
                    </td>
                    <td>créditos</td>
                </tr>
                <tr>
                    <td>Prácticas pre-profesionales:</td>
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
                    <td>Actividades co-curriculares:</td>
                    <td>
                        <Form.Control type="number" />
                    </td>
                    <td>créditos</td>
                </tr>
                <tr>
                    <td>Idiomas:</td>
                    <td>
                        <Form.Control type="number" />
                    </td>
                    <td>créditos</td>
                </tr>
            </tbody>
        </Table>
    )
}

export default Civil