import { getUsers, updateUserStatus, deleteUser } from '../models/user.js';

export const fetchUsers = async (req, res) => {
    try {
        const users = await getUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

export const blockUsers = async (req, res) => {
    await updateUserStatus(req.body.userIds, 'blocked');
    res.json({ message: 'Users blocked' });
};

export const unblockUsers = async (req, res) => {
    await updateUserStatus(req.body.userIds, 'active');
    res.json({ message: 'Users unblocked' });
};

export const deleteUsers = async (req, res) => {
    await deleteUser(req.body.userIds);
    res.json({ message: 'Users deleted' });
};
