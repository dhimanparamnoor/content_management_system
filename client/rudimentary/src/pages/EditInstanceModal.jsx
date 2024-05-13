import React, { useState } from 'react';

function EditInstanceModal({ instance, onUpdate ,closeModal}) {
  const [formData, setFormData] = useState(instance);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent form submission
    onUpdate(formData);
    closeModal(); // Close the modal
  };
  

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Edit Instance</h2>
        <form onSubmit={handleSubmit}>
          {Object.keys(formData).filter(attribute => attribute !== 'instance_id').map(attribute => (
            <div key={attribute}>
              <label>{attribute}</label>
              <input
                type="text"
                name={attribute}
                value={formData[attribute]}
                onChange={handleInputChange}
              />
            </div>
          ))}
          <button type="submit">Update</button>
        </form>
      </div>
    </div>
  );
}

export default EditInstanceModal;
