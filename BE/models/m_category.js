const { pool } = require('../config/pg_pool_config');

module.exports.getAllCategory = async () => {
  const client = await pool.connect().catch((err) => {
    errConnect = err;
});

  try {
      let query = `select c.*  
      from category c 
      where c.is_delete = false `;
      const res_query = await client.query(query);
      return res_query.rows;
  } catch (err) {
      throw err;
  } finally {
      if (client) {
        client.release();
      }
  }
};