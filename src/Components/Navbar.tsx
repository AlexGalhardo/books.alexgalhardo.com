import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
    const navigate = useNavigate();
    const [search, setSearch] = useState<string | undefined>();

    function handleSearch(event: any) {
        event.preventDefault();

        navigate(`/?search=${search}`);
    }

    return (
        <>
            <div className="fixed-top bg-light mb-5 bg-dark">
                <nav className="container col-lg-10 navbar navbar-expand-lg fixed navbar-dark bg-dark p-3">
                    <div className="container-fluid">
                        <a className="navbar-brand appTitle d-flew w-25" href="/">
                            <span className="fs-4 fw-bold navbarTitle text-info">Books</span>
                        </a>

                        <form className="d-flex w-50" onSubmit={handleSearch}>
                            <div className="input-group">
                                <input
                                    type="text"
                                    name="search"
                                    className="fs-6 form-control"
                                    placeholder="Search Book Title..."
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </form>
                    </div>
                </nav>
            </div>
        </>
    );
}
