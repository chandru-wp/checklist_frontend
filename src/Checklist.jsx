import axios from "axios";
import { useState } from "react";

export default function Checklist() {
  const [tasksWorked, setTasksWorked] = useState("");
  const token = localStorage.getItem("token");

  const submitChecklist = async () => {
    await axios.post(
      "http://localhost:5000/api/checklist",
      {
        items: [
          { title: "No of Tasks Worked", response: tasksWorked }
        ]
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    alert("Checklist submitted");
  };

  return (
    <div className="p-6">
      <input className="border p-2" placeholder="No of Tasks Worked"
        onChange={e=>setTasksWorked(e.target.value)} />
      <button onClick={submitChecklist} className="ml-2 bg-green-600 text-white p-2 rounded">
        Submit
      </button>
    </div>
  );
}
