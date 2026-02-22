const Footer = () => {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="h-8 flex items-center justify-center">
			<p className="text-sm">© {currentYear} - zGym - Tous droits réservés</p>
		</footer>
	)
}
export default Footer