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
import Fab from '@material-ui/core/Fab';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import BrokenImageIcon from '@material-ui/icons/BrokenImage';
import MenuBookIcon from '@material-ui/icons/MenuBook';

import { getEntities, updateEntity } from '../../entities/product-bucket/product-bucket.reducer';

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
    button: {
        marginLeft: 5
    }
});

const buckets = {
    availableToSell: "availableToSellQuantity",
    inCharge: "inChargeQuantity",
    broken: "brokenQuantity"
}

export const StockControl = (props) => {
    const [open, setOpen] = React.useState(false);
    const [originBucket, setOriginBucket] = React.useState("");
    const [destinationBucket, setDestinationBucket] = React.useState("");
    const [destinationText, setDestinationText] = React.useState("");
    const [textFieldValue, setTextFieldValue] = React.useState(0);
    const [rowIndex, setRowIndex] = React.useState(0);

    useEffect(() => {
        props.getEntities();
    }, []);

    const { productBucketList } = props;

    const classes = useStyles();

    
    const handleClickOpen = (e, origin, destination, index) => {
        setOpen(true);

        setRowIndex(index);
        setOriginBucket(origin);
        setDestinationBucket(destination);

        if (destination === buckets.availableToSell) {
            setDestinationText("Disponibles");
        } else if(destination === buckets.inCharge) {
            setDestinationText("Encargados");
        } else {
            setDestinationText("Rotos");
        }
    };
    
    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (e) => {
        setTextFieldValue(e.target.value);
    }

    const handleSubmit = () => {
        const item = productBucketList[rowIndex];

        let quantity;

        if (textFieldValue >= item[originBucket]) {
            quantity = item[originBucket];
        } else {
            quantity = textFieldValue;
        }

        item[originBucket] = item[originBucket] - parseInt(quantity, 10);
        item[destinationBucket] = item[destinationBucket] + parseInt(quantity, 10);

        props.updateEntity(item);

        handleClose();
    }

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
                        <TableCell align="left">
                            {productBucket.availableToSellQuantity}
                            <Tooltip title="Mover a Encargados">
                                <Fab className={classes.button} color="primary" size="small" onClick={(e) => handleClickOpen(e, buckets.availableToSell, buckets.inCharge, index)}>
                                    <AssignmentTurnedInIcon />
                                </Fab>
                            </Tooltip>
                            <Tooltip title="Mover a Rotos">
                                <Fab className={classes.button} color="primary" size="small" onClick={(e) => handleClickOpen(e, buckets.availableToSell, buckets.broken, index)}>
                                    <BrokenImageIcon />
                                </Fab>
                            </Tooltip>
                        </TableCell>
                        <TableCell align="left">
                            {productBucket.inChargeQuantity}
                            <Tooltip title="Mover a Disponibles">
                                <Fab className={classes.button} color="primary" size="small" onClick={(e) => handleClickOpen(e, buckets.inCharge, buckets.availableToSell, index)}>
                                    <MenuBookIcon />
                                </Fab>
                            </Tooltip>
                            <Tooltip title="Mover a Rotos">
                                <Fab className={classes.button} color="primary" size="small" onClick={(e) => handleClickOpen(e, buckets.inCharge, buckets.broken, index)}>
                                    <BrokenImageIcon />
                                </Fab>
                            </Tooltip>
                        </TableCell>
                        <TableCell align="left">
                            {productBucket.brokenQuantity}
                            <Tooltip title="Mover a Disponibles">
                                <Fab className={classes.button} color="primary" size="small" onClick={(e) => handleClickOpen(e, buckets.broken, buckets.availableToSell, index)}>
                                    <MenuBookIcon />
                                </Fab>
                            </Tooltip>
                            <Tooltip title="Mover a encargados">
                                <Fab className={classes.button} color="primary" size="small" onClick={(e) => handleClickOpen(e, buckets.broken, buckets.inCharge, index)}>
                                    <AssignmentTurnedInIcon />
                                </Fab>
                            </Tooltip>
                        </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>

            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogContent>
                    <DialogContentText>
                        Ingrese la cantidad de items para mover a {destinationText}.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Cantidad"
                        type="number"
                        fullWidth
                        onChange={handleChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={handleSubmit} color="primary">
                        Mover
                    </Button>
                </DialogActions>
            </Dialog>
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