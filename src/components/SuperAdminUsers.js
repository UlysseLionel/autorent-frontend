import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Modal, Button, Form } from 'react-bootstrap';

function SuperAdminUsers() {
  const [users, setUsers] = useState([]);
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: 'employee',
    agencyId: '',
    password: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      const [usersRes, agenciesRes] = await Promise.all([
        API.get('/superadmin/users'),
        API.get('/agencies')
      ]);
      setUsers(usersRes.data);
      setAgencies(agenciesRes.data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const openCreateModal = () => {
    setEditingUser(null);
    setForm({ name: '', email: '', role: 'employee', agencyId: '', password: '' });
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setForm({
      name: user.name,
      email: user.email,
      role: user.role,
      agencyId: user.agency?._id || '',
      password: ''
    });
    setShowModal(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await API.put(`/superadmin/users/${editingUser._id}`, form);
      } else {
        await API.post('/superadmin/users', form);
      }
      const res = await API.get('/superadmin/users');
      setUsers(res.data);
      setShowModal(false);
    } catch (err) {
      alert('Erreur lors de l’enregistrement');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cet utilisateur ?')) return;
    try {
      await API.delete(`/superadmin/users/${id}`);
      setUsers(users.filter(u => u._id !== id));
    } catch (err) {
      alert('Erreur lors de la suppression');
    }
  };

  if (loading) return <div className="text-center mt-5">Chargement...</div>;

  return (
    <div className="container-fluid mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>🔐 Gestion des Utilisateurs (Super Admin)</h2>
        <button className="btn btn-success" onClick={openCreateModal}>
          + Nouvel utilisateur
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Agence</th>
              <th>Rôle</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.agency?.name || '–'}</td>
                <td>
                  <span className={`badge ${
                    u.role === 'admin' ? 'bg-primary' :
                    u.role === 'comptable' ? 'bg-warning text-dark' : 'bg-secondary'
                  }`}>
                    {u.role === 'admin' ? 'Admin' :
                     u.role === 'comptable' ? 'Comptable' : 'Employé'}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-primary me-1"
                    onClick={() => openEditModal(u)}
                  >
                    🖊️ Modifier
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(u._id)}
                  >
                    🗑️ Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingUser ? 'Modifier' : 'Créer'} un utilisateur
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Nom</Form.Label>
              <Form.Control
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Rôle</Form.Label>
              <Form.Select
                name="role"
                value={form.role}
                onChange={handleChange}
              >
                <option value="employee">Employé</option>
                <option value="admin">Admin agence</option>
                <option value="comptable">Comptable</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Agence</Form.Label>
              <Form.Select
                name="agencyId"
                value={form.agencyId}
                onChange={handleChange}
                required
              >
                <option value="">Sélectionner une agence</option>
                {agencies.map(a => (
                  <option key={a._id} value={a._id}>
                    {a.name} ({a.city}, {a.country})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mot de passe {editingUser ? '(laisser vide pour ne pas changer)' : ''}</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required={!editingUser}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Annuler
            </Button>
            <Button variant="primary" type="submit">
              {editingUser ? 'Mettre à jour' : 'Créer'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

export default SuperAdminUsers;