import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3000/students').then((res) => setStudents(res.data));
  }, []);

  const fetchCourses = (id) => {
    axios.get(`http://localhost:3000/students/${id}/courses`).then((res) => setCourses(res.data));
  };

  const handleRegister = () => {
    axios
      .post('http://localhost:3000/register', {
        student_id: selectedStudent,
        course_id: selectedCourse,
      })
      .then(() => setMessage('✅ Registered successfully!'))
      .catch(() => setMessage('❌ Registration failed. Maybe already registered.'));
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Student Course Registration</h1>

      <div className="mb-4">
        <label className="block mb-1">Select Student:</label>
        <select
          onChange={(e) => {
            const id = e.target.value;
            setSelectedStudent(id);
            fetchCourses(id);
          }}
          className="w-full p-2 border rounded"
        >
          <option value="">-- Choose Student --</option>
          {students.map((s) => (
            <option key={s.student_id} value={s.student_id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {courses.length > 0 && (
        <div className="mb-4">
          <h2 className="font-semibold">Current Courses:</h2>
          <ul className="list-disc pl-5">
            {courses.map((c, i) => (
              <li key={i}>{c.title}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mb-4">
        <label className="block mb-1">Enter Course ID to Register:</label>
        <input
          type="number"
          className="w-full p-2 border rounded"
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
        />
      </div>

      <button
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        onClick={handleRegister}
      >
        Register
      </button>

      {message && <p className="mt-4 text-lg">{message}</p>}
    </div>
  );
}

export default App;
