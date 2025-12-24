export function HomePage() {
  return (
    <div className="page">
      <header className="pageHeader">
        <div>
          <h1 className="pageTitle">Home</h1>
          <p className="pageSubtitle">
            Manage your loans and applications in one place using AI-Powered Loan Eligibility Assistant
          </p>
        </div>
      </header>

      <section className="section">
        <h2 className="sectionTitle">Quick actions</h2>
        <div className="cardGrid">
          <div className="card">
            <div className="cardTitle">Chat</div>
            <div className="cardBody">Ask questions and get help.</div>
          </div>
          <div className="card">
            <div className="cardTitle">Apply for Loan</div>
            <div className="cardBody">Start a new loan application.</div>
          </div>
          <div className="card">
            <div className="cardTitle">Check Application Status</div>
            <div className="cardBody">Track progress of an application.</div>
          </div>
        </div>
      </section>
    </div>
  )
}
