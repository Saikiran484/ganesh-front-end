import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [tab, setTab] = useState("dashboard");
  const [expenses, setExpenses] = useState([]);
  const [members, setMembers] = useState([]);
  const [item, setItem] = useState("");
  const [amount, setAmount] = useState("");
  const [name, setName] = useState("");
  const [contribution, setContribution] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:5000/expenses").then(res => res.json()).then(setExpenses);
    fetch("http://127.0.0.1:5000/members").then(res => res.json()).then(setMembers);
  }, []);

  const addExpense = () => {
    fetch("http://127.0.0.1:5000/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ item, amount })
    }).then(() => {
      setExpenses([...expenses, { item, amount }]);
      setItem(""); setAmount("");
    });
  };

  const addMember = () => {
    fetch("http://127.0.0.1:5000/members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, amount: contribution })
    }).then(() => {
      setMembers([...members, { name, amount: contribution }]);
      setName(""); setContribution("");
    });
  };

  return (
    <div className="container">
      <nav>
        <button onClick={() => setTab("dashboard")}>Dashboard</button>
        <button onClick={() => setTab("expenses")}>Expenses</button>
        <button onClick={() => setTab("members")}>Members</button>
      </nav>

      {tab === "dashboard" && (
        <div>
          <h2>Dashboard</h2>
          <p>Total Expenses: ₹{expenses.reduce((s,e)=>s+Number(e.amount),0)}</p>
          <p>Total Contributions: ₹{members.reduce((s,m)=>s+Number(m.amount),0)}</p>
          <p>Balance: ₹{
            members.reduce((s,m)=>s+Number(m.amount),0) -
            expenses.reduce((s,e)=>s+Number(e.amount),0)
          }</p>
        </div>
      )}

      {tab === "expenses" && (
        <div>
          <h2>Expenses</h2>
          <input value={item} onChange={e=>setItem(e.target.value)} placeholder="Item" />
          <input value={amount} onChange={e=>setAmount(e.target.value)} placeholder="Amount" />
          <button onClick={addExpense}>Add</button>
          <ul>
            {expenses.map((e,i)=><li key={i}>{e.item} - ₹{e.amount}</li>)}
          </ul>
        </div>
      )}

      {tab === "members" && (
        <div>
          <h2>Members</h2>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Name" />
          <input value={contribution} onChange={e=>setContribution(e.target.value)} placeholder="Amount" />
          <button onClick={addMember}>Add</button>
          <ul>
            {members.map((m,i)=><li key={i}>{m.name} - ₹{m.amount}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}
export default App;
