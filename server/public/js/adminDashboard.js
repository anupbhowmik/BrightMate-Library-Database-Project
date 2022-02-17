window.onload = async () => {
  if (sessionStorage.getItem("adminId") == null) {
    window.location.replace("/");
  }

  const Admin_Name = sessionStorage.getItem("adminName");

  document.getElementById("admin_name").innerHTML = Admin_Name;
  document.getElementById(
    "mainContents"
  ).innerHTML = `<h1> Welcome, ${Admin_Name} </h1>`;
};

const logout = async () => {
  if (sessionStorage.getItem("adminId") != null) {
    sessionStorage.removeItem("adminId");
    sessionStorage.removeItem("adminName");
    sessionStorage.removeItem("adminPassword");
    window.location.replace("/adminPanel");
  }
};

$(function () {
  $("li").click(function () {
    // remove classes from all
    $("li").removeClass("nav-item");
    $("li").children().removeClass("active");
    $("li").children().addClass("text-white");
    // add class to the one we clicked
    $(this).children().removeClass("text-white");
    $(this).children().addClass("active");
  });
});

const home = async () => {
  const MainContent = document.getElementById("mainContents");
  const Admin_Name = sessionStorage.getItem("adminName");
  let design = `<h1> Welcome, ${Admin_Name} </h1>`;

  MainContent.innerHTML = design;
};

