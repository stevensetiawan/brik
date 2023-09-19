const { env } = require('../config/vars');
const { pool } = require('../config/pg_pool_config');
const bcrypt = require("../helpers/bcrypt")

module.exports.insert = async (data) => {
  const client = await pool.connect();
  try {
    const rounds = env === 'development' ? 1 : 10;
    const hash = bcrypt.hasher(data.password, rounds);

    const query = `INSERT INTO "users" (email, password, name, created_at, updated_at) 
                    VALUES ('${data.email}', '${hash}', '${data.name}', 'now()', 'now()') returning *;`;
    const res = await client.query(query);
    return res.rows[0];
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    if (client) {
      client.release();
    }
  }
};

module.exports.passwordMatches = async (passwordText, passwordChiper) => {
  const rounds = env === 'development' ? 1 : 10;
  const hash = await bcrypt.hash(passwordText, rounds);
  return bcrypt.compare(hash, passwordChiper);
};

module.exports.findOneByUsername = async (data) => {
  const client = await pool.connect();
  try {
    const query = `SELECT u.* FROM users u 
                    WHERE u.email = '${data.email}' AND u.is_active = 'true';`
    const res = await client.query(query);
    return res.rows[0];
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    if (client) {
      client.release();
    }
  }
};

module.exports.findOneById = async (data) => {
  const client = await pool.connect();
  try {
    const query = `SELECT u.* FROM users u where u.id = ${data.id} AND u.is_active = 'true' `;
    const res = await client.query(query);
    return res.rows[0];
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    if (client) {
      client.release();
    }
  }
};

module.exports.updateLastUserLogin = async (id) => {
  var errConnect;
  const client = await pool.connect().catch((err) => {
      console.log(err);
      errConnect = err;
  });

  try {
      var query = `UPDATE users SET invalid_login_count = 0 WHERE id= ${id}`;
      const res = await client.query(query);
      return res.rows[0];
  } catch (err) {
      console.log(err);
      throw err;
  } finally {
      if (client) {
        client.release();
      }
  }
};

module.exports.count_invalid_count = async (id, invalid_loogin_counter) => {
  var errConnect;
  const client = await pool.connect().catch((err) => {
      console.log(err);
      errConnect = err;
  });

  try {
      var query = `UPDATE users SET invalid_login_count = ${invalid_loogin_counter} WHERE user_id= ${id} `;
      const res = await client.query(query);
      return res.rows[0];
  } catch (err) {
      console.log(err);
      throw err;
  } finally {
      if (client) {
        client.release();
      }
  }
};

module.exports.lockedAccount = async (id) => {
  var errConnect;
  const client = await pool.connect().catch((err) => {
      console.log(err);
      errConnect = err;
  });

  try {
      var query = `UPDATE users SET is_locked = true WHERE user_id= ${id} `;
      const res = await client.query(query);
      return res.rows[0];
  } catch (err) {
      console.log(err);
      throw err;
  } finally {
      if (client) {
        client.release();
      }
  }
};


module.exports.getDataPagination = async (showentry, page, order, key, search) => {
  var errConnect;
  const client = await pool.connect().catch((err) => {
      console.log(err);
      errConnect = err;
  });

  try {
      let offset = 0;
      let count = 0;
      var query_count_user =  `  SELECT count(u.user_id)  `;
          query_count_user += ` FROM users u `;
          query_count_user += ` WHERE  u.is_active = 'true'`;

      if (search) {
          query_count_user += ` AND (u.username LIKE $$%` + search + `%$$ OR `;
          query_count_user += ` u.email LIKE $$%` + search + `%$$ OR `;
          query_count_user += ` u.role LIKE $$%` + search + `%$$ ) `;
      }

      
      if(page > 1 ){
        offset = (page * showentry) - showentry;
      }
      
      if (showentry) {
        query_count_user += ` LIMIT ${showentry} `;
      }

      const res_count_user = await client.query(query_count_user);

      if(res_count_user.rows.length>0){
        count = res_count_user.rows[0].count;
      }
      
      const tot_page = Math.ceil(count/showentry);

      var query_select_user =  `  SELECT u.* `;
          query_select_user += ` FROM users u `;
          query_select_user += ` WHERE  u.is_active = 'true'`;

      if (search) {
          query_select_user += ` AND (u.username LIKE $$%` + search + `%$$ OR `;
          query_select_user += ` u.email LIKE $$%` + search + `%$$ OR `;
          query_select_user += ` u.role LIKE $$%` + search + `%$$ ) `;
      }

      if(key){
        query_select_user += ` ORDER BY ${key} ${order} `;
      }else{
        query_select_user += ` ORDER BY created_at DESC `;
      }
      

      if (showentry) {
          query_select_user += ` LIMIT ${showentry} `;
      }

      if (offset) {
          query_select_user += ` OFFSET ${offset} `;
      }

      
      const res_list_user = await client.query(query_select_user);
      const users =  res_list_user.rows;
      const result = {
        totalFiltered :count,
        currentPage: page,
        data : users,
        total_page: tot_page
      }
      return result;

  } catch (err) {
      console.log(err);
      return err;
  } finally {
      if (client) {
          client.release();
      }
  }
};

