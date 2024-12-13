import React, { useEffect, useState } from 'react'; 
import axios from 'axios'; 
import './App.css'; // Import custom CSS for styling

// Main component of the application
const MyNewApp = () => {
  // States to manage various aspects of the application
  const [characters, setCharacters] = useState([]); // Stores all fetched characters
  const [filteredCharacters, setFilteredCharacters] = useState([]); // Stores characters after filtering
  const [filters, setFilters] = useState({ name: '', species: '', status: '' }); // Stores the current filter values
  const [sortOrder, setSortOrder] = useState('asc'); // Tracks sorting order (ascending/descending)
  const [selectedCharacter, setSelectedCharacter] = useState(null); // Stores the currently selected character
  const [currentPage, setCurrentPage] = useState(1); // Tracks the current page for pagination
  const [error, setError] = useState(null); // Handles errors during API fetching

  // Function to fetch characters from the Rick and Morty API
  const fetchCharacters = async () => {
    try {
      let allCharacters = []; // Array to collect all character data
      let nextPage = 'https://rickandmortyapi.com/api/character'; // Starting endpoint URL

      // Fetch data from API until all pages are retrieved
      while (nextPage) {
        const response = await axios.get(nextPage); // Fetch data from the current page
        allCharacters = [...allCharacters, ...response.data.results]; // Append the results
        nextPage = response.data.info.next; // Update to the next page URL
      }

      // Store the fetched characters in state
      setCharacters(allCharacters);
      setFilteredCharacters(allCharacters); // Initially, all characters are displayed
    } catch {
      setError('Failed to fetch characters. Please try again later.'); // Handle any errors
    }
  };

  // Fetch characters when the component loads
  useEffect(() => {
    fetchCharacters();
  }, []);

  // Update filter values when input fields change
  const handleFilterChange = (e) => {
    const { name, value } = e.target; // Extract the filter name and value
    setFilters({ ...filters, [name]: value }); // Update the corresponding filter
  };

  // Apply filters to the character list
  const applyFilters = () => {
    let updatedCharacters = [...characters]; // Create a copy of the character list
    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        updatedCharacters = updatedCharacters.filter((char) =>
          char[key].toLowerCase().includes(filters[key].toLowerCase()) // Filter based on matching values
        );
      }
    });
    setFilteredCharacters(updatedCharacters); // Update the displayed characters
    setCurrentPage(1); // Reset to the first page after filtering
  };

  // Reset all filters and display the original list
  const resetFilters = () => {
    setFilters({ name: '', species: '', status: '' }); // Clear filter values
    setFilteredCharacters(characters); // Reset to all characters
    setCurrentPage(1); // Reset pagination
  };

  // Sort characters alphabetically by name
  const handleSort = () => {
    const sorted = [...filteredCharacters].sort((a, b) =>
      sortOrder === 'asc'
        ? a.name.localeCompare(b.name) // Ascending order
        : b.name.localeCompare(a.name) // Descending order
    );
    setFilteredCharacters(sorted); // Update the sorted list
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); // Toggle the sorting order
  };

  // Handle pagination by updating the current page
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Calculate the start and end indices for the current page
  const startIndex = (currentPage - 1) * 10;
  const paginatedCharacters = filteredCharacters.slice(
    startIndex,
    startIndex + 10 // Select only the characters for the current page
  );

  return (
    <div className="container my-4">
      <h1 className="text-center mb-4">Rick and Morty Character Table</h1>
      {error && <p className="alert alert-danger">{error}</p>} {/* Display errors */}

      {/* Filter Section */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          {/* Filter by name */}
          <input
            type="text"
            name="name"
            className="form-control"
            placeholder="Filter by name"
            value={filters.name}
            onChange={handleFilterChange}
          />
        </div>
        <div className="col-md-3">
          {/* Filter by species */}
          <input
            type="text"
            name="species"
            className="form-control"
            placeholder="Filter by species"
            value={filters.species}
            onChange={handleFilterChange}
          />
        </div>
        <div className="col-md-3">
          {/* Filter by status */}
          <input
            type="text"
            name="status"
            className="form-control"
            placeholder="Filter by status"
            value={filters.status}
            onChange={handleFilterChange}
          />
        </div>
        <div className="col-md-3 d-flex gap-2">
          {/* Buttons to apply or reset filters */}
          <button className="btn btn-primary w-50" onClick={applyFilters}>
            Apply Filters
          </button>
          <button className="btn btn-secondary w-50" onClick={resetFilters}>
            Reset Filters
          </button>
        </div>
      </div>

      {/* Character Table */}
      {filteredCharacters.length > 0 ? (
        <table className="table table-hover">
          <thead>
            <tr>
              <th onClick={handleSort} style={{ cursor: 'pointer' }}>
                Name {sortOrder === 'asc' ? '▲' : '▼'}
              </th>
              <th>Species</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {/* Display paginated characters */}
            {paginatedCharacters.map((character) => (
              <tr
                key={character.id}
                onClick={() => setSelectedCharacter(character)} // Select a character on row click
                style={{ cursor: 'pointer' }}
              >
                <td>{character.name}</td>
                <td>{character.species}</td>
                <td>{character.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center">No characters found matching the filters.</p>
      )}

      {/* Pagination */}
      <div className="d-flex justify-content-center my-3">
        <label>
          Page:{' '}
          <select
            className="form-select w-auto d-inline"
            value={currentPage}
            onChange={(e) => handlePageChange(Number(e.target.value))}
          >
            {Array.from(
              { length: Math.ceil(filteredCharacters.length / 10) },
              (_, index) => (
                <option key={index} value={index + 1}>
                  {index + 1}
                </option>
              )
            )}
          </select>
        </label>
      </div>

      {/* Selected Character Details */}
      {selectedCharacter && (
        <div className="card mx-auto mt-4" style={{ maxWidth: '500px' }}>
          <div className="card-body">
            <h5 className="card-title">Character Details</h5>
            <p className="card-text">Name: {selectedCharacter.name}</p>
            <p className="card-text">Species: {selectedCharacter.species}</p>
            <p className="card-text">Status: {selectedCharacter.status}</p>
            <p className="card-text">Gender: {selectedCharacter.gender}</p>
            <p className="card-text">
              Location: {selectedCharacter.location.name}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyNewApp;
