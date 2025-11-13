import { useBragDocumentCompleteness } from '@/hooks/useBragDocumentCompleteness';

function getCompletionColor(percentage: number): string {
  if (percentage >= 80) return '#4ade80';
  if (percentage >= 60) return '#facc15';
  return '#ef4444';
}

export default function BragDocumentSlide() {
  // Use May 2025 to match the date range with data
  const year = 2025;
  const month = 5; // May
  
  const { data: brags, error } = useBragDocumentCompleteness({
    year,
    month,
  });

  if (error) {
    return (
      <div className="slide brag-slide">
        <h1 className="slide-title">🏆 SBU Brag Document Completion</h1>
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  const hasData = Array.isArray(brags) && brags.length > 0;

  if (!hasData) {
    return (
      <div className="slide brag-slide">
        <h1 className="slide-title">🏆 SBU Brag Document Completion</h1>
        <div className="no-data">
          No brag document data available for {month}/{year}
        </div>
      </div>
    );
  }

  // Calculate organizational overview stats
  const totalEmployees = brags.reduce((sum, record) => sum + record.total_active_employees, 0);
  const totalSubmitted = brags.reduce((sum, record) => sum + record.submitted_employees, 0);
  const totalPending = brags.reduce((sum, record) => sum + record.not_submitted_employees, 0);
  const avgCompletion = brags.reduce((sum, record) => sum + record.completion_percentage, 0) / brags.length;

  const topThree = brags.slice(0, 3);

  return (
    <div className="slide brag-slide">
      <h1 className="slide-title animate-fade-in">
        Brag Document Completion <span className="title-period">May 2025</span>
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
          <div className="overview-icon">✍️</div>
          <div className="overview-stat-content">
            <div className="overview-value">{totalSubmitted}</div>
            <div className="overview-label">Submitted</div>
          </div>
        </div>
        <div className="overview-stat">
          <div className="overview-icon">⌛</div>
          <div className="overview-stat-content">
            <div className="overview-value">{totalPending}</div>
            <div className="overview-label">Pending</div>
          </div>
        </div>
        <div className="overview-stat">
          <div className="overview-icon">📈</div>
          <div className="overview-stat-content">
            <div className="overview-value">{avgCompletion.toFixed(1)}%</div>
            <div className="overview-label">Avg Completion</div>
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
                <span className="stat-value">
                  {topThree[1].completion_percentage.toFixed(1)}%
                </span>
                <span className="stat-label">Completion</span>
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
                <span className="stat-value">
                  {topThree[0].completion_percentage.toFixed(1)}%
                </span>
                <span className="stat-label">Completion</span>
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
                <span className="stat-value">
                  {topThree[2].completion_percentage.toFixed(1)}%
                </span>
                <span className="stat-label">Completion</span>
              </div>
            </div>
            <div className="podium-height podium-height-3"></div>
          </div>
        )}
      </div>
    </div>
  );
}
