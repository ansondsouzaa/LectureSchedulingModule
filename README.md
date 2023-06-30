# Online Lecture Scheduling Module

This is a Online Lecture Scheduling Module project that allows you to manage courses and lectures.

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- Angular

## Getting Started

### Prerequisites

- Node.js installed on your machine
- MongoDB installed and running

## Routes

- Main URL : https://online-lsm.web.app (Redirects to login page)
- Login page: https://online-lsm.web.app/login

ADMIN
- Dashboard: https://online-lsm.web.app/admin/dashboard (Can see list of instructors and add button)
- Courses: https://online-lsm.web.app/admin/courses (Can see list of courses and add button)
- Courses View: https://online-lsm.web.app/admin/edit-courses/:id (id has course id to view the courseas and lectures and add more lectures)

INSTRUCTOR
- Dashboard: https://online-lsm.web.app/instructor/dashboard (Can see only list of courses alloted with respect to the instructor)

### Installation

1. Clone the repository:

git clone https://github.com/your-username/course-management-system.git

markdown
Copy code

2. Install the dependencies:

cd course-management-system
npm install

markdown
Copy code

3. Configure the database connection:

- Open the `config.js` file in the server directory.
- Replace the MongoDB connection URL with your own database URL.

4. Start the server:

npm start

markdown
Copy code
`
5. Start the client:

cd client
npm install
ng serve

markdown
Copy code

6. Open your browser and visit `http://localhost:4200` to access the application.

## API Endpoints

### Courses

- `GET /api/courses/getAll`: Get all courses
- `GET /api/courses/:id`: Get a course by ID
- `POST /api/courses/create`: Create a new course

### Lectures

- `GET /api/lectures/check`: Check for lectured with before creating new one
- `POST /api/lectures/new`: Create a new lecture

### Instructors

- `GET /api/users/instructors`: Get all instructors
- `GET /api/users/findByInstructorId/:instructorId`: Get instructors by Id

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, feel free to open a GitHub issue or submit a pull request.

## License

This project is licensed under the MIT License.