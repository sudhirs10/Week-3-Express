import promisePool from '../../utils/database.js';

const listAllCats = async () => {
  const sql = `
    SELECT wsk_cats.*, wsk_users.name AS owner_name
    FROM wsk_cats
    JOIN wsk_users ON wsk_cats.owner = wsk_users.user_id
  `;

  const [rows] = await promisePool.query(sql);

  return rows;
};

const findCatById = async (id) => {
  const sql = `
    SELECT wsk_cats.*, wsk_users.name AS owner_name
    FROM wsk_cats
    JOIN wsk_users ON wsk_cats.owner = wsk_users.user_id
    WHERE wsk_cats.cat_id = ?
  `;

  const [rows] = await promisePool.execute(sql, [id]);

  if (rows.length === 0) {
    return false;
  }

  return rows[0];
};

const findCatsByUserId = async (userId) => {
  const sql = `
    SELECT wsk_cats.*, wsk_users.name AS owner_name
    FROM wsk_cats
    JOIN wsk_users ON wsk_cats.owner = wsk_users.user_id
    WHERE wsk_cats.owner = ?
  `;

  const [rows] = await promisePool.execute(sql, [userId]);

  return rows;
};

const addCat = async (cat) => {
  const {cat_name, weight, owner, filename, birthdate} = cat;

  const sql = `
    INSERT INTO wsk_cats
    (cat_name, weight, owner, filename, birthdate)
    VALUES (?, ?, ?, ?, ?)
  `;

  const values = [cat_name, weight, owner, filename, birthdate];

  const [result] = await promisePool.execute(sql, values);

  if (result.affectedRows === 0) {
    return false;
  }

  return {
    cat_id: result.insertId,
  };
};

const modifyCat = async (cat, id, authenticatedUser) => {
  let sql;

  if (authenticatedUser.role === 'admin') {
    sql = promisePool.format('UPDATE wsk_cats SET ? WHERE cat_id = ?', [
      cat,
      id,
    ]);
  } else {
    sql = promisePool.format(
      'UPDATE wsk_cats SET ? WHERE cat_id = ? AND owner = ?',
      [cat, id, authenticatedUser.user_id]
    );
  }

  const [result] = await promisePool.query(sql);

  if (result.affectedRows === 0) {
    return false;
  }

  return {
    message: 'success',
  };
};

const removeCat = async (id, authenticatedUser) => {
  let sql;
  let values;

  if (authenticatedUser.role === 'admin') {
    sql = 'DELETE FROM wsk_cats WHERE cat_id = ?';
    values = [id];
  } else {
    sql = `
      DELETE FROM wsk_cats
      WHERE cat_id = ? AND owner = ?
    `;

    values = [id, authenticatedUser.user_id];
  }

  const [result] = await promisePool.execute(sql, values);

  if (result.affectedRows === 0) {
    return false;
  }

  return {
    message: 'success',
  };
};

export {
  listAllCats,
  findCatById,
  findCatsByUserId,
  addCat,
  modifyCat,
  removeCat,
};