const bookList = async () => {
  const MainContent = document.getElementById("mainContents");

  const response = await fetch("http://localhost:5000/api/getBooks", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  let ResponseObj = await response.json();
  console.log(ResponseObj);

  let design = `<table class="table" style="font-size:smaller">
                    <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Book ID</th>
                        <th scope="col">Title</th>
                        <th scope="col">Authors</th>
                        <th scope="col">Publisher</th>
                        <th scope="col">ISBN</th>
                        <th scope="col">Genre</th>
                        <th scope="col">Copies</th>
                        <th scope="col">Year</th>
                        <th scope="col">Language</th>
                        <th scope="col">Action</th>
                    </tr>
                    </thead>
                    <tbody>`;

  let count = 1;
  ResponseObj.Books.forEach((element) => {
    let authors = "";
    for (let i = 0; i < element.AuthorObject.length; i++) {
      authors = authors + element.AuthorObject[i].AuthorName + ", ";
    }
    let genre = "";
    for (let i = 0; i < element.GenreObject.length; i++) {
      genre = genre + element.GenreObject[i].GenreName + ", ";
    }
    let copyCount = 0;
    for (let i = 0; i < element.CopyObject.length; i++) {
      copyCount = copyCount + element.CopyObject[i].CopyCount;
    }

    design += `<tr>
                        <th scope="row">${count}</th>
                        <td id="">${element.BookID}</td>
                        <td>${element.Title}</td>
                        <td>${authors}</td>
                        <td>${element.Publisher}</td>
                        <td>${element.ISBN}</td>
                        <td>${genre}</td>
                        <td>${copyCount}</td>
                        <td>${element.YearOfPublication}</td>
                        <td>${element.Language}</td>
                        <td>
                        <button id="edit_${element.BookID}" value="${element.BookID}" onclick="editBook(this.value)" class="btn btn-info btn-sm m-1" data-bs-toggle="modal" data-bs-target="#editModal">Edit</button>
                        <button id="delete_${element.BookID}" value="${element.BookID}" onclick="deleteBook(this.value)" class="btn btn-danger btn-sm">Delete</button>
                        </td>
                    </tr>`;

    count++;
  });

  design += `</tbody>
                </table>`;
  MainContent.innerHTML = design;
};

const employeeList = async () => {
  const MainContent = document.getElementById("mainContents");

  const response = await fetch("http://localhost:3000/api/getAllEmployees", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  RequestObj = await response.json();
  console.log(RequestObj);

  let design = `<table class="table" style="font-size:larger">
                    <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Employee ID</th>
                        <th scope="col">Full Name</th>
                        <th scope="col">Username</th>
                        <th scope="col">Email</th>
                        <th scope="col">Phone Number</th>
                        <th scope="col">Hire Date</th>
                        <th scope="col">Full Location</th>
                        <th scope="col">Service Desc</th>
                        <th scope="col">Department Name</th>
                        <th scope="col">Job Title</th>
                        <th scope="col">Shift</th>
                        <th scope="col">Total Request Accepted</th>
                        <th scope="col">Action</th>
                    </tr>
                    </thead>
                    <tbody>`;

  let count = 1;
  RequestObj.ResponseData.forEach((element) => {
    design += `<tr>
                        <th scope="row">${count}</th>
                        <td>${element.MEMBER_ID}</td>
                        <td>${element.USER_FULLNAME}</td>
                        <td>${element.USER_NAME}</td>
                        <td>${element.EMAIL}</td>
                        <td>${element.PHONE_NUMBER}</td>
                        <td>${element.HIRE_DATE}</td>
                        <td>${element.FULL_LOCATION}</td>
                        <td>${element.SERVICE_DESC}</td>
                        <td>${element.DEPARTMENT_NAME}</td>
                        <td>${element.JOB_TITLE}</td>
                        <td>${element.SHIFT_DESC}</td>
                        <td>${element.REQ_COUNT}</td>
                        <td>
                        <button id="employee_id_${element.MEMBER_ID}" value="${element.MEMBER_ID}" onclick="editEmployee(this.value, 1)" class="btn btn-info m-1" data-bs-toggle="modal" data-bs-target="#exampleModal">Edit Info</button>
                        <button id="employee_id_${element.MEMBER_ID}" value="${element.MEMBER_ID}" onclick="actionEmployee(this.value, 0)" class="btn btn-danger">Unapprove</button>
                        </td>
                    </tr>`;

    count++;
  });

  design += `</tbody>
                </table>`;
  MainContent.innerHTML = design;
};

const unapprovedEmployeeList = async () => {
  const MainContent = document.getElementById("mainContents");

  const response = await fetch(
    "http://localhost:3000/api/getAllUnapprovedEmployees",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  RequestObj = await response.json();
  console.log(RequestObj);

  let design = "";

  if (RequestObj.ResponseCode) {
    design = `<table class="table" style="font-size:larger">
                      <thead>
                      <tr>
                          <th scope="col">#</th>
                          <th scope="col">Employee ID</th>
                          <th scope="col">Full Name</th>
                          <th scope="col">Username</th>
                          <th scope="col">Email</th>
                          <th scope="col">Phone Number</th>
                          <th scope="col">Registration Date</th>
                          <th scope="col">Full Location</th>
                          <th scope="col">Service Desc</th>
                          <th scope="col">Department Name</th>
                          <th scope="col">Job Title</th>
                          <th scope="col">Shift</th>
                          <th scope="col">Action</th>
                      </tr>
                      </thead>
                      <tbody>`;

    let count = 1;
    RequestObj.ResponseData.forEach((element) => {
      design += `<tr>
                          <th scope="row">${count}</th>
                          <td>${element.MEMBER_ID}</td>
                          <td>${element.USER_FULLNAME}</td>
                          <td>${element.USER_NAME}</td>
                          <td>${element.EMAIL}</td>
                          <td>${element.PHONE_NUMBER}</td>
                          <td>${element.REGISTRATION_DATE}</td>
                          <td>${element.FULL_LOCATION}</td>
                          <td>${element.SERVICE_DESC}</td>
                          <td>${element.DEPARTMENT_NAME}</td>
                          <td>${element.JOB_TITLE}</td>
                          <td>${element.SHIFT_DESC}</td>
                          <td><button id="employee_id_${element.MEMBER_ID}" value="${element.MEMBER_ID}" onclick="actionEmployee(this.value, 1)" class="btn btn-info">Approve</button></td>
                      </tr>`;

      count++;
    });

    design += `</tbody>
                  </table>`;
  } else {
    design = "No Data Found";
  }

  MainContent.innerHTML = design;
};

const customerCareList = async () => {
  const MainContent = document.getElementById("mainContents");

  const response = await fetch(
    "http://localhost:3000/api/getAllCustomerCares",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  RequestObj = await response.json();
  console.log(RequestObj);

  let design = "";

  if (RequestObj.ResponseCode) {
    design = `<table class="table" style="font-size:larger">
                    <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Employee ID</th>
                        <th scope="col">Full Name</th>
                        <th scope="col">Username</th>
                        <th scope="col">Email</th>
                        <th scope="col">Phone Number</th>
                        <th scope="col">Hire Date</th>
                        <th scope="col">Full Location</th>
                        <th scope="col">Service Desc</th>
                        <th scope="col">Department Name</th>
                        <th scope="col">Job Title</th>
                        <th scope="col">Shift</th>
                    </tr>
                    </thead>
                    <tbody>`;

    let count = 1;
    RequestObj.ResponseData.forEach((element) => {
      design += `<tr>
                        <th scope="row">${count}</th>
                        <td>${element.MEMBER_ID}</td>
                        <td>${element.USER_FULLNAME}</td>
                        <td>${element.USER_NAME}</td>
                        <td>${element.EMAIL}</td>
                        <td>${element.PHONE_NUMBER}</td>
                        <td>${element.HIRE_DATE}</td>
                        <td>${element.FULL_LOCATION}</td>
                        <td>${element.SERVICE_DESC}</td>
                        <td>${element.DEPARTMENT_NAME}</td>
                        <td>${element.JOB_TITLE}</td>
                        <td>${element.SHIFT_DESC}</td>
                    </tr>`;

      count++;
    });

    design += `</tbody>
                </table>`;
  } else {
    design = "No Data Found";
  }
  MainContent.innerHTML = design;
};

const vehicleList = async () => {
  const MainContent = document.getElementById("mainContents");

  const response = await fetch("http://localhost:3000/api/getAllVehicle", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  RequestObj = await response.json();
  console.log(RequestObj);

  let design = "";

  if (RequestObj.ResponseCode) {
    design = `<table class="table" style="font-size:larger">
                    <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Vehicle ID</th>
                        <th scope="col">Driver Member ID</th>
                        <th scope="col">Driver Name</th>
                        <th scope="col">Driver Phone Number</th>
                        <th scope="col">Driver Email</th>
                        <th scope="col">Driver Hire Date</th>
                        <th scope="col">Service Desc</th>
                        <th scope="col">Department Name</th>
                        <th scope="col">Shift</th>
                        <th scope="col">Request Accepted</th>
                    </tr>
                    </thead>
                    <tbody>`;

    let count = 1;
    RequestObj.ResponseData.forEach((element) => {
      design += `<tr>
                        <th scope="row">${count}</th>
                        <td>${element.VEHICLE_ID}</td>
                        <td>${element.MEMBER_ID}</td>
                        <td>${element.DRIVER_NAME}</td>
                        <td>${element.PHONE_NUMBER}</td>
                        <td>${element.EMAIL}</td>
                        <td>${element.HIRE_DATE}</td>
                        <td>${element.SERVICE_DESC}</td>
                        <td>${element.DEPARTMENT_NAME}</td>
                        <td>${element.SHIFT_DESC}</td>
                        <td>${element.REQ_COUNT}</td>
                    </tr>`;

      count++;
    });

    design += `</tbody>
                </table>`;
  } else {
    design = "No Data Found";
  }
  MainContent.innerHTML = design;
};

const serviceDetails = async () => {
  const MainContent = document.getElementById("mainContents");

  const response = await fetch("http://localhost:3000/api/getServices", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  RequestObj = await response.json();
  console.log(RequestObj);

  let design = `<h4> Services </h4>`;
  let selectDesign = ``;
  design += `<table class="table" style="font-size:larger">
                    <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Service ID</th>
                        <th scope="col">Description</th>
                    </tr>
                    </thead>
                    <tbody>`;

  let count = 1;

  RequestObj.forEach((element) => {
    design += `<tr>
                      <th scope="row">${count}</th>
                      <td>${element.SERVICE_ID}</td>
                      <td>${element.DESCRIPTION}</td>
                  </tr>`;
    selectDesign += `<option value="${element.SERVICE_ID}">${element.DESCRIPTION}</option>`;
    count++;
  });

  design += `</tbody>
                </table>`;

  design += "<hr> <h5> Select a Service to see Departments</h5>";
  design += `<select onchange="showDeptTable(this.value)" id="service_name_2" class="form-control" aria-label="Default select example"></select> <hr> <div id="deptTable"></div>`;

  MainContent.innerHTML = design;
  document.getElementById("service_name_2").innerHTML = selectDesign;
};

const actionEmployee = async (empId, status) => {
  console.log(empId);

  let emplpyeeObj = {
    employee_id: empId,
    approval_status: status,
  };
  emplpyeeObj = JSON.stringify(emplpyeeObj);
  console.log(emplpyeeObj);

  const response = await fetch(
    "http://localhost:3000/api/updateEmployeeStatus",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: emplpyeeObj,
    }
  );
  RequestObj = await response.json();
  console.log(RequestObj);

  if (RequestObj.ResponseCode == 1) {
    window.alert(RequestObj.ResponseText);

    if (status) {
      unapprovedEmployeeList();
    } else {
      employeeList();
    }
  } else if (RequestObj.ResponseCode == -1) {
    window.alert(RequestObj.ResponseText);
    window.alert(RequestObj.ErrorMessage);
  } else {
    window.alert(RequestObj.ResponseText);
  }
};

const editBook = async (bookId) => {
  console.log(bookId);

  //Get Book Info from API
  let bookObj = {
    BOOK_ID: bookId,
  };
  bookObj = JSON.stringify(bookObj);
  console.log(bookObj);

  const response = await fetch("http://localhost:5000/api/getBookInfo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: bookObj,
  });
  ResponseObj = await response.json();
  console.log(ResponseObj);

  //Get Publishers from API
  showPublishers();
  showGenre();

  let authors = "";
  for (let i = 0; i < ResponseObj.AuthorObject.length; i++) {
    authors = authors + ResponseObj.AuthorObject[i].AuthorName + ", ";
  }

  $("#book_id").val(ResponseObj.BookID);
  $("#title").val(ResponseObj.Title);
  $("#authors").val(authors);
  $("#genre").val();
  $("#year").val(ResponseObj.YearOfPublication);
  $("#description").val(ResponseObj.Description);
  $("#language").val(ResponseObj.Language);
  $("#isbn").val(ResponseObj.ISBN);
};

const showPublishers = async () => {
  const responseDepartments = await fetch(
    "http://localhost:5000/api/getPublishers",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  ResponseObj = await responseDepartments.json();

  console.log(ResponseObj);

  let pubDesign = "";

  ResponseObj.PublisherList.forEach((pub) => {
    pubDesign += `<option value="${pub.PublisherID}">${pub.PublisherName}</option>`;
  });

  document.getElementById("publisher").innerHTML = pubDesign;
};

const showGenre = async () => {
  const responseDepartments = await fetch(
    "http://localhost:5000/api/getGenre",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  ResponseObj = await responseDepartments.json();

  console.log(ResponseObj);

  let genreDesign = "";

  ResponseObj.GenreList.forEach((genre) => {
    genreDesign += `<div class="form-check">
    <input class="form-check-input" type="checkbox" value="${genre.GenreID}" id="genre_${genre.GenreID}">
    <label class="form-check-label" for="genre_${genre.GenreID}">
    ${genre.GenreName}
    </label>
  </div>`;
  });

  document.getElementById("genre").innerHTML = genreDesign;
};

const showJob = async (dept_id, job_id) => {
  console.log(dept_id);

  let departmentObj = {
    department_id: dept_id,
  };

  departmentObj = JSON.stringify(departmentObj);

  const responseJobs = await fetch(
    "http://localhost:3000/api/getDepartmentJobs",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: departmentObj,
    }
  );
  JobObj = await responseJobs.json();

  console.log(JobObj);

  let jobDesign = "";

  JobObj.forEach((job) => {
    if (job_id == job.JOB_ID) {
      jobDesign += `<option selected value="${job.JOB_ID}">${job.JOB_TITLE}</option>`;
    } else {
      jobDesign += `<option value="${job.JOB_ID}">${job.JOB_TITLE}</option>`;
    }
  });

  document.getElementById("job_title").innerHTML = jobDesign;
};

const showShift = async (shift_id) => {
  console.log(shift_id);

  const responseShift = await fetch("http://localhost:3000/api/getShifts", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  ShiftObj = await responseShift.json();
  console.log(ShiftObj);

  let shiftDesign = "";

  ShiftObj.forEach((shift) => {
    if (shift_id == shift.SHIFT_ID) {
      shiftDesign += `<option selected value="${shift.SHIFT_ID}">${shift.DESCRIPTION}</option>`;
    } else {
      shiftDesign += `<option value="${shift.SHIFT_ID}">${shift.DESCRIPTION}</option>`;
    }
  });

  document.getElementById("shift").innerHTML = shiftDesign;
};

const saveBookInfo = async () => {
  let BOOK_ID = $("#book_id").val();
  let YEAR = $("#year").val();
  let DESCRIPTION = $("#description").val();
  let LANGUAGE = $("#language").val();
  let PUBLISHER_ID = $("#publisher").val();
  let GENRE = $("#genre").val();

  let bookObj = {
    BOOK_ID: BOOK_ID,
    YEAR: YEAR,
    DESCRIPTION: DESCRIPTION,
    LANGUAGE: LANGUAGE,
    PUBLISHER_ID: PUBLISHER_ID,
    GENRE: GENRE,
    ADMIN_ID: sessionStorage.getItem("adminId"),
    ADMIN_PASSWORD: sessionStorage.getItem("adminPassword"),
  };

  console.log(bookObj);

  bookObj = JSON.stringify(bookObj);

  const responseEmployee = await fetch("http://localhost:5000/api/editBook", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: bookObj,
  });

  responseObj = await responseEmployee.json();
  console.log(responseObj);

  if (responseObj.ResponseCode == 1) {
    window.alert(responseObj.ResponseDesc);
    employeeList();
  } else {
    window.alert(responseObj.ResponseDesc);
  }
};

const showDeptTable = async (service_id) => {
  console.log(service_id);

  let serviceObj = {
    service_id: service_id,
  };

  serviceObj = JSON.stringify(serviceObj);

  const responseDepartments = await fetch(
    "http://localhost:3000/api/getServiceDepartments",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: serviceObj,
    }
  );
  DepartmentObj = await responseDepartments.json();

  console.log(DepartmentObj);

  let design = `<h4> Departments </h4>`;
  let selectDesign = ``;

  design += `<table class="table" style="font-size:larger">
                    <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Department ID</th>
                        <th scope="col">Department Name</th>
                        <th scope="col">Location</th>
                    </tr>
                    </thead>
                    <tbody>`;

  let count = 1;

  DepartmentObj.forEach((element) => {
    design += `<tr>
                      <th scope="row">${count}</th>
                      <td>${element.DEPARTMENT_ID}</td>
                      <td>${element.DEPARTMENT_NAME}</td>
                      <td>${
                        element.BLOCK +
                        ", " +
                        element.STREET +
                        ", " +
                        element.HOUSE_NO
                      }</td>
                  </tr>`;

    selectDesign += `<option value="${element.DEPARTMENT_ID}">${element.DEPARTMENT_NAME}</option>`;
    count++;
  });

  design += `</tbody>
                </table>`;

  design += "<hr> <h5> Select a Department to see Jobs</h5>";
  design += `<select onchange="showJobsTable(this.value)" id="dept_name_2" class="form-control" aria-label="Default select example"></select> <hr> <div id="jobsTable"></div>`;

  document.getElementById("deptTable").innerHTML = design;
  document.getElementById("dept_name_2").innerHTML = selectDesign;
};

const showJobsTable = async (department_id) => {
  console.log(department_id);

  let departmentObj = {
    department_id: department_id,
  };

  departmentObj = JSON.stringify(departmentObj);

  const responseJobs = await fetch(
    "http://localhost:3000/api/getDepartmentJobs",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: departmentObj,
    }
  );
  JobsObj = await responseJobs.json();

  console.log(JobsObj);

  let design = `<h4> Jobs </h4>`;
  let selectDesign = ``;

  design += `<table class="table" style="font-size:larger">
                    <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Job ID</th>
                        <th scope="col">Job Title</th>
                        <th scope="col">Salary</th>
                    </tr>
                    </thead>
                    <tbody>`;

  let count = 1;

  JobsObj.forEach((element) => {
    design += `<tr>
                      <th scope="row">${count}</th>
                      <td>${element.JOB_ID}</td>
                      <td>${element.JOB_TITLE}</td>
                      <td>${element.SALARY}</td>
                  </tr>`;

    selectDesign += `<option value="${element.JOB_ID}">${element.JOB_TITLE}</option>`;
    count++;
  });

  design += `</tbody>
                </table>`;

  document.getElementById("jobsTable").innerHTML = design;
};
