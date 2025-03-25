import pool from "../config/db.js";

export const findById = async (id) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return rows[0];
  } catch (error) {
    console.error('Error finding user by ID:', error);
    throw new Error('Error finding user by ID');
  }
};

export const findOne = async (query) => {
  try {
    const keys = Object.keys(query);
    const values = Object.values(query);

    const condition = keys.map((key, index) => `${key} = $${index + 1}`).join(' AND ');
    const { rows } = await pool.query(`SELECT * FROM users WHERE ${condition}`, values);

    return rows[0];
  } catch (error) {
    console.error('Error finding user by condition:', error);
    throw new Error('Error finding user by condition');
  }
};

export const getUsers = async () => {
  try {
    const { rows } = await pool.query('SELECT * FROM users ORDER BY last_login DESC');
    return rows;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Error fetching users');
  }
};

export const updateUserStatus = async (userIds, status) => {
  try {
    await pool.query('UPDATE users SET status = $1 WHERE id = ANY($2)', [status, userIds]);
  } catch (error) {
    console.error('Error updating user status:', error);
    throw new Error('Error updating user status');
  }
};

export const deleteUser = async (userIds) => {
  try {
    await pool.query('DELETE FROM users WHERE id = ANY($1)', [userIds]);
  } catch (error) {
    console.error('Error deleting user:', error);
    throw new Error('Error deleting user');
  }
};

export default { findById, findOne, getUsers, updateUserStatus, deleteUser };
