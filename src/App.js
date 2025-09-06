import React, { useState, useEffect } from "react";
import "./App.css";

const API_BASE = "https://ganesh-backend.onrender.com";

function App() {
  const [page, setPage] = useState("dashboard");
  const [expenses, setExpenses] = useState([]);
  const [members, setMembers] = useState([]);
  const [item, setItem] = useState("");
  const [amount, setAmount] = useState("");
  const [name, setName] = useState("");
  const [contribution, setContribution] = useState("");
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAllMembers, setShowAllMembers] = useState(false);
  const [expenseFile, setExpenseFile] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/expenses`).then(res => res.json()).then(setExpenses);
    fetch(`${API_BASE}/members`).then(res => res.json()).then(setMembers);
  }, []);

  // Add Expense (with optional file upload)
  const addExpense = async () => {
    let expenseData = { item, amount };
    // File upload is optional and not sent to backend unless implemented
    if (expenseFile) {
      // You can implement file upload logic here if backend supports it
      // For now, just ignore the file to avoid deployment issues
    }
    await fetch(`${API_BASE}/expenses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(expenseData)
    });
    setExpenses([...expenses, expenseData]);
    setItem(""); setAmount(""); setExpenseFile(null); setShowAddExpense(false);
  };

  // Add Member
  const addMember = async () => {
    const memberData = { name, amount: contribution };
    await fetch(`${API_BASE}/members`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(memberData)
    });
    setMembers([...members, memberData]);
    setName(""); setContribution("");
  };

  // UI Components
  const Navbar = () => (
    <nav className="navbar">
      <span className="brand">Ganesh Finance App</span>
      <button className={page==="dashboard"?"active":""} onClick={()=>setPage("dashboard")}>Dashboard</button>
      <button className={page==="members"?"active":""} onClick={()=>setPage("members")}>Members</button>
      <button className={page==="expenses"?"active":""} onClick={()=>setPage("expenses")}>Expenses</button>
      <button className={page==="pictures"?"active":""} onClick={()=>setPage("pictures")}>Pictures</button>
    </nav>
  );

  const Dashboard = () => (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <div className="stats">
        <div className="stat-card">
          <span>Total Expenses</span>
          <b>₹{expenses.reduce((s,e)=>s+Number(e.amount),0)}</b>
        </div>
        <div className="stat-card">
          <span>Total Contributions</span>
          <b>₹{members.reduce((s,m)=>s+Number(m.amount),0)}</b>
        </div>
        <div className="stat-card">
          <span>Balance</span>
          <b>₹{
            members.reduce((s,m)=>s+Number(m.amount),0) -
            expenses.reduce((s,e)=>s+Number(e.amount),0)
          }</b>
        </div>
      </div>
    </div>
  );

  const Members = () => (
    <div className="members-page">
      <h2>Members</h2>
      <div className="form-row">
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Name" />
        <input value={contribution} onChange={e=>setContribution(e.target.value)} placeholder="Amount" type="number" />
        <button onClick={addMember}>Add</button>
        <button onClick={()=>setShowAllMembers(!showAllMembers)}>
          {showAllMembers ? "Hide All" : "View All Members"}
        </button>
      </div>
      {showAllMembers && (
        <div className="members-list">
          <h3>All Members</h3>
          <ul>
            {members.map((m,i)=><li key={i}>{m.name} - ₹{m.amount}</li>)}
          </ul>
        </div>
      )}
    </div>
  );

  const Expenses = () => (
    <div className="expenses-page">
      <h2>Expenses</h2>
      <button className="add-expense-btn" onClick={()=>setShowAddExpense(!showAddExpense)}>
        {showAddExpense ? "Cancel" : "Add Expense"}
      </button>
      {showAddExpense && (
        <div className="form-row">
          <input value={item} onChange={e=>setItem(e.target.value)} placeholder="Item Name" />
          <input value={amount} onChange={e=>setAmount(e.target.value)} placeholder="Amount" type="number" />
          <input type="file" onChange={e=>setExpenseFile(e.target.files[0])} style={{maxWidth:180}} />
          <button onClick={addExpense}>Save</button>
        </div>
      )}
      <div className="expenses-list">
        <h3>All Expenses</h3>
        <ul>
          {expenses.map((e,i)=><li key={i}>{e.item} - ₹{e.amount}</li>)}
        </ul>
      </div>
    </div>
  );

  const Pictures = () => (
    <div className="pictures-page">
      <h2>Pictures</h2>
      <p style={{color:"#888"}}>Picture gallery coming soon!</p>
    </div>
  );

  return (
    <div className="container fancy-bg">
      <Navbar />
      <main>
        {page === "dashboard" && <Dashboard />}
        {page === "members" && <Members />}
        {page === "expenses" && <Expenses />}
        {page === "pictures" && <Pictures />}
      </main>
    </div>
  );
}

export default App;