module.exports.getAllUser= async () => {
  let errConnect;
  const client = await pool.connect().catch((err) => {
      console.log(err);
      errConnect = err;
  });

  try {
      const query = `SELECT user_id, username, email, nik, name, phone, store_id FROM users `;
      const res_query = await client.query(query);
      return res_query.rows[0];
  } catch (err) {
      console.log(err);
      throw err;
  } finally {
      if (client) {
        client.release();
      }
  }
};

module.exports.getByStore= async (store_id) => {
  let errConnect;
  const client = await pool.connect().catch((err) => {
      console.log(err);
      errConnect = err;
  });

  try {
      const query = `SELECT user_id, username, email, nik, name, phone, store_id FROM users where store_id = ${store_id} `;
      const res_query = await client.query(query);
      return res_query.rows;
  } catch (err) {
      console.log(err);
      throw err;
  } finally {
      if (client) {
        client.release();
      }
  }
};


module.exports.getTotalUser = async () => {
  var errConnect;
  const client = await pool.connect().catch((err) => {
      console.log(err);
      errConnect = err;
  });

  try {
      const query_count_user = `SELECT count(user_id) FROM users where is_active = 'true' `;
      const res_user = await client.query(query_count_user);
      return res_user.rows[0].count;
  } catch (err) {
      console.log(err);
      throw err;
  } finally {
      if (client) {
        client.release();
      }
  }
};


module.exports.UpdateDataUser = async (id, data) => {
  let errConnect;
  const client = await pool.connect().catch((err) => {
      console.log(err);
      errConnect = err;
  });

  try {
      let query = `UPDATE users SET `
      if(data.email){
        query +=  `email = '${data.email}', username = '${data.email}', ` 
      }
      if(data.nik){
        query +=  ` nik = '${data.nik}' ,` 
      }

      if(data.name){
        query +=  ` name = '${data.name}' ,` 
      }

      if(data.phone){
        query +=  ` phone = '${data.phone}' ,` 
      }

      if(data.store_id){
        query +=  ` store_id = ${data.store_id} ,` 
      }

      if(data.role){
        query +=  ` role = '${data.role}' ,` 
      }

      query += ` updated_at = now()  where  user_id ='${id}' returning * `
          
      const res = await client.query(query);
      return res.rows[0];
  } catch (err) {
      console.log(err);
      throw err;
  } finally {
      if (client) {
        client.release();
      }
  }
};

module.exports.findByIdAndRemove = async (id) => {
  var errConnect;
  const client = await pool.connect().catch((err) => {
      console.log(err);
      errConnect = err;
  });

  try {
      const query_count_user = `SELECT count(username) FROM users where user_id = '${id}' AND is_active = 'true' `;
      const res_user = await client.query(query_count_user);
      const count = res_user.rows[0].count;
      if(count == 1){
        // const query_del = ` DELETE FROM users where user_id = '${id}' AND is_active = 'true' `;
        const query_del = ` Update users set is_active = 'false', is_delete = 'true'  where  user_id = '${id}' `;
        const res_del = await client.query(query_del);
        return "success";
      }else{
        return  "User Not Found";
      }

  } catch (err) {
      console.log(err);
      throw err;
  } finally {
      if (client) {
        client.release();
      }
  }
};