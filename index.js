const http = require("http");
const fs = require("fs");

let students = JSON.parse(fs.readFileSync("./students.json"));
let courses = JSON.parse(fs.readFileSync("./course.json"));
let departments = JSON.parse(fs.readFileSync("./department.json"));

const server = http.createServer((req, res) => {
  const { url, method } = req;
  const response = (status, msg) => {
    res.statusCode = status;
    res.end(JSON.stringify(msg));
  };
  res.setHeader("Content-Type", "application/json");

  //================================================================
  //===================      Students API     ======================
  //================================================================

  //get all students
  if (url == "/students" && method == "GET") {
    response(200, students);
  }
  //add student
  else if (url == "/students" && method == "POST") {
    req.on("data", (chunk) => {
      let student = JSON.parse(chunk);
      let isExisted = false;
      for (let i = 0; i < students.length; i++) {
        isExisted = students[i].email == student.email;
      }

      if (!isExisted) {
        student.id = students.length + 1;
        students.push(student);
        response(201, { message: "student add successfully" });
      } else {
        response(409, { message: "email already exists" });
      }
    });
  }

  //update student
  else if (url.startsWith("/students/") && method == "PUT") {
    let urlId = Number(url.split("/")[2]);
    let index = students.findIndex((student) => student.id == urlId);
    if (index == -1) {
      response(404, { message: "index not found" });
    }
    req.on("data", (chunk) => {
      let student = JSON.parse(chunk);
      //if the id and email exist
      if (
        students[index].id === student.id ||
        students[index].email === student.email
      ) {
        response(409, { message: "id or email already exists" });
        return;
      }
      students[index].id = student.id;
      students[index].name = student.name;
      students[index].password = student.password;
      students[index].email = student.email;
      response(202, { message: "data edited successfully" });
    });
  }

  //Delete student
  else if (url.startsWith("/students/") && method == "DELETE") {
    let urlId = Number(url.split("/")[2]);
    let index = students.findIndex((student) => student.id == urlId);
    if (index == -1) {
      response(404, { message: "index not found" });
    }
    students.splice(index, 1);
    response(202, { message: "user deleted successfully" });
  }
  //================================================================
  //===================      Courses API      ======================
  //================================================================
  // Get all courses
  else if (url == "/students/courses" && method == "GET") {
    response(200, courses);
  }

  // Get specific course by Id
  else if (url.startsWith("/students/courses/") && method == "GET") {
    let urlId = Number(url.split("/")[3]);
    let index = courses.findIndex((course) => course.id == urlId);
    if (index == -1) {
      return response(404, { message: "Course not found" });
    }
    response(200, courses[index]);
  }
  // Add course to courses collection
  else if (url == "/students/courses" && method == "POST") {
    req.on("data", (chunk) => {
      let course = JSON.parse(chunk);
      course.id = courses.length + 1;
      courses.push(course);
      response(201, { message: "course add successfully" });
    });
  } //Update specified course
  else if (url.startsWith("/students/courses") && method == "PUT") {
    let urlId = Number(url.split("/")[3]);
    let index = courses.findIndex((course) => course.id == urlId);
    if (index == -1) {
      response(404, { message: "index not found" });
    }
    req.on("data", (chunk) => {
      let course = JSON.parse(chunk);
      if (courses[index].id === course.id) {
        response(409, { message: "course already exists" });
        return;
      }
      courses[index].name = course.name;
      courses[index].id = course.id;
      response(202, { message: "data edited successfully" });
    });
  } //Delete specified course
  else if (url.startsWith("/students/courses") && method == "DELETE") {
    let urlId = Number(url.split("/")[3]);
    let index = courses.findIndex((course) => course.id == urlId);
    if (index == -1) {
      response(404, { message: "index not found" });
    }
    courses.splice(index, 1);
    response(202, { message: "data edited successfully" });
  }
  //================================================================
  //===================     Department API    ======================
  //================================================================
  // Get all departments
  else if (url == "/students/departments" && method == "GET") {
    response(200, departments);
  }

  // Get specific department by Id
  else if (url.startsWith("/students/departments/") && method == "GET") {
    let urlId = Number(url.split("/")[3]);
    let index = departments.findIndex((department) => department.id == urlId);
    if (index == -1) {
      return response(404, { message: "department not found" });
    }
    response(200, departments[index]);
  }
  // Add department to departments collection
  else if (url == "/students/departments" && method == "POST") {
    req.on("data", (chunk) => {
      let department = JSON.parse(chunk);
      department.id = departments.length + 1;
      departments.push(department);
      response(201, { message: "department add successfully" });
    });
  } //Update specified department
  else if (url.startsWith("/students/departments") && method == "PUT") {
    let urlId = Number(url.split("/")[3]);
    let index = departments.findIndex((department) => department.id == urlId);
    if (index == -1) {
      response(404, { message: "index not found" });
    }
    req.on("data", (chunk) => {
      let department = JSON.parse(chunk);
      departments[index].name = department.name;
      departments[index].id = department.id;
      response(202, { message: "data edited successfully" });
    });
  } //Delete specified department
  else if (url.startsWith("/students/departments") && method == "DELETE") {
    let urlId = Number(url.split("/")[3]);
    let index = departments.findIndex((department) => department.id == urlId);
    if (index == -1) {
      response(404, { message: "index not found" });
    }
    departments.splice(index, 1);
    response(202, { message: "data edited successfully" });
  }

  //error
  else {
    response(404, { message: "Route Not Found" });
  }
});

const port = process.env.PORT || 3001

server.listen(port, () => {
  console.log(`Listening on http://127.0.0.1:${port}`);
});
