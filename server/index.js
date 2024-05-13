const express = require("express");
const app = express();
const cors = require("cors");
const pool = require('./db');

app.use(cors());
app.use(express.json());


app.post('/api/entities', async (req, res) => {
    const { entity_name, attributes } = req.body;
  
    try {
      // Insert entity into entities table
      const entityInsertQuery = 'INSERT INTO entities (entity_name) VALUES ($1) RETURNING entity_id';
      const entityInsertResult = await pool.query(entityInsertQuery, [entity_name]);
      const entityId = entityInsertResult.rows[0].entity_id;
  
      // Insert attributes into attributes table
      const attributeInsertQuery = 'INSERT INTO attributes (entity_id, attribute_name, attribute_type) VALUES ($1, $2, $3)';
      await Promise.all(attributes.map(async (attribute) => {
        await pool.query(attributeInsertQuery, [entityId, attribute.attribute_name, attribute.attribute_type]);
      }));
  
      res.status(201).send('Entity created successfully');
    } catch (error) {
      console.error('Error creating entity:', error);
      res.status(500).send('Error creating entity');
    }
  });
  

  app.get('/api/entities', async (req, res) => {
    try {
      const entitiesQuery = 'SELECT * FROM entities';
      const entitiesResult = await pool.query(entitiesQuery);
      const entities = entitiesResult.rows;
  
      res.json(entities);
    } catch (error) {
      console.error('Error fetching entities:', error);
      res.status(500).send('Error fetching entities');
    }
  });


app.post('/api/entities/:entityName', async (req, res) => {
    const entityName = req.params.entityName;
    const data = req.body;
  
    try {
      // Insert new instance into entity_instances table
      const entityQuery = 'SELECT entity_id FROM entities WHERE entity_name = $1';
      const entityResult = await pool.query(entityQuery, [entityName]);
      const entityId = entityResult.rows[0].entity_id;
  
      const insertQuery = `INSERT INTO entity_instances (entity_id) VALUES ($1) RETURNING instance_id`;
      const insertResult = await pool.query(insertQuery, [entityId]);
      const instanceId = insertResult.rows[0].instance_id;
  
      // Insert attribute values into instance_attributes table
      const attributeInsertQueries = Object.keys(data).map(key => {
        return pool.query('INSERT INTO instance_attributes (instance_id, attribute_id, attribute_value) VALUES ($1, (SELECT attribute_id FROM attributes WHERE entity_id = $2 AND attribute_name = $3), $4)',
        [instanceId, entityId, key, data[key]]);
      });
  
      await Promise.all(attributeInsertQueries);
  
      res.status(201).send('Entity instance created successfully');
    } catch (error) {
      console.error('Error creating entity instance:', error);
      res.status(500).send('Error creating entity instance');
    }
  });
  
  // Read (GET)
  app.get('/api/entities/:entityName', async (req, res) => {
    const entityName = req.params.entityName;
  
    try {
      // Retrieve entity ID
      const entityQuery = 'SELECT entity_id FROM entities WHERE entity_name = $1';
      const entityResult = await pool.query(entityQuery, [entityName]);
      const entityId = entityResult.rows[0].entity_id;
  
      // Retrieve instances and their attributes
      const instancesQuery = 'SELECT * FROM entity_instances WHERE entity_id = $1';
      const instancesResult = await pool.query(instancesQuery, [entityId]);
      const instances = instancesResult.rows;
  
      // Fetch attribute values for each instance
      const data = await Promise.all(instances.map(async instance => {
        const attributesQuery = 'SELECT instance_id,attribute_name, attribute_value FROM instance_attributes INNER JOIN attributes ON instance_attributes.attribute_id = attributes.attribute_id WHERE instance_id = $1';
        const attributesResult = await pool.query(attributesQuery, [instance.instance_id]);
        console.log("attribute",attributesResult);
        return attributesResult.rows.reduce((acc, { instance_id,attribute_name, attribute_value }) => {
          acc[attribute_name] = attribute_value;
          acc["instance_id"] = instance_id;
          return acc;
        }, {});
      }));
  
      res.json(data);
    } catch (error) {
      console.error('Error fetching entity instances:', error);
      res.status(500).send('Error fetching entity instances');
    }
  });
  

  app.get('/api/entity_attributes/:entityName', async (req, res) => {
    const { entityName } = req.params;
  
    try {
      const query = `
        SELECT attribute_name, attribute_type
        FROM attributes
        INNER JOIN entities ON entities.entity_id = attributes.entity_id
        WHERE entity_name = $1
      `;
      const result = await pool.query(query, [entityName]);
  
      // Extract attribute names and types from the query result
      const attributes = result.rows.map(row => ({
        name: row.attribute_name,
        type: row.attribute_type
      }));
  
      res.json(attributes);
    } catch (error) {
      console.error('Error fetching entity attributes:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  app.put('/api/entities/:entityName/:instanceId', async (req, res) => {
    const entityName = req.params.entityName;
    const instanceId = req.params.instanceId;
    const newData = req.body;
  
    try {
      // Update attribute values for the instance
      const updateQueries = Object.keys(newData).map(key => {
        return pool.query('UPDATE instance_attributes SET attribute_value = $1 WHERE instance_id = $2 AND attribute_id = (SELECT attribute_id FROM attributes WHERE entity_id = (SELECT entity_id FROM entities WHERE entity_name = $3) AND attribute_name = $4)',
        [newData[key], instanceId, entityName, key]);
      });
  
      await Promise.all(updateQueries);
  
      res.status(200).send('Entity instance updated successfully');
    } catch (error) {
      console.error('Error updating entity instance:', error);
      res.status(500).send('Error updating entity instance');
    }
  });
  
  app.delete('/api/entities/:entityName/:instanceId', async (req, res) => {
    const entityName = req.params.entityName;
    const instanceId = req.params.instanceId;
  
    try {
      await pool.query('DELETE FROM instance_attributes WHERE instance_id = $1', [instanceId]);
      await pool.query('DELETE FROM entity_instances WHERE instance_id = $1', [instanceId]);
  
      res.status(200).send('Entity instance deleted successfully');
    } catch (error) {
      console.error('Error deleting entity instance:', error);
      res.status(500).send('Error deleting entity instance');
    }
  });
  


app.listen(5000, () =>{
    console.log("server has started on port 5000");
})