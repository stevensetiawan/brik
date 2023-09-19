const { pool } = require('../config/pg_pool_config');

module.exports.create = async (data, image) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const query_product = `INSERT INTO "product" (sku, name, description, harga, weight, height, width, length, categoryid, image, created_at, updated_at) 
                    VALUES ('${data.sku}', '${data.name}','${data.description}', '${data.harga}', '${data.height}', '${data.weight}', '${data.width}', '${data.length}', '${data.categoryid}', '${image}', now(), now()) returning *;`;
    const res_query_product = await client.query(query_product);
    
    await client.query("COMMIT");
      
    return res_query_product?.rows[0];
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    if (client) {
      client.release();
    }
  }
};

module.exports.upsertProduct = async (client, product, product_detail, store, is_skip_product_detail) => {

  try {
    await client.query("BEGIN");

    let qry_upsert_prod = `INSERT INTO "product" (product_type_id, sku, product_name, product_description, keyword, is_active, created_at) 
                      VALUES (${product["product_type_id"]}, '${product["SKU"]}', '${product["Product Name"]}','${product["Product Name"]}', '${product["product_keyword"]}', true, now()) `;
    qry_upsert_prod += ` ON CONFLICT (sku) `;
    qry_upsert_prod += ` DO UPDATE SET 
                        is_active = true,
                        updated_at = now()
                        Returning product_id
                      `;
    const res_qry_upsert_prod = await client.query(qry_upsert_prod);
    const product_id = res_qry_upsert_prod.rows[0].product_id;


    // if(!is_skip_product_detail){
      if(product.product_detail.length > 0){
        const query_delete_product_detail = `DELETE from product_detail where product_id = ${product_id}`
        await client.query(query_delete_product_detail)
        let query_product_detail = `INSERT INTO "product_detail" (product_id, attribute_id, value_attribute ) `
        query_product_detail  += `   VALUES  `;
        for (let i = 0; i < product.product_detail.length; i++) {
          query_product_detail += ` (${product_id}, ${product.product_detail[i].attribute_id}, '${product.product_detail[i].value_attribute}') `;
          if(i < product.product_detail.length - 1){
            query_product_detail += `, `
          }
        }
        await client.query(query_product_detail);
      }
    
    if(product["Stok Display"]){
      let query_insert_stock_default_display  = `INSERT INTO "store_stock_product" (product_id, store_id, stock, store_price_product, stock_category ) 
                                                VALUES (${product_id}, ${store.store_id}, ${product["Stok Display"]}, ${product["Price"]} , 'DISPLAY')`;
      query_insert_stock_default_display += ` ON CONFLICT (product_id, store_id, stock_category) `;
      query_insert_stock_default_display += ` DO UPDATE SET 
                                              store_price_product = EXCLUDED.store_price_product, 
                                              stock = EXCLUDED.stock
                                            `;
                                              
      await client.query(query_insert_stock_default_display);
    }

    if(product["Stok Warehouse"]){

      let query_insert_stock_default_warehouse  = `INSERT INTO "store_stock_product" (product_id, store_id, stock, store_price_product, stock_category ) 
                                                  VALUES (${product_id}, ${store.store_id}, ${product["Stok Warehouse"]}, ${product["Price"]}, 'WAREHOUSE')`;
      query_insert_stock_default_warehouse += ` ON CONFLICT (product_id, store_id, stock_category) `;
      query_insert_stock_default_warehouse += ` DO UPDATE SET 
                                              store_price_product = EXCLUDED.store_price_product, 
                                              stock = EXCLUDED.stock
                                            `;

      await client.query(query_insert_stock_default_warehouse);
    }

    await client.query('COMMIT'); // Commit the transaction

    return "success";
    
  } catch (err) {
    await client.query("ROLLBACK");
    return err;
  } 
};

