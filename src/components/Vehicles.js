import React, { useState, useEffect } from 'react';
import API from '../services/api';

function Vehicles() {
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const res = await API.get('/vehicles');
      setVehicles(res.data);
    };
    fetch();
  }, []);

  return (
    <div className="container mt-4">
      <h2>🚘 Parc Automobile</h2>
      <div className="row">
        {vehicles.map(v => (
          <div className="col-md-4 mb-4" key={v._id}>
            <div className="card">
              {v.image ? (
                <img src={v.image} alt="voiture" className="card-img-top" style={{ height: '180px', objectFit: 'cover' }} />
              ) : (
                <div className="bg-light text-center py-5">📷</div>
              )}
              <div className="card-body">
                <h5 className="card-title">{v.brand} {v.model}</h5>
                <p>
                  <strong>Immat :</strong> {v.plate}<br />
                  <strong>Km :</strong> {v.km}<br />
                  <strong>Prix/jour :</strong> {v.pricePerDay} €<br />
                  <span className={`badge ${
                    v.status === 'available' ? 'bg-success' :
                    v.status === 'rented' ? 'bg-danger' : 'bg-warning text-dark'
                  }`}>
                    {v.status === 'available' ? 'Disponible' : v.status === 'rented' ? 'Loué' : 'Maintenance'}
                  </span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Vehicles;