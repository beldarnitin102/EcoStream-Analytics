function Header() {
  return (
    <header className="header">

      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span>Main Hub</span>
        <span>›</span>
        <strong>Factory Dashboard</strong>
      </div>

      <div className="header-right">

        {/* Search */}
        <div className="search">
          <span>⌕</span>

          <input
            type="text"
            placeholder="Search metrics..."
          />
        </div>

        {/* Notification */}
        <button className="notification">
          ♧
        </button>

        {/* Profile */}
        <div className="profile">

          <div className="profile-avatar">
            N
          </div>

          <div>
            <strong>Nitin</strong>
            <small>ADMIN</small>
          </div>

        </div>

      </div>

    </header>
  );
}

export default Header;