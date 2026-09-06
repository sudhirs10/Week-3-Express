import promisePool from '../../utils/database.js';

const listAllUsers = async () => {
  const sql = 'SELECT * FROM wsk_users';

  const [rows] = await promisePool.query(sql);

  return rows;
};

const findUserById = async (id) => {
  const sql = 'SELECT * FROM wsk_users WHERE user_id = ?';

  const [rows] = await promisePool.execute(sql, [id]);

  if (rows.length === 0) {
    return false;
  }

  return rows[0];
};

const findUserByUsername = async (username) => {
  const sql = 'SELECT * FROM wsk_users WHERE username = ?';

  const [rows] = await promisePool.execute(sql, [username]);

  if (rows.length === 0) {
    return false;
  }

  return rows[0];
};

const addUser = async (user) => {
  const {name, username, email, password, role} = user;

  const sql = `
    INSERT INTO wsk_users
    (name, username, email, password, role)
    VALUES (?, ?, ?, ?, ?)
  `;

  const values = [name, username, email, password, role];

  const [result] = await promisePool.execute(sql, values);

  if (result.affectedRows === 0) {
    return false;
  }

  return {
    user_id: result.insertId,
  };
};

const modifyUser = async (user, id) => {
  const sql = promisePool.format('UPDATE wsk_users SET ? WHERE user_id = ?', [
    user,
    id,
  ]);

  const [result] = await promisePool.query(sql);

  if (result.affectedRows === 0) {
    return false;
  }

  return {
    message: 'success',
  };
};

const removeUser = async (id) => {
  const connection = await promisePool.getConnection();

  try {
    await connection.beginTransaction();

    const deleteCatsSql = 'DELETE FROM wsk_cats WHERE owner = ?';

    await connection.execute(deleteCatsSql, [id]);

    const deleteUserSql = 'DELETE FROM wsk_users WHERE user_id = ?';

    const [userResult] = await connection.execute(deleteUserSql, [id]);

    if (userResult.affectedRows === 0) {
      await connection.rollback();

      return false;
    }

    await connection.commit();

    return {
      message: 'success',
    };
  } catch (error) {
    await connection.rollback();

    throw error;
  } finally {
    connection.release();
  }
};

export {
  listAllUsers,
  findUserById,
  findUserByUsername,
  addUser,
  modifyUser,
  removeUser,
};
