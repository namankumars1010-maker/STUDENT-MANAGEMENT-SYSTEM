
let students = JSON.parse(localStorage.getItem("students")) || [];

const $ = id => document.getElementById(id);

function grade(marks) {
    if (marks >= 90) return "A+";
    if (marks >= 80) return "A";
    if (marks >= 70) return "B";
    if (marks >= 60) return "C";
    if (marks >= 50) return "D";
    if (marks >= 40) return "E";
    return "F";
}

function saveData() {
    localStorage.setItem("students", JSON.stringify(students));
}

function displayStudents() {
    const search = $("searchInput").value.toLowerCase().trim();
    const branch = $("branchFilter").value;
    const table = $("studentTable");

    table.innerHTML = "";

    const filtered = students.filter(student => {
        const matchesSearch =
            student.id.toLowerCase().includes(search) ||
            student.name.toLowerCase().includes(search);

        const matchesBranch =
            branch === "all" || student.branch === branch;

        return matchesSearch && matchesBranch;
    });

    $("emptyState").style.display =
        filtered.length ? "none" : "block";

    filtered.forEach(student => {
        const index = students.indexOf(student);
        const g = grade(Number(student.marks));

        const row = document.createElement("tr");

        row.innerHTML = `
            <td><b>${escapeHtml(student.id)}</b></td>
            <td>${escapeHtml(student.name)}</td>
            <td>${escapeHtml(student.branch)}</td>
            <td>${escapeHtml(student.year)}</td>
            <td>${escapeHtml(student.email)}</td>
            <td>${student.marks}</td>
            <td class="grade ${g === "F" ? "fail" : "pass"}">
                ${g}
            </td>
            <td class="actions">
                <button class="edit"
                    onclick="editStudent(${index})">
                    ✏️
                </button>

                <button class="delete"
                    onclick="deleteStudent(${index})">
                    🗑️
                </button>
            </td>
        `;

        table.appendChild(row);
    });

    updateStats();
}

function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    }[character]));
}

function updateStats() {
    $("totalStudents").textContent = students.length;

    const totalMarks = students.reduce(
        (sum, student) => sum + Number(student.marks),
        0
    );

    $("averageMarks").textContent =
        students.length
            ? (totalMarks / students.length).toFixed(1)
            : "0";

    $("passedStudents").textContent =
        students.filter(student =>
            Number(student.marks) >= 40
        ).length;

    $("failedStudents").textContent =
        students.filter(student =>
            Number(student.marks) < 40
        ).length;
}

function openModal(index = null) {

    $("studentForm").reset();

    $("editIndex").value =
        index === null ? "" : index;

    $("modalTitle").textContent =
        index === null
            ? "Add Student"
            : "Edit Student";

    if (index !== null) {

        const student = students[index];

        $("studentId").value = student.id;
        $("studentName").value = student.name;
        $("branch").value = student.branch;
        $("year").value = student.year;
        $("email").value = student.email;
        $("marks").value = student.marks;
    }

    $("studentModal").classList.add("show");
}

function closeModal() {
    $("studentModal").classList.remove("show");
}

function editStudent(index) {
    openModal(index);
}

function deleteStudent(index) {

    if (confirm(`Delete ${students[index].name}?`)) {

        students.splice(index, 1);

        saveData();

        displayStudents();
    }
}

$("addBtn").addEventListener("click", () => {
    openModal();
});

$("closeBtn").addEventListener("click", closeModal);

$("cancelBtn").addEventListener("click", closeModal);

$("searchInput").addEventListener(
    "input",
    displayStudents
);

$("branchFilter").addEventListener(
    "change",
    displayStudents
);

$("studentForm").addEventListener(
    "submit",
    function(event) {

        event.preventDefault();

        const id =
            $("studentId").value.trim();

        const name =
            $("studentName").value.trim();

        const branch =
            $("branch").value;

        const year =
            $("year").value;

        const email =
            $("email").value.trim();

        const marks =
            Number($("marks").value);

        const editIndex =
            $("editIndex").value;

        if (marks < 0 || marks > 100) {

            alert("Marks must be between 0 and 100.");

            return;
        }

        const duplicate = students.some(
            (student, index) =>
                student.id.toLowerCase() === id.toLowerCase() &&
                String(index) !== editIndex
        );

        if (duplicate) {

            alert("Student ID already exists.");

            return;
        }

        const student = {
            id,
            name,
            branch,
            year,
            email,
            marks
        };

        if (editIndex === "") {

            students.push(student);

        } else {

            students[Number(editIndex)] = student;
        }

        saveData();

        displayStudents();

        closeModal();
    }
);

$("studentModal").addEventListener(
    "click",
    function(event) {

        if (event.target === $("studentModal")) {
            closeModal();
        }
    }
);

displayStudents();
