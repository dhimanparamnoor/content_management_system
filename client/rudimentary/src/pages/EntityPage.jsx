// EntityPage.js
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import EditInstanceModal from "./EditInstanceModal";

function EntityPage() {
  const { entityName } = useParams();
  const [instances, setInstances] = useState([]);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [attributes, setAttributes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentInstance, setCurrentInstance] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/entities/${entityName}`
        );
        // console.log("responses",await response.json());
        const data = await response.json();
        console.log(data);
        const attributesResponse = await fetch(
          `http://localhost:5000/api/entity_attributes/${entityName}`
        );
        const attributesData = await attributesResponse.json();
        setAttributes(attributesData);

        if (response.ok && data.length > 0) {
          setInstances(data);
          setLoading(false);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error:", error);
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
      const response = await fetch(
        `http://localhost:5000/api/entities/${entityName}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      if (response.ok) {
        // Refresh instances after adding
        const updatedResponse = await fetch(
          `http://localhost:5000/api/entities/${entityName}`
        );
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
      console.error("Error:", error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleUpdateInstance = async (updatedInstance) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/entities/${entityName}/${updatedInstance.instance_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedInstance),
        }
      );

      if (response.ok) {
        console.log("Instance updated successfully");
        // Update the instances state with the updated instance
        const updatedInstances = instances.map((instance) => {
          if (instance.instance_id === updatedInstance.instance_id) {
            return updatedInstance;
          } else {
            return instance;
          }
        });
        setInstances(updatedInstances);
        setShowModal(false); // Close the modal after successful update
      } else {
        console.error("Error updating instance:", response.statusText);
        // Handle error
      }
    } catch (error) {
      console.error("Error updating instance:", error);
      // Handle error
    }
  };

  const handleEditInstance = (instance) => {
    setCurrentInstance(instance);
    setShowModal(true);
  };

  const handleDeleteInstance = async (instanceId) => {
    try {
      console.log("Deleting instance with id:", instanceId);
      const response = await fetch(
        `http://localhost:5000/api/entities/${entityName}/${instanceId}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        // Refresh instances after deleting
        const updatedResponse = await fetch(
          `http://localhost:5000/api/entities/${entityName}`
        );
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
      console.error("Error:", error);
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
        {attributes.map((attribute) => (
          <input
            key={attribute.name}
            type="text"
            name={attribute.name}
            value={formData[attribute.name] || ""}
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
              {Object.keys(instances[0])
                .filter((attribute) => attribute !== "instance_id")
                .map((attribute) => (
                  <th key={attribute}>{attribute}</th>
                ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {instances.map((instance) => (
              <tr key={instance.instance_id}>
                {Object.keys(instance)
                  .filter((attribute) => attribute !== "instance_id")
                  .map((attribute) => (
                    <td key={attribute}>{instance[attribute]}</td>
                  ))}

                <td>
                  <button onClick={() => handleEditInstance(instance)}>
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteInstance(instance.instance_id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showModal && (
        <EditInstanceModal
          instance={currentInstance}
          onUpdate={handleUpdateInstance}
          closeModal={closeModal}
        />
      )}
    </div>
  );
}

export default EntityPage;
