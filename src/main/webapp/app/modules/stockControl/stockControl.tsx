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

import { getEntities, updateEntity } from '../../entities/product-bucket/product-bucket.reducer';

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});

export const StockControl = (props) => {
    useEffect(() => {
        props.getEntities();
    }, []);

    const { productBucketList } = props;

    const classes = useStyles();

    return (
        <TableContainer component={Paper}>
            <Table className={classes.table}>
                <TableHead>
                <TableRow>
                    <TableCell>Nro</TableCell>
                    <TableCell align="left">Producto</TableCell>
                    <TableCell align="left">Disponibles</TableCell>
                    <TableCell align="left">Encargados</TableCell>
                    <TableCell align="left">Rotos</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {productBucketList.map((productBucket, index) => (
                    <TableRow key={productBucket.product.id}>
                        <TableCell component="th" scope="row">
                            {productBucket.product.id}
                        </TableCell>
                        <TableCell align="left">{productBucket.product.name}</TableCell>
                        <TableCell align="left">{productBucket.availableToSellQuantity}</TableCell>
                        <TableCell align="left">{productBucket.inChargeQuantity}</TableCell>
                        <TableCell align="left">{productBucket.brokenQuantity}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

const mapStateToProps = ({ productBucket }) => ({
    productBucketList: productBucket.entities,
    loading: productBucket.loading
});

const mapDispatchToProps = {
    getEntities,
    updateEntity
}

export default connect(mapStateToProps, mapDispatchToProps)(StockControl);