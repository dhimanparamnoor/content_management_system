// EntityList.js
import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom'; // Import Link from react-router-dom

function EntityList() {
  const [entities, setEntities] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/entities');
        console.log(response);
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setEntities(data);
        } else {
          // Handle error
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h2>Entity List</h2>
      <ul>
        {entities.map(entity => (
          <li key={entity.entity_id}>
            {entity.entity_name}
            {/* Add button to redirect to entity page */}
            <Link to={`/entities/${entity.entity_name}`}>
              <button>View {entity.entity_name}</button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EntityList;
