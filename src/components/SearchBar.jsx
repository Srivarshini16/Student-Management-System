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
        background: "white",
        padding: "24px",
        borderRadius: "16px",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        marginBottom: "32px",
        border: "1px solid #f1f5f9"
    },
    title: {
        marginBottom: "16px",
        color: "#0f172a",
        fontSize: "18px",
        fontWeight: "700"
    },
    row: {
        display: "flex",
        gap: "12px",
        flexWrap: "wrap"
    },
    input: {
        flex: 1,
        padding: "10px 16px",
        border: "1px solid #e2e8f0",
        borderRadius: "10px",
        fontSize: "14px",
        minWidth: "200px",
        backgroundColor: "#f8fafc",
        outline: "none"
    },
    btnSearch: {
        padding: "10px 24px",
        background: "#2563eb",
        color: "white",
        border: "none",
        borderRadius: "10px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "600",
        transition: "background-color 0.2s"
    },
    btnReset: {
        padding: "10px 24px",
        background: "#f1f5f9",
        color: "#475569",
        border: "none",
        borderRadius: "10px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "600",
        transition: "background-color 0.2s"
    }
};
