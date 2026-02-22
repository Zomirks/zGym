import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="relative flex min-h-screen flex-col">
			<Header />
			<main className="flex-1 flex flex-col px-4">
				<div className="flex-1 flex flex-col mx-auto w-full">
					{children}
				</div>
			</main>
			<Footer />
		</div>
	)
}
export default Layout
