import { useEffect, useState } from 'react';
import axios from 'axios';
import {
	Typography,
	Container,
	CircularProgress,
	Alert,
	List,
	ListItem,
	ListItemText,
	Box,
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField
} from '@mui/material';

function Customer() {
	const [books, setBooks] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [dialogOpen, setDialogOpen] = useState(false);
	const [selectedBook, setSelectedBook] = useState(null);
	const [purchaseQuantity, setPurchaseQuantity] = useState('');
	const [quantityError, setQuantityError] = useState('');

	useEffect(() => {
		fetchBooks();
	}, []);

	const fetchBooks = () => {
		axios.get('http://localhost:8000/GetBooks/')
			.then(response => {
				setBooks(response.data);
				setLoading(false);
			})
			.catch(error => {
				setError('Failed to load books.');
				setLoading(false);
			});
	};

	const handlePurchaseClick = (book) => {
		setSelectedBook(book);
		setDialogOpen(true);
	};

	const handleDialogClose = () => {
		setDialogOpen(false);
		setSelectedBook(null);
		setPurchaseQuantity('');
		setQuantityError('');
	};

	const handleQuantityChange = (e) => {
		const value = e.target.value;
		setPurchaseQuantity(value);

		if (!selectedBook) return;
		const quantity = parseInt(value, 10);
		if (isNaN(quantity) || quantity <= 0) {
			setQuantityError('Enter a valid positive number');
		} else if (quantity > selectedBook.Quantity) {
			setQuantityError(`Only ${selectedBook.Quantity} left in stock`);
		} else {
			setQuantityError('');
		}
	};

	const handlePurchaseConfirm = () => {
		if (!quantityError && purchaseQuantity) {
			const newQuantity = selectedBook.Quantity - parseInt(purchaseQuantity, 10);
			axios.patch(`http://localhost:8000/UpdateBook/${selectedBook.ISBNNo}/`, {
				Quantity: newQuantity
			})
				.then(() => {
					fetchBooks();
					handleDialogClose();
				})
				.catch(() => {
					setError('Failed to update book quantity.');
					handleDialogClose();
				});
		}
	};

	return (
		<Container sx={{ padding: 4 }}>
			<Typography variant="h4" gutterBottom>Customer Page</Typography>

			{loading && <CircularProgress />}
			{error && <Alert severity="error">{error}</Alert>}

			{!loading && !error && (
				<List>
					{books.map((book) => (
						<ListItem
							key={book.ISBNNo}
							alignItems="flex-start"
							secondaryAction={
								<Button
									variant="contained"
									color="primary"
									onClick={() => handlePurchaseClick(book)}
									disabled={book.Quantity === 0}
								>
									{book.Quantity === 0 ? 'Out of Stock' : 'Purchase'}
								</Button>
							}
						>
							<ListItemText
								primary={`${book.Title} for $${book.Price}`}
								secondary={
									<Box component="span">
										<Typography component="span" variant="body2" color="text.primary">
											ISBN: {book.ISBNNo}
										</Typography>
										<br />
										<Typography component="span" variant="body2" color="text.secondary">
											Quantity left: {book.Quantity}
										</Typography>
									</Box>
								}
							/>
						</ListItem>
					))}
				</List>
			)}

			<Dialog open={dialogOpen} onClose={handleDialogClose}>
				<DialogTitle>Purchase Quantity</DialogTitle>
				<DialogContent>
					<TextField
						autoFocus
						margin="dense"
						label="Quantity"
						type="number"
						fullWidth
						variant="standard"
						value={purchaseQuantity}
						onChange={handleQuantityChange}
						error={!!quantityError}
						helperText={quantityError}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleDialogClose}>Cancel</Button>
					<Button onClick={handlePurchaseConfirm} disabled={!!quantityError || !purchaseQuantity}>
						Purchase
					</Button>
				</DialogActions>
			</Dialog>
		</Container>
	);
}

export default Customer;
