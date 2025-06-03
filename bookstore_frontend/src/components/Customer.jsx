import { useEffect, useState } from 'react';
import axios from 'axios';
import {
Typography,
CircularProgress,
Alert,
Card,
CardContent,
Button,
Dialog,
DialogTitle,
DialogContent,
DialogActions,
TextField,
Box,
Snackbar,
List,
ListItem,
ListItemText
} from '@mui/material';

function Customer() {
const [books, setBooks] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');
const [openCartDialog, setOpenCartDialog] = useState(false);
const [cart, setCart] = useState([]);
const [snackbarOpen, setSnackbarOpen] = useState(false);
const [quantityDialogOpen, setQuantityDialogOpen] = useState(false);
const [selectedBook, setSelectedBook] = useState(null);
const [purchaseQuantity, setPurchaseQuantity] = useState(1);
const [quantityError, setQuantityError] = useState('');

useEffect(() => {
	axios.get('http://localhost:8000/GetBooks/')
	.then(response => {
		setBooks(response.data);
		setLoading(false);
	})
	.catch(error => {
		setError('Failed to load books.');
		setLoading(false);
	});
}, []);

const handleAddToCartClick = (book) => {
	setSelectedBook(book);
	setPurchaseQuantity(1);
	setQuantityError('');
	setQuantityDialogOpen(true);
};

const handleConfirmAddToCart = () => {
	if (purchaseQuantity < 1 || purchaseQuantity > selectedBook.Quantity) {
	setQuantityError(`Enter a quantity between 1 and ${selectedBook.Quantity}`);
	return;
	}
	setCart(prevCart => [...prevCart, { ...selectedBook, purchaseQuantity }]);
	setSnackbarOpen(true);
	setQuantityDialogOpen(false);
};

const calculateTotal = () => {
	return cart.reduce((total, item) => total + item.purchaseQuantity * item.Price, 0);
};

const handlePurchase = async () => {
	try {
	const updateRequests = cart.map(item =>
		axios.patch(`http://localhost:8000/UpdateBook/${item.ISBNNo}/`, {
		Quantity: item.Quantity - item.purchaseQuantity
		})
	);
	await Promise.all(updateRequests);
	setCart([]);
	setOpenCartDialog(false);
	setSnackbarOpen(true);
	const updatedBooks = await axios.get('http://localhost:8000/GetBooks/');
	setBooks(updatedBooks.data);
	} catch (error) {
	setError('Failed to update book quantities.');
	}
};

return (
	<Box sx={{ padding: 4, textAlign: 'left' }}>
	<Box position="relative" textAlign="center" mb={2}>
		<Typography variant="h4" gutterBottom>Customer Page</Typography>
		<Box position="absolute" top={0} right={0}>
		<Button variant="contained" color="primary" onClick={() => setOpenCartDialog(true)}>Cart</Button>
		</Box>
	</Box>

	{loading && <CircularProgress />}
	{error && <Alert severity="error">{error}</Alert>}

	{!loading && !error && (
		<Box display="flex" flexDirection="column" gap={2}>
		{books.map((book) => (
			<Card key={book.ISBNNo} sx={{ width: '100%' }}>
			<CardContent>
				<Box display="flex" justifyContent="space-between" alignItems="center">
				<Box textAlign="left">
					<Typography variant="h6">{book.Title}</Typography>
					<Typography variant="body2" color="text.primary">ISBN: {book.ISBNNo}</Typography>
					<Typography variant="body2" color="text.secondary">Price: ${book.Price}</Typography>
					<Typography variant="body2" color="text.secondary">Quantity left: {book.Quantity}</Typography>
				</Box>
				{book.Quantity > 0 ? (
					<Button variant="contained" color="primary" onClick={() => handleAddToCartClick(book)}>
					Add to Cart
					</Button>
				) : (
					<Button variant="contained" disabled>
					Out of Stock
					</Button>
				)}
				</Box>
			</CardContent>
			</Card>
		))}
		</Box>
	)}

	<Dialog open={quantityDialogOpen} onClose={() => setQuantityDialogOpen(false)}>
		<DialogTitle>Select Quantity</DialogTitle>
		<DialogContent>
		<TextField
			autoFocus
			margin="dense"
			label="Quantity"
			type="number"
			fullWidth
			value={purchaseQuantity}
			onChange={(e) => setPurchaseQuantity(parseInt(e.target.value))}
			error={Boolean(quantityError)}
			helperText={quantityError}
		/>
		</DialogContent>
		<DialogActions>
		<Button onClick={() => setQuantityDialogOpen(false)}>Cancel</Button>
		<Button onClick={handleConfirmAddToCart} color="primary">Add</Button>
		</DialogActions>
	</Dialog>

	<Dialog open={openCartDialog} onClose={() => setOpenCartDialog(false)}>
		<DialogTitle>Your Cart</DialogTitle>
		<DialogContent>
		{cart.length === 0 ? (
			<Typography>No items in cart.</Typography>
		) : (
			<>
			<List>
				{cart.map((book, index) => (
				<ListItem key={index} alignItems="flex-start">
					<ListItemText
					primary={book.Title}
					secondary={`ISBN: ${book.ISBNNo} | Price: $${book.Price} | Quantity: ${book.purchaseQuantity}`}
					/>
				</ListItem>
				))}
			</List>
			<Typography variant="h6" mt={2}>
				Total: ${calculateTotal().toFixed(2)}
			</Typography>
			</>
		)}
		</DialogContent>
		<DialogActions>
		<Button onClick={() => setOpenCartDialog(false)}>Close</Button>
		{cart.length > 0 && (
			<Button onClick={handlePurchase} color="primary" variant="contained">Purchase</Button>
		)}
		</DialogActions>
	</Dialog>

	<Snackbar
		open={snackbarOpen}
		autoHideDuration={3000}
		onClose={() => setSnackbarOpen(false)}
		message="Book added to cart or purchase successful"
	/>
	</Box>
);
}

export default Customer;
