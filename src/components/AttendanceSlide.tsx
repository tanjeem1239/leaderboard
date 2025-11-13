import { useAttendanceLeaderboard } from '@/hooks/useAttendanceLeaderboard';

function getHealthScoreColor(score: number): string {
  if (score >= 80) return '#4ade80';
  if (score >= 60) return '#facc15';
  return '#ef4444';
}

export default function AttendanceSlide() {
  // Use January to May 2025 to match data availability
  const start = '2025-01-01';
  const end = '2025-05-30';
  
  const { data: attendance, error } = useAttendanceLeaderboard({
    startDate: start,
    endDate: end,
  });

  if (error) {
    return (
      <div className="slide attendance-slide">
        <h1 className="slide-title">Attendance Leaderboard</h1>
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  if (!attendance || attendance.length === 0) {
    return (
      <div className="slide attendance-slide">
        <h1 className="slide-title">📊 Attendance Health Leaderboard</h1>
        <div className="no-data">No attendance data available for {start} to {end}</div>
      </div>
    );
  }

  // Calculate organizational overview stats
  const totalEmployees = attendance.reduce((sum, record) => sum + record.total_employees, 0);
  const avgHealthScore = attendance.reduce((sum, record) => sum + (record.health_score || 0), 0) / attendance.length;
  const totalIssues = attendance.reduce((sum, record) => sum + record.employees_with_issues, 0);
  const avgWorkHours = attendance.reduce((sum, record) => sum + record.avg_worked_hours, 0) / attendance.length;

  const topThree = attendance.slice(0, 3);

  return (
    <div className="slide attendance-slide">
      <h1 className="slide-title animate-fade-in">
        Attendance Health Leaderboard <span className="title-period">Jan-May 2025</span>
      </h1>
      
      {/* Organizational Overview */}
      <div className="overview-section animate-slide-up">
        <div className="overview-stat">
          <div className="overview-icon">👨‍💼</div>
          <div className="overview-stat-content">
            <div className="overview-value">{totalEmployees}</div>
            <div className="overview-label">Total Employees</div>
          </div>
        </div>
        <div className="overview-stat">
          <div className="overview-icon">💯</div>
          <div className="overview-stat-content">
            <div className="overview-value">{avgHealthScore.toFixed(1)}%</div>
            <div className="overview-label">Avg Health Score</div>
          </div>
        </div>
        <div className="overview-stat">
          <div className="overview-icon">🕒</div>
          <div className="overview-stat-content">
            <div className="overview-value">{avgWorkHours.toFixed(1)}h</div>
            <div className="overview-label">Avg Work Hours</div>
          </div>
        </div>
        <div className="overview-stat">
          <div className="overview-icon">🚨</div>
          <div className="overview-stat-content">
            <div className="overview-value">{totalIssues}</div>
            <div className="overview-label">Total Issues</div>
          </div>
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="podium-container">
        {/* 2nd Place */}
        {topThree[1] && (
          <div className="podium-card podium-2 animate-podium-2">
            <div className="podium-medal">🥈</div>
            <div className="podium-rank">#2</div>
            <div className="podium-name">{topThree[1].sbu_name}</div>
            <div className="podium-stats">
              <div className="podium-stat">
                <span className="stat-value">{topThree[1].avg_worked_hours}h</span>
                <span className="stat-label">Avg Hours</span>
              </div>
            </div>
            <div className="podium-height podium-height-2"></div>
          </div>
        )}

        {/* 1st Place */}
        {topThree[0] && (
          <div className="podium-card podium-1 animate-podium-1">
            <div className="podium-crown">👑</div>
            <div className="podium-medal">🥇</div>
            <div className="podium-rank">#1</div>
            <div className="podium-name">{topThree[0].sbu_name}</div>
            <div className="podium-stats">
              <div className="podium-stat">
                <span className="stat-value">{topThree[0].avg_worked_hours}h</span>
                <span className="stat-label">Avg Hours</span>
              </div>
            </div>
            <div className="podium-height podium-height-1"></div>
          </div>
        )}

        {/* 3rd Place */}
        {topThree[2] && (
          <div className="podium-card podium-3 animate-podium-3">
            <div className="podium-medal">🥉</div>
            <div className="podium-rank">#3</div>
            <div className="podium-name">{topThree[2].sbu_name}</div>
            <div className="podium-stats">
              <div className="podium-stat">
                <span className="stat-value">{topThree[2].avg_worked_hours}h</span>
                <span className="stat-label">Avg Hours</span>
              </div>
            </div>
            <div className="podium-height podium-height-3"></div>
          </div>
        )}
      </div>
    </div>
  );
}
