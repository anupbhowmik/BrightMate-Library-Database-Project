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
                        <button id="edit_${element.BookID}" value="${element.BookID}" onclick="editBook(this.value)" class="btn btn-info btn-sm m-1" data-bs-toggle="modal" data-bs-target="#editBookModal">Edit</button>
                        <button id="delete_${element.BookID}" value="${element.BookID}" onclick="deleteBook(this.value)" class="btn btn-danger btn-sm">Delete</button>
                        </td>
                    </tr>`;

    count++;
  });

  design += `</tbody>
                </table>`;
  MainContent.innerHTML = design;
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
    <input class="form-check-input" type="checkbox" value="${genre.GenreID}" id="genre_${genre.GenreID}" name="genreCheckbox">
    <label class="form-check-label" for="genre_${genre.GenreID}">
    ${genre.GenreName}
    </label>
    </div>`;
  });
  $("#genrelistLength").val(ResponseObj.GenreList.length);
  document.getElementById("genre").innerHTML = genreDesign;
};

const saveBookInfo = async () => {
  let BOOK_ID = $("#book_id").val();
  let YEAR = $("#year").val();
  let DESCRIPTION = $("#description").val();
  let LANGUAGE = $("#language").val();
  let PUBLISHER_ID = $("#publisher").val();
  let GENRE = [];
  var markedCheckbox = document.getElementsByName("genreCheckbox");
  for (var checkbox of markedCheckbox) {
    if (checkbox.checked) GENRE.push(checkbox.value);
  }

  let bookObj = {
    BOOK_ID: BOOK_ID,
    YEAR: YEAR,
    DESCRIPTION: DESCRIPTION,
    LANGUAGE: LANGUAGE,
    PUBLISHER_ID: PUBLISHER_ID,
    GENRE: GENRE,
  };

  console.log(bookObj);

  bookObj = JSON.stringify(bookObj);

  const responseBook = await fetch("http://localhost:5000/api/editBook", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: bookObj,
  });

  responseObj = await responseBook.json();
  console.log(responseObj);

  if (responseObj.ResponseCode == 1) {
    window.alert(responseObj.ResponseDesc);
    bookList();
  } else {
    window.alert(responseObj.ResponseDesc);
  }
};

const deleteBook = async (bookId) => {
  console.log(bookId);

  //Get Book Info from API
  let bookObj = {
    BOOK_ID: bookId,
  };
  bookObj = JSON.stringify(bookObj);
  console.log(bookObj);

  const response = await fetch("http://localhost:5000/api/deleteBook", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: bookObj,
  });
  ResponseObj = await response.json();
  window.alert(responseObj.ResponseDesc);
  bookList();
};

