export function HomePage() {
  return (
    <div className="page">
      <header className="pageHeader">
        <div>
          <h1 className="pageTitle">Home</h1>
          <p className="pageSubtitle">
            Asses your loan eligibility in seconds using AI-Powered Loan Eligibility Assistant
          </p>
        </div>
      </header>

      <section className="section">
        <h2 className="sectionTitle">Quick actions</h2>
        <div className="cardGrid">
          <div className="card">
            <div className="cardTitle">Chat</div>
            <div className="cardBody">Ask questions and get help related to our various loans products.</div>
          </div>
          <div className="card">
            <div className="cardTitle">Loan Eligibility</div>
            <div className="cardBody">Run an instant eligibility check. No Profile creation required.</div>
          </div>
          <div className="card">
            <div className="cardTitle">Apply for Loan</div>
            <div className="cardBody">Start a new loan application once eligible.</div>
          </div>
          <div className="card">
            <div className="cardTitle">Check Application Status</div>
            <div className="cardBody">Track progress of your application.</div>
          </div>
        </div>
      </section>
    </div>
  )
}
