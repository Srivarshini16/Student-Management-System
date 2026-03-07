import { useState } from "react";

const DEPARTMENTS = ["CSE", "ECE", "EEE", "MECH", "CIVIL", "IT"];

export default function SearchBar({ onSearch, onReset }) {
    const [search, setSearch] = useState("");
    const [department, setDepartment] = useState("");

    const handleSearch = () => {
        onSearch(search, department);
    };

    const handleReset = () => {
        setSearch("");
        setDepartment("");
        onReset();
    };

    return (
        <div style={styles.card}>
            <h2 style={styles.title}>Search & Filter</h2>
            <div style={styles.row}>
                <input
                    style={styles.input}
                    type="text"
                    placeholder="Search by name or roll number..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <select
                    style={styles.input}
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                >
                    <option value="">All Departments</option>
                    {DEPARTMENTS.map((d) => (
                        <option key={d} value={d}>{d}</option>
                    ))}
                </select>
                <button style={styles.btnSearch} onClick={handleSearch}>
                    Search
                </button>
                <button style={styles.btnReset} onClick={handleReset}>
                    Reset
                </button>
            </div>
        </div>
    );
}

const styles = {
    card: {
        background: "white", padding: "16px", borderRadius: "8px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)", marginBottom: "24px"
    },
    title: { marginBottom: "12px", color: "#444", fontSize: "18px" },
    row: { display: "flex", gap: "12px", flexWrap: "wrap" },
    input: {
        flex: 1, padding: "10px", border: "1px solid #ccc",
        borderRadius: "6px", fontSize: "14px", minWidth: "150px"
    },
    btnSearch: {
        padding: "10px 20px", background: "#2196F3", color: "white",
        border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "14px"
    },
    btnReset: {
        padding: "10px 20px", background: "#888", color: "white",
        border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "14px"
    }
};