const authorList = async () => {
  const MainContent = document.getElementById("mainContents");

  const response = await fetch("http://localhost:5000/api/getAuthors", {
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
                        <th scope="col">Author ID</th>
                        <th scope="col">Name</th>
                        <th scope="col">Date Of Birth</th>
                        <th scope="col">Date Of Death</th>
                        <th scope="col">Bio</th>
                        <th scope="col">Action</th>
                    </tr>
                    </thead>
                    <tbody>`;

  let count = 1;
  ResponseObj.AuthorList.forEach((element) => {
    design += `<tr>
                        <th scope="row">${count}</th>
                        <td id="">${element.AuthorID}</td>
                        <td>${element.AuthorName}</td>
                        <td>${element.DateOfBirth}</td>
                        <td>${element.DateOfDeath}</td>
                        <td>${element.Bio}</td>
                        <td>
                        <button id="edit_${element.AuthorID}" value="${element.AuthorID}" onclick="editAuthor(this.value)" class="btn btn-info btn-sm m-1" data-bs-toggle="modal" data-bs-target="#editAuthorModal">Edit</button>
                        </td>
                    </tr>`;

    count++;
  });

  design += `</tbody>
                </table>`;
  MainContent.innerHTML = design;
};

const editAuthor = async (authorId) => {
  console.log(authorId);

  let authorObj = {
    AUTHOR_ID: authorId,
  };
  authorObj = JSON.stringify(authorObj);
  console.log(authorObj);

  const response = await fetch("http://localhost:5000/api/getAuthorById", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: authorObj,
  });
  ResponseObj = await response.json();
  console.log(ResponseObj);

  let dateOfBirth = ResponseObj.DateOfBirth;
  if(dateOfBirth != null){
    dateOfBirth = dateOfBirth.split('T');
    dateOfBirth = dateOfBirth[0];
  }
  let dateOfDeath = ResponseObj.DateOfDeath;
  if(dateOfBirth != null){
    dateOfDeath = dateOfDeath.split('T');
    dateOfDeath = dateOfDeath[0];
  }

  $("#authorId").val(ResponseObj.AuthorID);
  $("#authorName").val(ResponseObj.AuthorName);
  document.getElementById("dateOfBirth").value = dateOfBirth;
  document.getElementById("dateOfDeath").value = dateOfDeath;
  $("#bio").val(ResponseObj.Bio);
};

const saveAuthorInfo = async () => {
  let AUTHOR_ID = $("#authorId").val();
  let AUTHOR_NAME = $("#authorName").val();
  let DATE_OF_BIRTH = $("#dateOfBirth").val();
  let DATE_OF_DEATH = $("#dateOfDeath").val();
  let BIO = $("#bio").val();

  let authorObj = {
    AUTHOR_ID: AUTHOR_ID,
    AUTHOR_NAME: AUTHOR_NAME,
    DATE_OF_BIRTH: DATE_OF_BIRTH,
    DATE_OF_DEATH: DATE_OF_DEATH,
    BIO: BIO
  };

  console.log(authorObj);

  authorObj = JSON.stringify(authorObj);

  const responseAuthor = await fetch("http://localhost:5000/api/editAuthor", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: authorObj,
  });

  responseObj = await responseAuthor.json();
  console.log(responseObj);

  if (responseObj.ResponseCode == 1) {
    window.alert(responseObj.ResponseDesc);
    authorList();
  } else {
    window.alert(responseObj.ResponseDesc);
  }
};

const publisherList = async () => {
  const MainContent = document.getElementById("mainContents");

  const response = await fetch("http://localhost:5000/api/getPublishers", {
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
                        <th scope="col">Publisher ID</th>
                        <th scope="col">Name</th>
                        <th scope="col">Phone</th>
                        <th scope="col">Address Line</th>
                        <th scope="col">City</th>
                        <th scope="col">Postal Code</th>
                        <th scope="col">Country</th>
                        <th scope="col">Action</th>
                    </tr>
                    </thead>
                    <tbody>`;

  let count = 1;
  ResponseObj.PublisherList.forEach((element) => {
    design += `<tr>
                        <th scope="row">${count}</th>
                        <td id="">${element.PublisherID}</td>
                        <td>${element.PublisherName}</td>
                        <td>${element.Phone}</td>
                        <td>${element.AddressLine}</td>
                        <td>${element.City}</td>
                        <td>${element.PostalCode}</td>
                        <td>${element.Country}</td>
                        <td>
                        <button id="edit_${element.PublisherID}" value="${element.PublisherID}" onclick="editPublisher(this.value)" class="btn btn-info btn-sm m-1" data-bs-toggle="modal" data-bs-target="#editPublisherModal">Edit</button>
                        </td>
                    </tr>`;

    count++;
  });

  design += `</tbody>
                </table>`;
  MainContent.innerHTML = design;
};

const editPublisher = async (publisherId) => {
  console.log(publisherId);

  let publisherObj = {
    PUBLISHER_ID: publisherId,
  };
  publisherObj = JSON.stringify(publisherObj);
  console.log(publisherObj);

  const response = await fetch("http://localhost:5000/api/getPublisherById", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: publisherObj,
  });
  ResponseObj = await response.json();
  console.log(ResponseObj);

  $("#publisherId").val(ResponseObj.PublisherID);
  $("#publisherName").val(ResponseObj.PublisherName);
  $("#phone").val(ResponseObj.Phone);
  $("#addressLine").val(ResponseObj.AddressLine);
  $("#city").val(ResponseObj.City);
  $("#postalCode").val(ResponseObj.PostalCode);
  $("#country").val(ResponseObj.Country);
};

const savePublisherInfo = async () => {
  let PUBLISHER_ID = $("#publisherId").val();
  let PUBLISHER_NAME = $("#publisherName").val();
  let PHONE = $("#phone").val();
  let ADDRESS_LINE = $("#addressLine").val();
  let CITY = $("#city").val();
  let POSTAL_CODE = $("#postalCode").val();
  let COUNTRY = $("#country").val();

  let publisherObj = {
    PUBLISHER_ID: PUBLISHER_ID,
    PUBLISHER_NAME: PUBLISHER_NAME,
    PHONE: PHONE,
    ADDRESS_LINE: ADDRESS_LINE,
    CITY: CITY,
    POSTAL_CODE: POSTAL_CODE,
    COUNTRY: COUNTRY
  };

  console.log(publisherObj);

  publisherObj = JSON.stringify(publisherObj);

  const responsePublisher = await fetch("http://localhost:5000/api/editPublisher", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: publisherObj,
  });

  responseObj = await responsePublisher.json();
  console.log(responseObj);

  if (responseObj.ResponseCode == 1) {
    window.alert(responseObj.ResponseDesc);
    publisherList();
  } else {
    window.alert(responseObj.ResponseDesc);
  }
};
