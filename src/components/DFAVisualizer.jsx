import './DFAVisualizer.css';

const DFAVisualizer = ({ currentState, lastTransition }) => {
    const states = [
        { id: 'q0', name: 'Lobby', x: 160, y: 50, isFinal: false },
        { id: 'q1', name: 'Pilih Kursi', x: 160, y: 120, isFinal: false },
        { id: 'q2', name: 'Validasi Data', x: 160, y: 190, isFinal: false },
        { id: 'q3', name: 'Input PIN', x: 160, y: 260, isFinal: false },
        { id: 'q4', name: 'Tiket Terbit', x: 160, y: 330, isFinal: true },
    ];

    const transitions = [
        // q0 -> q1 (garis lurus ke bawah)
        { from: 'q0', to: 'q1', label: 'select_movie', path: 'M 160 65 L 160 105' },
        // q1 -> q2 (garis lurus ke bawah)
        { from: 'q1', to: 'q2', label: 'confirm_seat', path: 'M 160 135 L 160 175' },
        // q1 -> q0 (back - kembali ke lobby)
        { from: 'q1', to: 'q0', label: 'back', path: 'M 145 110 Q 100 85 145 60', dashed: true },
        // q2 -> q2 (email_invalid loop - kanan)
        { from: 'q2', to: 'q2', label: 'email_invalid', path: 'M 180 185 Q 220 190 180 200', loop: true },
        // q2 -> q3 (garis lurus ke bawah)
        { from: 'q2', to: 'q3', label: 'data_valid', path: 'M 160 205 L 160 245' },
        // q2 -> q1 (back - kembali ke pemilihan kursi)
        { from: 'q2', to: 'q1', label: 'back', path: 'M 175 180 Q 220 155 175 130', dashed: true },
        // q3 -> q3 (pin_invalid loop - kiri)
        { from: 'q3', to: 'q3', label: 'pin_invalid', path: 'M 140 255 Q 100 260 140 270', loop: true },
        // q3 -> q4 (garis lurus ke bawah)
        { from: 'q3', to: 'q4', label: 'pin_valid', path: 'M 160 275 L 160 315' },
        // q3 -> q2 (back - lengkung kiri)
        { from: 'q3', to: 'q2', label: 'back', path: 'M 145 250 Q 80 220 145 200', dashed: true },
        // q3 -> q0 (back - kembali ke lobby)
        { from: 'q3', to: 'q0', label: 'back', path: 'M 145 250 Q 50 150 145 60', dashed: true },
        // q4 -> q0 (back - reset ke lobby)
        { from: 'q4', to: 'q0', label: 'back', path: 'M 145 320 Q 30 185 145 60', dashed: true },
    ];

    const getStateColor = (stateId) => {
        if (stateId === currentState) {
            if (stateId === 'q4') return '#00FFFF'; // Cyan for final
            if (stateId === 'q3') return '#FFFF00'; // Yellow for PIN input
            if (stateId === 'q2') return '#FFA500'; // Orange for validation
            return '#00FF00'; // Green for active
        }
        return '#666666'; // Gray for inactive
    };

    const isTransitionActive = (from, to, label) => {
        if (!lastTransition) return false;
        return lastTransition.from === from &&
            lastTransition.to === to &&
            lastTransition.input === label;
    };

    return (
        <div className="dfa-visualizer">
            <div className="dfa-header">
                <h2>DFA STATE MACHINE</h2>
                <p className="dfa-subtitle">Deterministic Finite Automata</p>
            </div>

            <svg className="dfa-diagram" viewBox="0 0 320 380">
                {/* Draw transitions first (behind nodes) */}
                {transitions.map((trans, idx) => {
                    const isActive = isTransitionActive(trans.from, trans.to, trans.label);

                    // Calculate label positions based on transition
                    let labelX = 160;
                    let labelY = 100;

                    // Custom positions for each transition to avoid overlap
                    if (trans.from === 'q0' && trans.to === 'q1') {
                        labelX = 175; labelY = 85;
                    } else if (trans.from === 'q1' && trans.to === 'q2') {
                        labelX = 175; labelY = 155;
                    } else if (trans.from === 'q1' && trans.to === 'q0' && trans.dashed) {
                        labelX = 115; labelY = 80;
                    } else if (trans.from === 'q2' && trans.to === 'q2' && trans.loop) {
                        labelX = 210; labelY = 192;
                    } else if (trans.from === 'q2' && trans.to === 'q3') {
                        labelX = 175; labelY = 225;
                    } else if (trans.from === 'q2' && trans.to === 'q1' && trans.dashed) {
                        labelX = 200; labelY = 155;
                    } else if (trans.from === 'q3' && trans.to === 'q3' && trans.loop) {
                        labelX = 110; labelY = 262;
                    } else if (trans.from === 'q3' && trans.to === 'q4') {
                        labelX = 175; labelY = 295;
                    } else if (trans.from === 'q3' && trans.to === 'q2' && trans.dashed) {
                        labelX = 105; labelY = 225;
                    } else if (trans.from === 'q3' && trans.to === 'q0' && trans.dashed) {
                        labelX = 75; labelY = 155;
                    } else if (trans.from === 'q4' && trans.to === 'q0' && trans.dashed) {
                        labelX = 60; labelY = 190;
                    }

                    return (
                        <g key={idx}>
                            <path
                                d={trans.path}
                                fill="none"
                                stroke={isActive ? '#E60012' : '#444444'}
                                strokeWidth={isActive ? '3' : '2'}
                                strokeDasharray={trans.dashed ? '5,5' : '0'}
                                markerEnd="url(#arrowhead)"
                                className={isActive ? 'glow' : ''}
                            />
                            <text
                                x={labelX}
                                y={labelY}
                                fill={isActive ? '#E60012' : '#AAAAAA'}
                                fontSize="9"
                                fontFamily="Courier New"
                                textAnchor="middle"
                            >
                                {trans.label}
                            </text>
                        </g>
                    );
                })}

                {/* Arrow marker definition */}
                <defs>
                    <marker
                        id="arrowhead"
                        markerWidth="10"
                        markerHeight="10"
                        refX="9"
                        refY="3"
                        orient="auto"
                    >
                        <polygon points="0 0, 10 3, 0 6" fill="#E60012" />
                    </marker>
                </defs>

                {/* Draw state nodes */}
                {states.map((state) => (
                    <g key={state.id}>
                        <circle
                            cx={state.x}
                            cy={state.y}
                            r="20"
                            fill={state.id === currentState ? getStateColor(state.id) : '#000000'}
                            stroke={getStateColor(state.id)}
                            strokeWidth="3"
                            className={state.id === currentState ? 'pulse' : ''}
                        />
                        {state.isFinal && (
                            <circle
                                cx={state.x}
                                cy={state.y}
                                r="16"
                                fill="none"
                                stroke={getStateColor(state.id)}
                                strokeWidth="2"
                            />
                        )}
                        <text
                            x={state.x}
                            y={state.y + 5}
                            fill="#000000"
                            fontSize="14"
                            fontWeight="bold"
                            textAnchor="middle"
                        >
                            {state.id}
                        </text>
                        <text
                            x={state.x + 40}
                            y={state.y + 5}
                            fill="#FFFFFF"
                            fontSize="11"
                            fontFamily="Courier New"
                        >
                            {state.name}
                        </text>
                    </g>
                ))}
            </svg>

            <div className="dfa-info">
                <div className="dfa-section">
                    <h3>Definisi 5-Tuple</h3>
                    <div className="tuple-content">
                        <p><strong>Q</strong> = {'{q0, q1, q2, q3, q4}'}</p>
                        <p><strong>Σ</strong> = {'{pilih_film, konfirmasi_kursi, email_invalid, data_valid, pin_valid, pin_invalid, back}'}</p>
                        <p><strong>δ</strong> = Fungsi Transisi</p>
                        <p><strong>q₀</strong> = q0 (Lobby)</p>
                        <p><strong>F</strong> = {'{q4}'}</p>
                    </div>
                </div>

                <div className="dfa-section">
                    <h3>Tabel Transisi δ</h3>
                    <div className="transition-table-container">
                        <table className="transition-table">
                            <thead>
                                <tr>
                                    <th>State</th>
                                    <th>select_movie</th>
                                    <th>confirm_seat</th>
                                    <th>email_invalid</th>
                                    <th>data_valid</th>
                                    <th>pin_invalid</th>
                                    <th>pin_valid</th>
                                    <th>back</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className={currentState === 'q0' ? 'current-row' : ''}>
                                    <td className="state-cell">q0</td>
                                    <td className={isTransitionActive('q0', 'q1', 'select_movie') ? 'active-cell' : ''}>q1</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>-</td>
                                </tr>
                                <tr className={currentState === 'q1' ? 'current-row' : ''}>
                                    <td className="state-cell">q1</td>
                                    <td>-</td>
                                    <td className={isTransitionActive('q1', 'q2', 'confirm_seat') ? 'active-cell' : ''}>q2</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td className={isTransitionActive('q1', 'q0', 'back') ? 'active-cell' : ''}>q0</td>
                                </tr>
                                <tr className={currentState === 'q2' ? 'current-row' : ''}>
                                    <td className="state-cell">q2</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td className={isTransitionActive('q2', 'q2', 'email_invalid') ? 'active-cell' : ''}>q2</td>
                                    <td className={isTransitionActive('q2', 'q3', 'data_valid') ? 'active-cell' : ''}>q3</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td className={isTransitionActive('q2', 'q1', 'back') ? 'active-cell' : ''}>q1</td>
                                </tr>
                                <tr className={currentState === 'q3' ? 'current-row' : ''}>
                                    <td className="state-cell">q3</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td className={isTransitionActive('q3', 'q3', 'pin_invalid') ? 'active-cell' : ''}>q3</td>
                                    <td className={isTransitionActive('q3', 'q4', 'pin_valid') ? 'active-cell' : ''}>q4</td>
                                    <td className={isTransitionActive('q3', 'q2', 'back') ? 'active-cell' : ''}>q2</td>
                                    <td className={isTransitionActive('q3', 'q0', 'back') ? 'active-cell' : ''}>q0</td>
                                </tr>
                                <tr className={currentState === 'q4' ? 'current-row' : ''}>
                                    <td className="state-cell">q4</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td className={isTransitionActive('q4', 'q0', 'back') ? 'active-cell' : ''}>q0</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="dfa-section">
                    <h3>State Saat Ini</h3>
                    <div className="current-state-display">
                        <span className="state-badge" style={{ background: getStateColor(currentState) }}>
                            {currentState}
                        </span>
                        <span className="state-name">
                            {states.find(s => s.id === currentState)?.name}
                        </span>
                    </div>
                </div>

                <div className="dfa-section">
                    <h3>Aturan Grammar</h3>
                    <div className="grammar-content">
                        <p>S → pilih_film A</p>
                        <p>A → konfirmasi_kursi B | back S</p>
                        <p>B → email_invalid B | data_valid C | back A</p>
                        <p>C → pin_invalid C | pin_valid D | back B | back S</p>
                        <p>D → back S | ε</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DFAVisualizer;
