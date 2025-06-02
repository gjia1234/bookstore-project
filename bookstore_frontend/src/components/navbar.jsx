import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';

function Navbar() {
	return (
		<AppBar position="fixed">
			<Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
				<Typography variant="h6" component="div">
					BookStore
				</Typography>
				<Box>
					<Button color="inherit" component={Link} to="/customer">
						Customer
					</Button>
					<Button color="inherit" component={Link} to="/seller">
						Seller
					</Button>

				</Box>
			</Toolbar>
		</AppBar>
	);
}

export default Navbar
