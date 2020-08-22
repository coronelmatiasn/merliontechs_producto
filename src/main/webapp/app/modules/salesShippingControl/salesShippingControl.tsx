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

import { getEntities, updateEntity } from '../../entities/sales/sales.reducer';
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

    const { salesState } = props;
    let { salesList } = props;

    let filteredList = salesList.filter(sale => sale.state === salesState);

    const handleClick = async (index, e) => {
        e.preventDefault();
        
        const entity = filteredList[index];

        if (entity.state === State.IN_CHARGE) {
            entity.state = State.SHIPPED;
        } else if (entity.state === State.SHIPPED) {
            entity.state = State.DELIVERED
        }

        await props.updateEntity(entity);
        props.getEntities();

        salesList = props.salesList;

        filteredList = salesList.filter(sale => sale.state === salesState);
    }

    const classes = useStyles();

    return (
        <TableContainer component={Paper}>
            <Table className={classes.table}>
                <TableHead>
                <TableRow>
                    <TableCell>Nro</TableCell>
                    <TableCell align="left">Producto</TableCell>
                    <TableCell align="left">Estado</TableCell>
                    {salesState !== State.DELIVERED && 
                        <TableCell align="left">
                        </TableCell>
                    }
                </TableRow>
                </TableHead>
                <TableBody>
                {salesList
                    .filter(sale => sale.state === salesState)
                    .map((sale, index) => (
                    <TableRow key={sale.id}>
                        <TableCell component="th" scope="row">
                            {sale.id}
                        </TableCell>
                        <TableCell align="left">{sale.product.name}</TableCell>
                        <TableCell align="left">{sale.state}</TableCell>
                        {salesState !== State.DELIVERED && 
                            <TableCell align="left">
                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    onClick={(e) => handleClick(index, e)}
                                >
                                    Enviar
                                </Button>
                            </TableCell>
                        }
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
    getEntities,
    updateEntity
}

export default connect(mapStateToProps, mapDispatchToProps)(SalesShippingControl);