import React, { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import API from '../services/api';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

function GlobalDashboard() {
  const [summary, setSummary] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [upcomingMaintenances, setUpcomingMaintenances] = useState([]);
  const [upcomingRenewals, setUpcomingRenewals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, reservationsRes, maintRes, renewalsRes] = await Promise.all([
          API.get('/analytics/summary'),
          API.get('/reservations?status=in progress'),
          API.get('/maintenance/upcoming'),
          API.get('/renewals?upcoming=30')
        ]);

        setSummary(summaryRes.data);
        setReservations(reservationsRes.data);
        setUpcomingMaintenances(maintRes.data);
        setUpcomingRenewals(renewalsRes.data);
      } catch (err) {
        console.error("Erreur chargement données", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-center mt-5">Chargement du tableau de bord...</div>;
  if (!summary) return <div>Erreur de chargement</div>;

  const chartData = {
    labels: ['Occupation', 'Revenus', 'Coûts'],
    datasets: [
      {
         [
           summary.global.occupationRate,
           summary.vehiclesStats.reduce((a, b) => a + b.revenue, 0).toFixed(0),
           summary.vehiclesStats.reduce((a, b) => a + b.maintenanceCost, 0).toFixed(0)
         ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 99, 132, 0.6)'
        ]
      }
    ]
  };

  return (
    <div className="container-fluid mt-4">
      <h2>📊 Tableau de bord global</h2>

      <div className="row mb-4 text-center">
        <div className="col-sm-6 col-md-3">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <h6>Véhicules</h6>
              <p className="mb-0">{summary.global.totalVehicles}</p>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-md-3">
          <div className="card bg-info text-white">
            <div className="card-body">
              <h6>Occupation</h6>
              <p className="mb-0">{summary.global.occupationRate}%</p>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-md-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <h6>Revenus</h6>
              <p className="mb-0">{summary.vehiclesStats.reduce((a, b) => a + b.revenue, 0).toFixed(0)} €</p>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-md-3">
          <div className="card bg-danger text-white">
            <div className="card-body">
              <h6>Bénéfice</h6>
              <p className="mb-0">{summary.vehiclesStats.reduce((a, b) => a + b.profitability, 0).toFixed(0)} €</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card mb-4">
            <div className="card-body">
              <h5>📈 Synthèse financière</h5>
              <Bar data={chartData} options={{ responsive: true }} />
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-4">
          <div className="card">
            <div className="card-header"><strong>🚗 Réservations en cours</strong></div>
            <ul className="list-group list-group-flush">
              {reservations.length === 0 ? (
                <li className="list-group-item text-muted">Aucune location en cours</li>
              ) : (
                reservations.slice(0, 5).map(r => (
                  <li key={r._id} className="list-group-item">
                    <small>{r.vehicle?.brand} {r.vehicle?.model}</small><br />
                    <strong>{r.client.name}</strong>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card">
            <div className="card-header"><strong>🔧 Prochains entretiens</strong></div>
            <ul className="list-group list-group-flush">
              {upcomingMaintenances.length === 0 ? (
                <li className="list-group-item text-muted">Aucun entretien prévu</li>
              ) : (
                upcomingMaintenances.slice(0, 5).map(m => (
                  <li key={m._id} className="list-group-item">
                    <small>{m.type}</small><br />
                    <strong>{m.vehicle?.brand} {m.vehicle?.model}</strong>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card">
            <div className="card-header"><strong>🔖 Renouvellements d’assurance</strong></div>
            <ul className="list-group list-group-flush">
              {upcomingRenewals.length === 0 ? (
                <li className="list-group-item text-muted">Aucun renouvellement prévu</li>
              ) : (
                upcomingRenewals.slice(0, 5).map(r => (
                  <li key={r.insurance._id} className="list-group-item">
                    <small>{r.insurance.type}</small><br />
                    <strong>{r.insurance.vehicle?.brand} {r.insurance.vehicle?.model}</strong>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GlobalDashboard;