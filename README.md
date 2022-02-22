
# BrightMate Library

This a Library Management System comprised of a Client app and an Admin app.
The Client app is built on `React js` and for the back end, `node js` and `express js` were used. 
For the database, Oracle was used. <br />
This was the term project of BUET Level 2 Term 2 of Database Course (CSE 216).


## Authors

- [@Anupznk](https://github.com/Anupznk)
- [@fabihatasneem](https://github.com/fabihatasneem)


## Installation

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
- Book Rent
- Live Search
   - Search by book
   - Search by author
   - Search by genre
   - Search by year published
- Filter by Author and Genre from book details page
- User Dashboard
   - User Details
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

[All api references](https://documenter.getpostman.com/view/13141050/UVeAw9oE?fbclid=IwAR3DgAK1phAvB7Rp1KZsXI8HVQrIGN8VLHs6WgFOGY5atMAx49q9xfzN_gM#c9862e72-1278-482e-ad12-31d5cd53ca15)
