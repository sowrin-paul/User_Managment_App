import pool from '../config/db.js';

export const getUsers = async () => {
    const { rows } = await pool.query('SELECT * FROM users ORDER BY last_login DESC');
    return rows;
};

export const updateUserStatus = async (userIds, status) => {
    await pool.query('UPDATE users SET status = $1 WHERE id = ANY($2)', [status, userIds]);
};

export const deleteUser = async (userIds) => {
    await pool.query('DELETE FROM users WHERE id = ANY($1)', [userIds]);
};