module.exports.upsertBulk = async (products, product_detail, store, is_skip_product_detail) => {
  const client = await pool.connect();
  const productFailedInsert = [];
  try {
    
    for (let index = 0; index < products.length; index++) {
      const product = products[index];
    
      const res_product = await this.upsertProduct(client, product, product_detail, store, is_skip_product_detail);
      
      if(res_product !== 'success'){
        product.error = res_product;
        console.error(`Failed to insert data: ${product["SKU"]}`);
        productFailedInsert.push(product);
      }
    }

  
    return {
      status: "finish",
      productFailedInsert: productFailedInsert
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

module.exports.upsertBak = async (products, product_detail, store) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    for (let index = 0; index < products.length; index++) {
      const product = products[index];
      let qry_upsert_prod = `INSERT INTO "product" (product_type_id, sku, product_name, product_description, keyword, is_active, created_at) 
            VALUES (${product["product_type_id"]}, '${product["SKU"]}', '${product["Product Name"]}','${product["Product Name"]}', '${product["product_keyword"]}', true, now()) `;
      qry_upsert_prod += ` ON CONFLICT (sku) `;
      qry_upsert_prod += ` DO UPDATE SET 
                          product_name = EXCLUDED.product_name,
                          product_description = EXCLUDED.product_description,
                          keyword = EXCLUDED.keyword,
                          is_active = true,
                          updated_at = now()
                          Returning product_id
                        `;
      console.log('qry_upsert_prod:', qry_upsert_prod);
      const res_qry_upsert_prod = await client.query(qry_upsert_prod);
      console.log('res:', res_qry_upsert_prod);
      const product_id = res_qry_upsert_prod.rows[0].product_id;

      
      const query_delete_product_detail = `DELETE from product_detail where product_id = ${product_id}`
      await client.query(query_delete_product_detail);

      for (let i = 0; i < product_detail.length; i++) {
        const query_product_detail = `INSERT INTO "product_detail" (product_id, attribute_id, value_attribute ) 
        VALUES (${product_id}, ${product_detail[i].attribute_id}, '${product_detail[i].value_attribute}')`;
        console.log('query_product_detail:', query_product_detail);
        await client.query(query_product_detail);
        
      }
  
      
      let query_insert_stock_default_display  = `INSERT INTO "store_stock_product" (product_id, store_id, stock, store_price_product, stock_category ) 
      VALUES (${product_id}, ${store.store_id}, ${product["Stok Display"]}, ${product["Price"]} , 'DISPLAY')`;
      query_insert_stock_default_display += ` ON CONFLICT (product_id, store_id, stock_category) `;
      query_insert_stock_default_display += ` DO UPDATE SET 
                                              stock = EXCLUDED.stock,
                                              store_price_product = EXCLUDED.store_price_product 
                                            `;
                                              
      await client.query(query_insert_stock_default_display);

      let query_insert_stock_default_warehouse  = `INSERT INTO "store_stock_product" (product_id, store_id, stock, store_price_product, stock_category ) 
      VALUES (${product_id}, ${store.store_id}, ${product["Stok Warehouse"]}, ${product["Price"]}, 'WAREHOUSE')`;
      query_insert_stock_default_warehouse += ` ON CONFLICT (product_id, store_id, stock_category) `;
      query_insert_stock_default_warehouse += ` DO UPDATE SET 
                                              stock = EXCLUDED.stock,
                                              store_price_product = EXCLUDED.store_price_product 
                                            `;
      
      await client.query(query_insert_stock_default_warehouse);
    
    }
   

    await client.query("COMMIT");
      
    return "success";
    
  } catch (err) {
    console.log(err);
    await client.query("ROLLBACK");
    throw err;
  } finally {
    if (client) {
      client.release();
    }
  }
};

module.exports.updateProduct = async (id, data) => {
  const client = await pool.connect();

  try {
      await client.query("BEGIN");

      //update data product
      let query_update_product = `UPDATE product SET  `

      if(data.name){
        query_update_product +=  ` name = '${data.name}' ,` 
      }

      if(data.description){
        query_update_product +=  ` description = '${data.description}' ,` 
      }

      if(data.width){
        query_update_product +=  ` width = '${data.width}' ,` 
      }

      if(data.length){
        query_update_product +=  ` length = '${data.length}' ,` 
      }

      if(data.weight){
        query_update_product +=  ` weight = '${data.weight}' ,` 
      }

      if(data.height){
        query_update_product +=  ` height = '${data.height}' ,` 
      }

      if(data.harga){
        query_update_product +=  ` harga = '${data.harga}' ,` 
      }

      if(data.image){
        query_update_product +=  ` image = '${data.image}' ,` 
      }

      if(data.categoryid){
        query_update_product +=  ` categoryid = '${data.categoryid}' ,` 
      }

      query_update_product += ` updated_at = now() where id ='${id}' returning * `
          
      console.log('query_update_product:', query_update_product)
      const res_update_product = await client.query(query_update_product)
      console.log('res:', res_update_product)     
  
      if(res_update_product?.rows?.[0]){
        await client.query("COMMIT")
        return res_update_product.rows[0]
      } else {
        throw new Error('Failed to update')
      }
      
  } catch (err) {
      console.log(err);
      await client.query("ROLLBACK");
      throw err;
  } finally {
      if (client) {
        client.release();
      }
  }
};

//get data sph dan cyl by like
module.exports.getDataProductPagination = async (payload) => {
  const client = await pool.connect();
  try {
      let offset = 0;
      let count = 0;
      let query_count_product =  `  SELECT count(DISTINCT(p.product_id))  `;
          query_count_product += ` FROM product p `;
          query_count_product += ` join product_type pt on p.product_type_id  = pt.product_type_id `;
          query_count_product += ` join product_detail pd on p.product_id  = pd.product_id `;
          query_count_product += ` join store_stock_product ssp on p.product_id = ssp.product_id `;
          query_count_product += ` join store s on ssp.store_id  = s.store_id `
          query_count_product += ` WHERE  p.is_delete = false  and s.is_delete = false `;

      if(payload.is_pos == true){
        query_count_product += ` AND lower(pt.product_type_name) = lower('${payload.category}') `;
        query_count_product += ` AND p.is_active = true `;
      }else{
        if(payload.category){
          if(payload.category == 'Lens'){
            query_count_product += ` AND pt.product_type_name = 'Lens' `;
          }else{
            query_count_product += ` AND pt.product_type_name != 'Lens' `;
          }
        }
      }

      if(payload.is_store_active){
        query_count_product += ` AND s.is_active =  '${payload.is_store_active}' `;
      }
      
      if(payload.is_active){
        query_count_product += ` AND p.is_active =  '${payload.is_active}' `;
      }

      if (payload.search && payload.category === 'Lens' && (payload.sph || payload.cyl)) {
        (payload.sph && payload.cyl) ? query_count_product += ` AND (p.keyword ILIKE '%${payload.search}%' AND p.keyword ILIKE '%sph ${payload.sph}%' AND p.keyword ILIKE '%cyl ${payload.cyl}') ` : payload.sph ? query_count_product += ` AND (p.keyword ILIKE '%${payload.search}%' AND p.keyword ILIKE '%sph ${payload.sph}%') ` :  query_count_product += ` AND (p.keyword ILIKE '%${payload.search}%' AND p.keyword ILIKE '%cyl ${payload.cyl}') `
      } else if(payload.category === 'Lens' && (payload.sph || payload.cyl)){
        (payload.sph && payload.cyl) ? query_count_product += ` AND (p.keyword ILIKE '%sph ${payload.sph}%' AND p.keyword ILIKE '%cyl ${payload.cyl}') ` : payload.sph ? query_count_product += ` AND (p.keyword ILIKE '%sph ${payload.sph}%') ` :  query_count_product += ` AND (p.keyword ILIKE '%cyl ${payload.cyl}') `
      } else if(payload.search){
          query_count_product += ` AND (p.keyword LIKE $$% ` + payload.search.toLowerCase() + `%$$) `;
      }
      console.log("query_count_product: ", query_count_product)
      const res_tot_data = await client.query(query_count_product);
      console.log("total data:" , res_tot_data.rows[0].count);
      const total_data = res_tot_data.rows[0].count;
     
      if(payload.page > 1 ){
        offset = (payload.page * payload.showentry) - payload.showentry;
      }
      
      if (payload.showentry) {
        query_count_product += ` LIMIT ${payload.showentry} `;
      }

      if (offset) {
        query_count_product += ` OFFSET ${offset} `;
      }

      console.log("query_count_product: ", query_count_product);
      const res_count_product = await client.query(query_count_product);
  
      if(res_count_product.rows.length>0){
        count = res_count_product.rows[0].count;
      }
      
      const tot_page = Math.ceil(count/payload.showentry);

      // let query_select_product =  `  SELECT pt.product_type_id, pt.product_type_name , p.*, json_agg(ssp.*) as store_item `;
      let query_select_product =  `  SELECT pt.product_type_id, pt.product_type_name , p.*, `;
          query_select_product += ` json_agg(
            json_build_object ('store_stock_product_id', ssp.store_stock_product_id ,'store_id', ssp.store_id, 
              'store_code', s.kode, 'store_name',  s.nama, 
              'price',ssp.store_price_product, 'stock', ssp.stock , 'stock_category', ssp.stock_category  )) as stores  `
          query_select_product += ` FROM product p `;
          query_select_product += ` join product_type pt on p.product_type_id  = pt.product_type_id `;
          query_select_product += ` join product_detail pd on p.product_id  = pd.product_id `;
          query_select_product += ` join store_stock_product ssp on p.product_id = ssp.product_id `;
          query_select_product += ` join store s on ssp.store_id  = s.store_id `
          query_select_product += ` WHERE  p.is_delete = false  and s.is_delete = false `;
      
      
      if(payload.is_pos == true){
        query_select_product += ` AND lower(pt.product_type_name) =  lower('${payload.category}') `;
        query_select_product += ` AND p.is_active = true `;
      }else{
        if(payload.category){
          if(payload.category == 'Lens'){
            query_select_product += ` AND pt.product_type_name = 'Lens' `;
          }else{
            query_select_product += ` AND pt.product_type_name != 'Lens' `;
          }
        }
      }

      if(payload.is_store_active){
        query_select_product += ` AND s.is_active =  '${payload.is_store_active}' `;
      }

      if(payload.is_active){
        query_select_product += ` AND p.is_active =  '${payload.is_active}' `;
      }
      
      if (payload.search && payload.category === 'Lens' && (payload.sph || payload.cyl)) {
        (payload.sph && payload.cyl) ? query_select_product += ` AND (p.keyword ILIKE '%${payload.search}%' AND p.keyword ILIKE '%sph ${payload.sph}%' AND p.keyword ILIKE '%cyl ${payload.cyl}') ` : payload.sph ? query_select_product += ` AND (p.keyword ILIKE '%${payload.search}%' AND p.keyword ILIKE '%sph ${payload.sph}%') ` :  query_select_product += ` AND (p.keyword ILIKE '%${payload.search}%' AND p.keyword ILIKE '%cyl ${payload.cyl}') `
      } else if(payload.category === 'Lens' && (payload.sph || payload.cyl)){
        (payload.sph && payload.cyl) ? query_select_product += ` AND (p.keyword ILIKE '%sph ${payload.sph}%' AND p.keyword ILIKE '%cyl ${payload.cyl}') ` : payload.sph ? query_select_product += ` AND (p.keyword ILIKE '%sph ${payload.sph}%') ` :  query_select_product += ` AND (p.keyword ILIKE '%cyl ${payload.cyl}') `
      } else if (payload.search) {
        query_select_product += ` AND (lower(p.keyword) ILIKE '%${payload.search}%')`;
      }

      query_select_product += ` group by pt.product_type_id, product_type_name, p.product_id  `

      if(payload.key){
        query_select_product += ` ORDER BY ${payload.key} ${payload.order} `;
      }else{
        query_select_product += ` ORDER BY created_at DESC `;
      }
      

      if (payload.showentry) {
        query_select_product += ` LIMIT ${payload.showentry} `;
      }

      if (offset) {
        query_select_product += ` OFFSET ${offset} `;
      }

      console.log("query_select_product: ", query_select_product);
      
      const res_list_store = await client.query(query_select_product);
      const stores =  res_list_store.rows;

      const result = {
        totalFiltered :total_data,
        currentPage: payload.page,
        data : stores,
        totalPage: tot_page
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

//get data lense  by filter
module.exports.getDataProductPagination1 = async (payload) => {
  const client = await pool.connect();
  try {
      let offset = 0;
      let count = 0;
      let query_count_product =  `  SELECT count(DISTINCT(p.id))  `;
          query_count_product += ` FROM product p `;
          query_count_product += ` INNER JOIN category c on p.categoryid = c.id`;
          query_count_product += ` WHERE  p.is_delete = false `;

      if (payload.search) {
        query_count_product += ` AND (lower(p.name) ILIKE '%${payload?.search}%')`;
      }

      console.log("query_count_product: ", query_count_product)
      const res_tot_data = await client.query(query_count_product);
      console.log("total data:" , res_tot_data?.rows[0]?.count);
      const total_data = res_tot_data?.rows[0]?.count;
     
      if(payload.page > 1 ){
        offset = (payload.page * payload.showentry) - payload.showentry;
      }
      
      if (payload.showentry) {
        query_count_product += ` LIMIT ${payload.showentry} `;
      }

      if (offset) {
        query_count_product += ` OFFSET ${offset} `;
      }

      console.log("query_count_product: ", query_count_product);
      const res_count_product = await client.query(query_count_product);
  
      if(res_count_product?.rows.length > 0){
        count = res_count_product?.rows[0].count;
      }
      
      const tot_page = Math.ceil(count/payload.showentry);

      let query_select_product =  ` SELECT p.*, category_name categoryName `
          query_select_product += ` FROM product p `
          query_select_product += ` INNER JOIN category c on p.categoryid = c.id`
          query_select_product += ` WHERE p.is_delete = false `;

      if (payload.search) {
        console.log("tidak masuk kondisi lense")
        query_select_product += ` AND (lower(p.name) ILIKE '%${payload?.search}%')`;
      }

      if(payload.key){
        query_select_product += ` ORDER BY ${payload.key} ${payload.order} `;
      }else{
        query_select_product += ` ORDER BY created_at DESC `;
      }
      
      if (payload.showentry) {
        query_select_product += ` LIMIT ${payload.showentry} `;
      }

      if (offset) {
        query_select_product += ` OFFSET ${offset} `;
      }

      console.log("query_select_product: ", query_select_product);
      
      let res_list_store = await client.query(query_select_product);

      const result = {
        totalFiltered :total_data,
        currentPage: payload?.page,
        data : res_list_store?.rows,
        totalPage: tot_page
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

module.exports.findDetailProduct = async (data) => {
  const client = await pool.connect();
  try {
    const query = ` SELECT p.*, c.category_name categoryName
    FROM product p  
    INNER JOIN category c on p.categoryid = c.id  
    WHERE  p.is_delete = false AND p.id = ${data.product_id} `;
    console.log('query:', query);
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

module.exports.countStockProduct = async (data) => {
  const client = await pool.connect();
  try {
    const query = `select product_stock from product where product_id = ${data.id} and is_delete = false `;
    console.log('query:', query);
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

module.exports.getAllProduct = async (fiter_by_name) => {
  const client = await pool.connect();

  try {
      let query = `select p.*, pd.attribute_id, a.attribute_name , pd.value_attribute  
      from product p
      join product_detail pd on p.product_id= pd.product_id  
      join attribute a  on pd.attribute_id  = a.attribute_id  
      where p.is_delete = false `;
      console.log(query);
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

module.exports.getAllAttribute = async (fiter_by_name) => {
  let errConnect;
  const client = await pool.connect().catch((err) => {
      console.log(err);
      errConnect = err;
  });

  try {
      let query = `select attribute_id, attribute_name, attribute_description from attribute`;
      if(fiter_by_name){
         query += ` where attribute_name = '${fiter_by_name}' `
      }
      console.log(query);
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

module.exports.getAttributProduct = async (data) => {
  const client = await pool.connect();

  try {
      let query = ` select  pd.product_detail_id ,a.attribute_id , a.attribute_name,
      pd.value_attribute 
      from product_detail pd 
      left join "attribute" a ON pd.attribute_id  = a.attribute_id `;
      if(data.product_id){
         query += `  where pd.product_id = ${data.product_id} `
      }
      console.log("query getAttributProduct: ", query);
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

module.exports.getProductType = async (payload) => {
  let errConnect;
  const client = await pool.connect().catch((err) => {
      console.log(err);
      errConnect = err;
  });

  try {
      let query = `select product_type_id, product_type_name from product_type `;
      if(payload){
        if(payload.id){
          query  += ` where product_type_id = ${payload.id} `;
        }else if(payload.category){
          query  += ` where product_type_name = '${payload.category}' `;
        }
      }
      console.log(query);
      const result = await client.query(query);
      return result.rows;
  } catch (err) {
      console.log(err);
      throw err;
  } finally {
      if (client) {
        client.release();
      }
  }
};

module.exports.getProductTypeByProductId = async (product_id) => {
  let errConnect;
  const client = await pool.connect().catch((err) => {
      console.log(err);
      errConnect = err;
  });

  try {
      let query = `select p.*, pt.product_type_name  from product p `;
          query += ` join product_type pt on p.product_type_id  = pt.product_type_id `;
          query += ` where p.product_id  = ${product_id};`
      console.log(query);
      const result = await client.query(query);
      return result.rows[0];
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
    const query = `SELECT * FROM product where product_id = ${data.id} AND is_delete = 'false' `;
    console.log('query:', query);
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

module.exports.findPriceProduct = async (product_id, store_id, stock_category) => {
  const client = await pool.connect();
  try {
    const query = `SELECT p.keyword , ssp.store_price_product FROM store_stock_product ssp 
                  join product p on ssp.product_id  = p.product_id 
                  where p.product_id = ${product_id} AND  ssp.store_id = ${store_id} and ssp.stock_category = '${stock_category}' `;
    console.log('query:', query);
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

module.exports.findById = async (arr_product_id) => {
  const client = await pool.connect();
  try {
    const query = `SELECT * FROM product where product_id in(${arr_product_id}) `;
    console.log('query:', query);
    const res = await client.query(query);
    return res.rows;
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    if (client) {
      client.release();
    }
  }
};

module.exports.softDeleteProduct = async (id) => {
  const client = await pool.connect();

  try {
      const query_selct = `SELECT count(id) FROM product where id = ${id} AND is_delete = false `;
      const res_query_selct = await client.query(query_selct);
      const count = res_query_selct.rows[0].count;
      if(count == 1){
        const query_del = ` UPDATE product SET is_delete = true, updated_at = now() where id = ${id} `;
        console.log(query_del);
        const res_del = await client.query(query_del);
        console.log('soft_del:', res_del);
        return "success";
      }else{
        return  "Product Not Found";
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

module.exports.setActiveProduct = async (data) => {
  let errConnect;
  const client = await pool.connect().catch((err) => {
      console.log(err);
      errConnect = err;
  });

  try {
      let status_update = true;

      const query_select = `SELECT count(product_id) FROM product where product_id = ${data.product_id} AND is_delete = false `;
      console.log(query_select);
      const res_query_selct = await client.query(query_select);
      console.log(res_query_selct);
      const count = res_query_selct.rows[0].count;
      if(count == 1){
        const query_del = ` UPDATE product SET is_active = ${data.is_active}, updated_at = now() where product_id = ${data.product_id} `;
        await client.query(query_del);
        return {
          status: status_update,
          message_update: "success"
        }
      }else{
        return {
          status: false,
          message: "Product Not Found"
        }
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