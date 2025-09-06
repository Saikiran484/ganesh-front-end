import React, { useState, useEffect } from "react";
import "./App.css";

const API_BASE = "https://ganesh-backend.onrender.com";

function App() {
  const [page, setPage] = useState("members");

  // Members state
  const [members, setMembers] = useState([]);
  const [memberForm, setMemberForm] = useState({ name: "", amount: "" });
  const [showMembers, setShowMembers] = useState(false);
  const [editMemberIdx, setEditMemberIdx] = useState(null);

  // Expenses state
  const [expenses, setExpenses] = useState([]);
  const [expenseForm, setExpenseForm] = useState({ item: "", amount: "", file: null });
  const [showExpenses, setShowExpenses] = useState(false);
  const [editExpenseIdx, setEditExpenseIdx] = useState(null);

  // Pictures state (frontend only)
  const [pictures, setPictures] = useState([]);
  const [pictureFile, setPictureFile] = useState(null);

  // Fetch data on mount
  useEffect(() => {
    fetch(`${API_BASE}/members`).then(res => res.json()).then(setMembers);
    fetch(`${API_BASE}/expenses`).then(res => res.json()).then(setExpenses);
  }, []);

  // --- Members ---
  const handleMemberInput = e => {
    setMemberForm({ ...memberForm, [e.target.name]: e.target.value });
  };

  const addOrEditMember = async () => {
    if (!memberForm.name || !memberForm.amount) return;
    if (editMemberIdx !== null) {
      // Edit (frontend only)
      const updated = [...members];
      updated[editMemberIdx] = { ...memberForm };
      setMembers(updated);
      setEditMemberIdx(null);
    } else {
      // Add (backend)
      const newMember = { name: memberForm.name, amount: memberForm.amount };
      await fetch(`${API_BASE}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMember)
      });
      setMembers([...members, newMember]);
    }
    setMemberForm({ name: "", amount: "" });
  };

  const editMember = idx => {
    setEditMemberIdx(idx);
    setMemberForm(members[idx]);
  };

  const deleteMember = idx => {
    // Frontend only (does not persist)
    setMembers(members.filter((_, i) => i !== idx));
    if (editMemberIdx === idx) setEditMemberIdx(null);
  };

  // --- Expenses ---
  const handleExpenseInput = e => {
    const { name, value, files } = e.target;
    setExpenseForm({
      ...expenseForm,
      [name]: files ? files[0] : value
    });
  };

  const addOrEditExpense = async () => {
    if (!expenseForm.item || !expenseForm.amount) return;
    if (editExpenseIdx !== null) {
      // Edit (frontend only)
      const updated = [...expenses];
      updated[editExpenseIdx] = { ...expenseForm, file: expenseForm.file?.name || "" };
      setExpenses(updated);
      setEditExpenseIdx(null);
    } else {
      // Add (backend, file upload is mocked)
      const newExpense = { item: expenseForm.item, amount: expenseForm.amount, file: expenseForm.file?.name || "" };
      await fetch(`${API_BASE}/expenses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newExpense)
      });
      setExpenses([...expenses, newExpense]);
    }
    setExpenseForm({ item: "", amount: "", file: null });
  };

  const editExpense = idx => {
    setEditExpenseIdx(idx);
    setExpenseForm(expenses[idx]);
  };

  const deleteExpense = idx => {
    // Frontend only (does not persist)
    setExpenses(expenses.filter((_, i) => i !== idx));
    if (editExpenseIdx === idx) setEditExpenseIdx(null);
  };

  // --- Pictures (frontend only) ---
  const handlePictureUpload = e => {
    setPictureFile(e.target.files[0]);
  };

  const addPicture = () => {
    if (pictureFile) {
      const url = URL.createObjectURL(pictureFile);
      setPictures([...pictures, { name: pictureFile.name, url }]);
      setPictureFile(null);
    }
  };

  const deletePicture = idx => {
    setPictures(pictures.filter((_, i) => i !== idx));
  };

  // --- UI Components ---
  const Navbar = () => (
    <nav className="navbar">
      <span className="brand">Ganesh Finance App</span>
      <button className={page==="members"?"active":""} onClick={()=>setPage("members")}>Members</button>
      <button className={page==="expenses"?"active":""} onClick={()=>setPage("expenses")}>Expenses</button>
      <button className={page==="pictures"?"active":""} onClick={()=>setPage("pictures")}>Pictures</button>
    </nav>
  );

  const MembersPage = () => (
    <div>
      <h2>Members</h2>
      <div className="form-row">
        <input
          name="name"
          value={memberForm.name}
          onChange={handleMemberInput}
          placeholder="Name"
        />
        <input
          name="amount"
          value={memberForm.amount}
          onChange={handleMemberInput}
          placeholder="Amount"
          type="number"
        />
        <button onClick={addOrEditMember}>{editMemberIdx !== null ? "Update" : "Add"}</button>
        <button onClick={()=>setShowMembers(!showMembers)}>
          {showMembers ? "Hide Members" : "View Members"}
        </button>
      </div>
      {showMembers && (
        <div className="vertical-list">
          {members.map((m, i) => (
            <div className="list-row" key={i}>
              <span>{m.name}</span>
              <span>₹{m.amount}</span>
              <button className="edit-btn" onClick={()=>editMember(i)}>Edit</button>
              <button className="delete-btn" onClick={()=>deleteMember(i)}>Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const ExpensesPage = () => (
    <div>
      <h2>Expenses</h2>
      <div className="form-row">
        <input
          name="item"
          value={expenseForm.item}
          onChange={handleExpenseInput}
          placeholder="Item Name"
        />
        <input
          name="amount"
          value={expenseForm.amount}
          onChange={handleExpenseInput}
          placeholder="Amount"
          type="number"
        />
        <input
          name="file"
          type="file"
          onChange={handleExpenseInput}
        />
        <button onClick={addOrEditExpense}>{editExpenseIdx !== null ? "Update" : "Add Expense"}</button>
        <button onClick={()=>setShowExpenses(!showExpenses)}>
          {showExpenses ? "Hide Expenses" : "View Expenses"}
        </button>
      </div>
      {showExpenses && (
        <div className="vertical-list">
          {expenses.map((e, i) => (
            <div className="list-row" key={i}>
              <span>{e.item}</span>
              <span>₹{e.amount}</span>
              <span className="file-proof">{e.file ? `📎 ${e.file}` : ""}</span>
              <button className="edit-btn" onClick={()=>editExpense(i)}>Edit</button>
              <button className="delete-btn" onClick={()=>deleteExpense(i)}>Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const PicturesPage = () => (
    <div>
      <h2>Pictures</h2>
      <div className="form-row">
        <input type="file" accept="image/*" onChange={handlePictureUpload} />
        <button onClick={addPicture}>Upload</button>
      </div>
      <div className="pictures-list">
        {pictures.map((pic, i) => (
          <div className="picture-row" key={i}>
            <img src={pic.url} alt={pic.name} />
            <span>{pic.name}</span>
            <button className="delete-btn" onClick={()=>deletePicture(i)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="container fancy-bg">
      <Navbar />
      <main>
        {page === "members" && <MembersPage />}
        {page === "expenses" && <ExpensesPage />}
        {page === "pictures" && <PicturesPage />}
      </main>
    </div>
  );
}

export default App;
