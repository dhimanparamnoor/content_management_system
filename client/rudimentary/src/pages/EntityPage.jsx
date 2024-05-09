// EntityPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function EntityPage() {
  const { entityName } = useParams();
  const [instances, setInstances] = useState([]);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/entities/${entityName}`);
        if (response.ok) {
          const data = await response.json();
          setInstances(data);
          setLoading(false);
        } else {
          // Handle error
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchData();
  }, [entityName]);

  const handleInputChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleAddInstance = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/entities/${entityName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        // Refresh instances after adding
        const updatedResponse = await fetch(`http://localhost:5000/api/entities/${entityName}`);
        if (updatedResponse.ok) {
          const updatedData = await updatedResponse.json();
          setInstances(updatedData);
        } else {
          // Handle error
        }
      } else {
        // Handle error
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleUpdateInstance = async (instanceId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/entities/${entityName}/${instanceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        // Refresh instances after updating
        const updatedResponse = await fetch(`http://localhost:5000/api/entities/${entityName}`);
        if (updatedResponse.ok) {
          const updatedData = await updatedResponse.json();
          setInstances(updatedData);
        } else {
          // Handle error
        }
      } else {
        // Handle error
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDeleteInstance = async (instanceId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/entities/${entityName}/${instanceId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        // Refresh instances after deleting
        const updatedResponse = await fetch(`http://localhost:5000/api/entities/${entityName}`);
        if (updatedResponse.ok) {
          const updatedData = await updatedResponse.json();
          setInstances(updatedData);
        } else {
          // Handle error
        }
      } else {
        // Handle error
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{entityName} Data</h2>
      <table>
        <thead>
          <tr>
            {Object.keys(instances[0]).map(attribute => (
              <th key={attribute}>{attribute}</th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {instances.map(instance => (
            <tr key={instance.instance_id}>
              {Object.keys(instance).map(attribute => (
                <td key={attribute}>{instance[attribute]}</td>
              ))}
              <td>
                <button onClick={() => handleUpdateInstance(instance.instance_id)}>Update</button>
                <button onClick={() => handleDeleteInstance(instance.instance_id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Add New Instance</h3>
      <div>
        {Object.keys(instances[0]).map(attribute => (
          <input
            key={attribute}
            type="text"
            name={attribute}
            value={formData[attribute] || ''}
            placeholder={attribute}
            onChange={handleInputChange}
          />
        ))}
        <button onClick={handleAddInstance}>Add</button>
      </div>
    </div>
  );
}

export default EntityPage;
