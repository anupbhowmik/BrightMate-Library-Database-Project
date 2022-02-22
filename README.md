
# BrightMate Library

This a Library Management System comprised of a Client app and an Admin app.
<br />
This was the term project of BUET Level 2 Term 2 of Database Course (CSE 216).


## Authors

- [@Anupznk](https://github.com/Anupznk)
- [@fabihatasneem](https://github.com/fabihatasneem)


## Technology Used

- NodeJs and ExpressJS (For Backend)
- ReactJS (Client App Frontend)
- HTML, CSS, Bootstrap (Admin App Frontend)
- Oracle 19c (Database)
- 

## Installation

The database used in this app is `Oracle 19c` Database. If you don't have Oracle installed in your system, you need to install it first to run the app in your system. To install Oracle, you can follow the given link below:
<br />
<br />
[Oracle Installation Guideline for Windows 10](http://www.rebellionrider.com/how-to-install-oracle-database-19c-on-windows-10/)
<br />
<br />
After completing the installation, you will need to setup the database schema. You can create your own schema and provide the credentials into the `serverInformation.js` file located in the root directory.
<br />
<br />
Run the snippets below in `SQL Plus` while being connected as `sysdba`.

```bash
  CREATE USER c##brightmate_library IDENTIFIED BY root;
  GRANT CREATE SESSION TO c##brightmate_library;
  GRANT ALL PRIVILEGES TO c##brightmate_library;
```

Sign into your schema by providing these credentials:

```bash
  connect c##brightmate_library;
  password: root
```

In this way, your schema will be ready to hold the database tables. The SQL Dump file is provided in the root directory. Import them into your newly created schema. 
<br />
For database creation and table configuration, we have used Navicat Premium 16.
<br />

- Install [Node](https://nodejs.org/en/download/) on your device
- Clone the repository

Install all the dependencies from package.json

- `cd` to `server` directory
```bash
  npm i
  npm install
```
 Start the Admin app
 ```bash
  npm start
```
Goto
 ```bash
  http://localhost:5000/adminPanel
```


- `cd` to `client` directory
```bash
  npm i
  npm install
```
 Start the client app
 ```bash
  npm start
```
The client app will automatically launch at `http://localhost:3000/`
If not starting, goto
 ```bash
  http://localhost:3000
```

## Features of the Client app

- Multi-Threaded user support
- Secured account creation for readers
- Book List
- Magazine List
- Book Rent
- Live Search
   - Search by Book
   - Search by Author
   - Search by Genre
   - Search by Year published
- Filter
  -  Filter by Author
  -  Filter by Genre
- User Dashboard
   - User Details
   - Update user Details
   - Fine History
   - Rental History

## Features of the Admin app
- Log In / Log Out - only Admins, Librarians & Library Assistants have access to Admin site.
- Books
  - See All Books List
  - Add Book
  - Add Copies of an Edition
  - Edit Book Information
  - Delete Book
  - Search Book
- Magazine
  - See All Magazines List
  - Add Magazine
  - Edit Magazine
- Authors
  - See All Authors List 
  - Add Author
  - Edit Author
  - Search Author
- Publishers
  - See All Publishers List
  - Add Publisher
  - Edit Publisher
- Rental History
  - Return Book
  - See Rental History List
- Employee
  - See All Employees List 
  - Add Employee
- Dues
  - See Due List
  - Clear Due


## API Reference

[Full API References](https://documenter.getpostman.com/view/13141050/UVeAw9oE?fbclid=IwAR3DgAK1phAvB7Rp1KZsXI8HVQrIGN8VLHs6WgFOGY5atMAx49q9xfzN_gM#c9862e72-1278-482e-ad12-31d5cd53ca15)
