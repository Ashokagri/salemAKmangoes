import React from "react";
import "../AdminStyles/AdminFooter.css";

function AdminFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="admin-footer">
      <div className="admin-footer-container">
        <p>&copy; {currentYear} salemAKmangoes Admin Panel. All rights reserved.</p>
        <div className="admin-footer-status">
          <span className="status-dot"></span>
          <span>System Operational</span>
        </div>
      </div>
    </footer>
  );
}

export default AdminFooter;
