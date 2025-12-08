import { useState } from 'react';
import './SeatSelection.css';

const SeatSelection = ({ movie, onConfirm, onCancel }) => {
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [showTime, setShowTime] = useState('19:00');

    const SEAT_PRICE = 50000;
    const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
    const seatsPerRow = 8;

    // Simulate some sold seats
    const soldSeats = ['A3', 'A4', 'B5', 'C2', 'C3', 'D6', 'E4'];

    const toggleSeat = (seatId) => {
        if (soldSeats.includes(seatId)) return;

        setSelectedSeats(prev =>
            prev.includes(seatId)
                ? prev.filter(s => s !== seatId)
                : [...prev, seatId]
        );
    };

    const getSeatStatus = (seatId) => {
        if (soldSeats.includes(seatId)) return 'sold';
        if (selectedSeats.includes(seatId)) return 'selected';
        return 'available';
    };

    const totalPrice = selectedSeats.length * SEAT_PRICE;

    const handleConfirm = () => {
        if (selectedSeats.length === 0) {
            alert('Silakan pilih minimal satu kursi!');
            return;
        }
        onConfirm({ seats: selectedSeats, showTime, totalPrice });
    };

    return (
        <div className="seat-selection">
            <div className="halftone-bg"></div>

            <div className="seat-header">
                <h1 className="seat-title">PILIH TARGET ANDA</h1>
                <p className="seat-subtitle">Pemilihan Kursi</p>
            </div>

            <div className="movie-info-bar">
                <h2>{movie.title}</h2>
                <div className="showtime-selector">
                    <label>Jam Tayang:</label>
                    <select value={showTime} onChange={(e) => setShowTime(e.target.value)} className="time-select">
                        <option value="14:00">14:00</option>
                        <option value="17:00">17:00</option>
                        <option value="19:00">19:00</option>
                        <option value="21:00">21:00</option>
                    </select>
                </div>
            </div>

            <div className="theater-container">
                <div className="screen">LAYAR</div>

                <div className="seats-grid">
                    {rows.map(row => (
                        <div key={row} className="seat-row">
                            <span className="row-label">{row}</span>
                            {Array.from({ length: seatsPerRow }, (_, i) => {
                                const seatId = `${row}${i + 1}`;
                                const status = getSeatStatus(seatId);
                                return (
                                    <button
                                        key={seatId}
                                        className={`seat seat-${status}`}
                                        onClick={() => toggleSeat(seatId)}
                                        disabled={status === 'sold'}
                                    >
                                        {i + 1}
                                    </button>
                                );
                            })}
                            <span className="row-label">{row}</span>
                        </div>
                    ))}
                </div>

                <div className="seat-legend">
                    <div className="legend-item">
                        <div className="seat seat-available"></div>
                        <span>Tersedia</span>
                    </div>
                    <div className="legend-item">
                        <div className="seat seat-selected"></div>
                        <span>Dipilih</span>
                    </div>
                    <div className="legend-item">
                        <div className="seat seat-sold"></div>
                        <span>Terjual</span>
                    </div>
                </div>
            </div>

            <div className="booking-summary">
                <div className="summary-content">
                    <div className="selected-seats-info">
                        <strong>Kursi Dipilih:</strong>
                        <span>{selectedSeats.length > 0 ? selectedSeats.join(', ') : 'Belum ada'}</span>
                    </div>
                    <div className="total-price">
                        <strong>Total:</strong>
                        <span className="price-amount">Rp {totalPrice.toLocaleString('id-ID')}</span>
                    </div>
                </div>
                <div className="action-buttons">
                    <button className="p5-button secondary" onClick={onCancel}>
                        KEMBALI
                    </button>
                    <button className="p5-button" onClick={handleConfirm}>
                        KIRIM KARTU PANGGILAN
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SeatSelection;
