import React, { useState, useEffect } from 'react';
import API from '../services/api';

function Reservations() {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const res = await API.get('/reservations');
      setReservations(res.data);
    };
    fetch();
  }, []);

  return (
    <div className="container mt-4">
      <h2>📅 Réservations</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Client</th>
            <th>Véhicule</th>
            <th>Dates</th>
            <th>Prix</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map(r => (
            <tr key={r._id}>
              <td>{r.client.name}</td>
              <td>{r.vehicle?.brand} {r.vehicle?.model}</td>
              <td>{new Date(r.startDate).toLocaleDateString()} → {new Date(r.endDate).toLocaleDateString()}</td>
              <td>{r.totalPrice} €</td>
              <td>
                <span className={`badge ${
                  r.status === 'confirmed' ? 'bg-info' :
                  r.status === 'in progress' ? 'bg-warning text-dark' :
                  r.status === 'completed' ? 'bg-success' : 'bg-danger'
                }`}>
                  {r.status === 'confirmed' ? 'Confirmée' :
                   r.status === 'in progress' ? 'En cours' :
                   r.status === 'completed' ? 'Terminée' : 'Annulée'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Reservations;