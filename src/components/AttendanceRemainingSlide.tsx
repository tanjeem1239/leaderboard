import { useAttendanceLeaderboard } from '@/hooks/useAttendanceLeaderboard';

function getHealthScoreColor(score: number): string {
  if (score >= 80) return '#4ade80';
  if (score >= 60) return '#facc15';
  return '#ef4444';
}

export default function AttendanceRemainingSlide() {
  const start = '2025-01-01';
  const end = '2025-05-30';
  
  const { data: attendance, error } = useAttendanceLeaderboard({
    startDate: start,
    endDate: end,
  });

  if (error) {
    return (
      <div className="slide attendance-remaining-slide">
        <h1 className="slide-title">Attendance Rankings</h1>
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  if (!attendance || attendance.length === 0) {
    return (
      <div className="slide attendance-remaining-slide">
        <h1 className="slide-title">Attendance Rankings</h1>
        <div className="no-data">No data available</div>
      </div>
    );
  }

  // Get SBUs ranked 4 and below
  const remaining = attendance.slice(3);

  if (remaining.length === 0) {
    return null;
  }

  return (
    <div className="slide attendance-remaining-slide">
      <h1 className="slide-title animate-fade-in">
        Attendance Rankings <span className="title-period">Positions 4-{attendance.length}</span>
      </h1>

      <div className="rankings-grid animate-slide-up">
        {remaining.map((record, index) => (
          <div 
            key={record.sbu_id} 
            className="ranking-card"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="ranking-card-header">
              <div className="ranking-number">#{record.rank || (index + 4)}</div>
              <div className="ranking-sbu-name">{record.sbu_name}</div>
            </div>
            
            <div className="ranking-card-stats">
              <div className="ranking-stat-item">
                <div className="ranking-stat-icon">💯</div>
                <div className="ranking-stat-details">
                  <div 
                    className="ranking-stat-value"
                    style={{ color: getHealthScoreColor(record.health_score || 0) }}
                  >
                    {record.health_score?.toFixed(1)}%
                  </div>
                  <div className="ranking-stat-label">Health Score</div>
                </div>
              </div>

              <div className="ranking-stat-item">
                <div className="ranking-stat-icon">🕒</div>
                <div className="ranking-stat-details">
                  <div className="ranking-stat-value">{record.avg_worked_hours}h</div>
                  <div className="ranking-stat-label">Avg Hours</div>
                </div>
              </div>

              <div className="ranking-stat-item">
                <div className="ranking-stat-icon">⚠️</div>
                <div className="ranking-stat-details">
                  <div 
                    className="ranking-stat-value"
                    style={{ color: record.employees_with_issues > 0 ? '#ef4444' : '#4ade80' }}
                  >
                    {record.employees_with_issues}
                  </div>
                  <div className="ranking-stat-label">Issues</div>
                </div>
              </div>

              <div className="ranking-stat-item">
                <div className="ranking-stat-icon">👥</div>
                <div className="ranking-stat-details">
                  <div className="ranking-stat-value">{record.total_employees}</div>
                  <div className="ranking-stat-label">Employees</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
