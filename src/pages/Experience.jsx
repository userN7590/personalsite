export default function Experience() {
  return (
    <>
      <h1 className="page-title"><span className="t">Experience</span></h1>

      <section>
        <div className="xp">
          <span className="when">May 2025 — Aug 2025</span>
          <div className="role">Machine Learning Intern</div>
          <div className="org">Ohio Supercomputer Center</div>
          <ul>
            <li>Build end-to-end ML workflows &mdash; ingestion, transformation, modeling, evaluation.</li>
            <li>Use hypothesis testing and statistical analysis to validate how models actually behave.</li>
            <li>Design anomaly-detection and clustering systems to find patterns in messy data.</li>
          </ul>
        </div>

        <div className="xp">
          <span className="when">Nov 2025 — present</span>
          <div className="role">Founder &amp; Full-Stack Engineer</div>
          <div className="org">WordLoot</div>
          <ul>
            <li>Designed prediction and outcome-evaluation systems for a probabilistic game environment.</li>
            <li>Analyzed user-interaction and event data to drive scoring and weighting logic.</li>
            <li>Evaluated system behavior with simulation and expected-value analysis.</li>
          </ul>
        </div>

        <div className="xp">
          <span className="when">ongoing</span>
          <div className="role">Airbnb Host &amp; Operations Manager</div>
          <div className="org">Short-term rentals · 5.0&#9733; rating</div>
          <ul>
            <li>Run guest operations end-to-end &mdash; communication, logistics, issue resolution.</li>
            <li>Hold a consistent 5.0&#9733; rating through structured messaging and fast response.</li>
            <li>Built backend processes for scheduling, cleaning coordination, and pricing.</li>
          </ul>
        </div>

        <p style={{ marginTop: '1.4rem' }}>
          Alongside the software work, I&rsquo;ve done the real operational side of real estate:
          rentals, Airbnb operations, maintenance, tenant and guest communication, turnovers, and
          hands-on repair and construction context. I understand how these businesses actually run
          &mdash; which is most of the reason the software I build is any good.
        </p>
        <p className="muted" style={{ fontSize: '15px' }}>
          Education &mdash; A.S. Computer Science, Cuyahoga Community College (2026).
          B.S. Computer Science, Cleveland State University (2028).
        </p>
      </section>
    </>
  )
}
