// CreateEntity.js
import React, { useState } from 'react';

function CreateEntity({updateEntityList}) {
  const [entityName, setEntityName] = useState('');
  const [attributes, setAttributes] = useState([]);

  const handleAddAttribute = () => {
    setAttributes([...attributes, { attribute_name: '', attribute_type: '' }]);
  };

  const handleChangeAttribute = (index, event) => {
    const updatedAttributes = [...attributes];
    updatedAttributes[index][event.target.name] = event.target.value;
    setAttributes(updatedAttributes);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/entities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ entity_name: entityName, attributes })
      });
      if (response.ok) {
        // Call the function to update the entity list
        updateEntityList();
        // Handle success
      } else {
        // Handle error
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h2>Create Entity</h2>
      <label>
        Entity Name:
        <input type="text" value={entityName} onChange={(e) => setEntityName(e.target.value)} />
      </label>
      <button onClick={handleAddAttribute}>Add Attribute</button>
      {attributes.map((attribute, index) => (
        <div key={index}>
          <input
            type="text"
            name="attribute_name"
            value={attribute.attribute_name}
            onChange={(e) => handleChangeAttribute(index, e)}
            placeholder="Attribute Name"
          />
          <input
            type="text"
            name="attribute_type"
            value={attribute.attribute_type}
            onChange={(e) => handleChangeAttribute(index, e)}
            placeholder="Attribute Type"
          />
        </div>
      ))}
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default CreateEntity;
