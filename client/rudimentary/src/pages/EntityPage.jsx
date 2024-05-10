// EntityPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function EntityPage() {
  const { entityName } = useParams();
  const [instances, setInstances] = useState([]);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [attributes, setAttributes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/entities/${entityName}`);
        // console.log("responses",await response.json());
        const data = await response.json();
        console.log(data);

        if (response.ok && data.length>0) {
        //   console.log("hello",data[0].instance_id);
          setInstances(data);
          setLoading(false);
        } else {
            const attributesResponse = await fetch(`http://localhost:5000/api/entity_attributes/${entityName}`);
            const attributesData = await attributesResponse.json();
            setAttributes(attributesData);
            setLoading(false);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    const timeout = setTimeout(() => {
        setLoading(false); // Set loading to false after 5 seconds
      }, 2000);
    
      fetchData();
    
      return () => clearTimeout(timeout);
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
        console.log("updating instance", instanceId);
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
        console.log('Deleting instance with id:', instanceId);
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
      <div>
  <h3>Add New Instance</h3>
  {attributes.map(attribute => (
          <input
            key={attribute.name}
            type="text"
            name={attribute.name}
            value={formData[attribute.name] || ''}
            placeholder={attribute.name}
            onChange={handleInputChange}
          />
        ))}
  <button onClick={handleAddInstance}>Add</button>
</div>

      {instances.length > 0 && (
        <table>
          <thead>
            <tr>
              {Object.keys(instances[0]).filter(attribute => attribute !== 'instance_id').map(attribute => (
                <th key={attribute}>{attribute}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {instances.map(instance => (
              <tr key={instance.instance_id}>
                {Object.keys(instance).filter(attribute => attribute !== 'instance_id').map(attribute => (
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
      )}
    </div>
  );
  
}

export default EntityPage;
