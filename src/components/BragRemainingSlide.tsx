import { useBragDocumentCompleteness } from '@/hooks/useBragDocumentCompleteness';

function getCompletionColor(percentage: number): string {
  if (percentage >= 80) return '#4ade80';
  if (percentage >= 60) return '#facc15';
  return '#ef4444';
}

export default function BragRemainingSlide() {
  const year = 2025;
  const month = 5; // May
  
  const { data: brags, error } = useBragDocumentCompleteness({
    year,
    month,
  });

  if (error) {
    return (
      <div className="slide brag-remaining-slide">
        <h1 className="slide-title">Brag Document Rankings</h1>
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  const hasData = Array.isArray(brags) && brags.length > 0;

  if (!hasData) {
    return (
      <div className="slide brag-remaining-slide">
        <h1 className="slide-title">Brag Document Rankings</h1>
        <div className="no-data">No data available</div>
      </div>
    );
  }

  // Get SBUs ranked 4 and below
  const remaining = brags.slice(3);

  if (remaining.length === 0) {
    return null;
  }

  return (
    <div className="slide brag-remaining-slide">
      <h1 className="slide-title animate-fade-in">
        Brag Document Rankings <span className="title-period">Positions 4-{brags.length}</span>
      </h1>

      <div className="rankings-grid animate-slide-up">
        {remaining.map((record, index) => (
          <div 
            key={record.sbu_id} 
            className="ranking-card"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="ranking-card-header">
              <div className="ranking-number">#{index + 4}</div>
              <div className="ranking-sbu-name">{record.sbu_name}</div>
            </div>
            
            <div className="ranking-card-stats">
              <div className="ranking-stat-item">
                <div className="ranking-stat-icon">📈</div>
                <div className="ranking-stat-details">
                  <div 
                    className="ranking-stat-value"
                    style={{ color: getCompletionColor(record.completion_percentage) }}
                  >
                    {record.completion_percentage.toFixed(1)}%
                  </div>
                  <div className="ranking-stat-label">Completion</div>
                </div>
              </div>

              <div className="ranking-stat-item">
                <div className="ranking-stat-icon">✅</div>
                <div className="ranking-stat-details">
                  <div className="ranking-stat-value">{record.submitted_employees}</div>
                  <div className="ranking-stat-label">Submitted</div>
                </div>
              </div>

              <div className="ranking-stat-item">
                <div className="ranking-stat-icon">⌛</div>
                <div className="ranking-stat-details">
                  <div 
                    className="ranking-stat-value"
                    style={{ color: record.not_submitted_employees > 0 ? '#ef4444' : '#4ade80' }}
                  >
                    {record.not_submitted_employees}
                  </div>
                  <div className="ranking-stat-label">Pending</div>
                </div>
              </div>

              <div className="ranking-stat-item">
                <div className="ranking-stat-icon">👥</div>
                <div className="ranking-stat-details">
                  <div className="ranking-stat-value">{record.total_active_employees}</div>
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
