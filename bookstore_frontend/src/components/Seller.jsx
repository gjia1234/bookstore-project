import React from 'react'
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
	Stack,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Card,
	TextField
} from '@mui/material';


const Seller = () => {
	const [Books, SetBooks] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [EditDialogOpen, SetEditDialogOpen] = useState(false);
	const [DeleteDialogOpen, SetDeleteDialogOpen] = useState(false);
	const [CreateDialogOpen, SetCreateDialogOpen] = useState(false);
	const [SelectedBook, SetSelectedBook] = useState({
		ISBNNo: '',
		Title: '',
		Quantity: '',
		Price: ''
	});
	const [ISBNError, SetISBNError] = useState(false);
	const [newBook, setNewBook] = useState({
		ISBNNo: '',
		Title: '',
		Quantity: '',
		Price: ''
	});

	useEffect(() => {
		fetchBooks();
	}, []);

	const fetchBooks = () => {
		axios.get('http://localhost:8000/GetBooks/')
			.then(response => {
				SetBooks(response.data);
				setLoading(false);
			})
			.catch(error => {
				setError('Failed to load books.');
				setLoading(false);
			});
	};

	const handleEditClick = (book) => {
		SetSelectedBook(book);
		SetEditDialogOpen(true);
	};
	const handleEditDialogClose = () => {
		SetSelectedBook({ ISBNNo: '', Title: '', author: '', Quantity: '' });
		SetEditDialogOpen(false);

	};
	const handleCreateBook = () => {
		if (!/^\d{13}$/.test(newBook.ISBNNo)) {
			SetISBNError(true);
			return;
		} else {
			SetISBNError(false);
		}
		axios.post('http://localhost:8000/AddBook/', newBook)
			.then(response => {
				SetBooks(prevBooks => [...prevBooks, response.data]);
				SetCreateDialogOpen(false);
				setNewBook({ ISBNNo: '', Title: '', author: '', Quantity: '' });
			})
			.catch(() => {
				alert('Failed to create book.');
			});
	};
	const handleEditBookConfirm = () => {
		axios.patch(`http://localhost:8000/UpdateBook/${SelectedBook.ISBNNo}/`, SelectedBook)
			.then(() => {
				fetchBooks();
				handleEditDialogClose();

			})
			.catch(() => {
				setError('Failed to update book quantity.');
				handleEditDialogClose();
			});

	};
	const handleDeleteClick = (book) => {
		SetSelectedBook(book);
		SetDeleteDialogOpen(true);
	};

	const handleDeleteDialogClose = () => {
		SetSelectedBook({ ISBNNo: '', Title: '', author: '', Quantity: '' });
		SetDeleteDialogOpen(false);

	};

	const handleDeleteBookConfirm = () => {
		axios.delete(`http://localhost:8000/DeleteBook/${SelectedBook.ISBNNo}/`)
			.then(() => {
				fetchBooks();
				handleDeleteDialogClose();

			})
			.catch(() => {
				setError('Failed to update book quantity.');
				handleDeleteDialogClose();
			});
	}


	return (
		<Container sx={{ padding: 4 }}>
			<Box position="relative" textAlign="center" mb={2}>
				<Typography variant="h4" gutterBottom>Seller Page</Typography>
				<Box position="absolute" top={0} right={0}>
					<Button variant="contained" color="primary" onClick={() => SetCreateDialogOpen(true)}>Create Book</Button>
				</Box>
			</Box>
			{loading && <CircularProgress />}
			{error && <Alert severity="error">{error}</Alert>}

			{!loading && !error && (
				<List>
					<Card>
					{Books.map((book) => (
						<ListItem
							key={book.ISBNNo}
							alignItems="flex-start"
							secondaryAction={
								<Stack direction="row" spacing={1}>
									<Button
										variant="contained"
										color="primary"
										onClick={() => handleEditClick(book)}
									>
										Edit
									</Button>
									<Button
										variant='contained'
										color='secondary'
										onClick={() => handleDeleteClick(book)}
									>
										Delete
									</Button>
								</Stack>
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
					</Card>
				</List>
			)}
			<Dialog open={EditDialogOpen} onClose={handleEditDialogClose}>
				<DialogTitle>Edit Book</DialogTitle>
				<DialogContent>
					<Stack spacing={2} mt={1}>
						<TextField
							label="ISBN No"
							value={SelectedBook.ISBNNo}
							fullWidth
							disabled
						/>
						<TextField label="Title" value={SelectedBook.Title} onChange={e => SetSelectedBook({ ...SelectedBook, Title: e.target.value })} fullWidth />
						<TextField label="Quantity" type="number" value={SelectedBook.Quantity} onChange={e => SetSelectedBook({ ...SelectedBook, Quantity: e.target.value })} fullWidth />
						<TextField label="Price" type="number" value={SelectedBook.Price} onChange={e => SetSelectedBook({ ...SelectedBook, Price: e.target.value })} fullWidth />
					</Stack>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleEditDialogClose}>Cancel</Button>
					<Button onClick={handleEditBookConfirm} >
						Edit
					</Button>
				</DialogActions>
			</Dialog>
			<Dialog open={CreateDialogOpen} onClose={() => SetCreateDialogOpen(false)}>
				<DialogTitle>Create New Book</DialogTitle>
				<DialogContent>
					<Stack spacing={2} mt={1}>
						<TextField
							label="ISBN No"
							value={newBook.ISBNNo}
							onChange={e => setNewBook({ ...newBook, ISBNNo: e.target.value })}
							fullWidth
							error={ISBNError}
							helperText={ISBNError ? "ISBN No must be exactly 13 digits" : ''}
						/>
						<TextField label="Title" value={newBook.Title} onChange={e => setNewBook({ ...newBook, Title: e.target.value })} fullWidth />
						<TextField label="Quantity" type="number" value={newBook.Quantity} onChange={e => setNewBook({ ...newBook, Quantity: e.target.value })} fullWidth />
						<TextField label="Price" type="number" value={newBook.Price} onChange={e => setNewBook({ ...newBook, Price: e.target.value })} fullWidth />
					</Stack>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => SetCreateDialogOpen(false)}>Cancel</Button>
					<Button variant="contained" onClick={handleCreateBook}>Create</Button>
				</DialogActions>
			</Dialog>
			<Dialog open={DeleteDialogOpen} onClose={handleDeleteDialogClose}>
				<DialogTitle>Are you sure u want to delete {SelectedBook.Title}?</DialogTitle>
				<DialogActions>
					<Button onClick={handleDeleteDialogClose}>Cancel</Button>
					<Button 
					onClick={handleDeleteBookConfirm} 
					variant="contained"
					color='secondary' >
						Delete
					</Button>
				</DialogActions>
			</Dialog>
		</Container>

	)
}

export default Seller
