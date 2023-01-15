import React from 'react';
import './Cell.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
function Cell(props) {
    return (
        <td className={'center cell' + (props.value === null ? '' : (props.value === 'X' ? ' bi bi-x' : ' bi bi-circle'))} onClick={props.onClick}>
        </td>
    );
}

export default Cell;  