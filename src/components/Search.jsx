import React, { useState, useEffect } from 'react';
import { Hostname } from '../config';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';

function Search({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [cafes, setCafes] = useState([]);

  useEffect(() => {
    fetchCafes();
  }, []);

  const fetchCafes = async () => {
    try {
      const response = await fetch(`${Hostname}/api/post.php?action=getCafes`);
      const data = await response.json();
      if (data.status === 'success' && Array.isArray(data.data)) {
        setCafes(data.data);
      } else if (data.status === 'success' && typeof data.data === 'object') {
        setCafes(Object.values(data.data));
      } else {
        console.error('Invalid data format:', data);
        setCafes([]);
      }
    } catch (error) {
      console.error('Error fetching cafes:', error);
      setCafes([]);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    try {
      if (!Array.isArray(cafes)) {
        console.error('Cafes is not an array:', cafes);
        return;
      }
      const filteredCafes = cafes.filter(cafe =>
        cafe.cafeName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      onSearch(filteredCafes);
    } catch (error) {
      console.error('Error searching cafes:', error);
    }
  };

  return (
    <Form onSubmit={handleSearch} className="mb-3">
      <InputGroup>
        <Form.Control
          type="text"
          placeholder="ค้นหาคาเฟ่..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border-right-0"
        />
        <InputGroup.Text className="bg-white border-left-0">
          <Button variant="outline-primary" type="submit" className="border-0">
            <FaSearch />
          </Button>
        </InputGroup.Text>
      </InputGroup>
    </Form>
  );
}

export default Search;