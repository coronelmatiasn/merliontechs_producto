import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

import { getEntities } from '../../entities/sales/sales.reducer';
import { State } from 'app/shared/model/enumerations/state.model';

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});

export const SalesShippingControl = (props) => {
    useEffect(() => {
        props.getEntities();
    }, []);

    const { salesList, salesState } = props;

    const classes = useStyles();

    const filteredList = salesList.filter(sale => sale.state === salesState);

    return (
        <TableContainer component={Paper}>
            <Table className={classes.table}>
                <TableHead>
                <TableRow>
                    <TableCell>Nro</TableCell>
                    <TableCell align="left">Producto</TableCell>
                    <TableCell align="left">Estado</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {filteredList.map((sale) => (
                    <TableRow key={sale.id}>
                        <TableCell component="th" scope="row">
                            {sale.id}
                        </TableCell>
                        <TableCell align="left">{sale.product.name}</TableCell>
                        <TableCell align="left">{sale.state}</TableCell>
                        <TableCell align="left">
                            <Button variant="contained" color="primary">
                                Enviar
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

const mapStateToProps = ({ sales }) => ({
    salesList: sales.entities,
    loading: sales.loading
});

const mapDispatchToProps = {
    getEntities
}

export default connect(mapStateToProps, mapDispatchToProps)(SalesShippingControl);