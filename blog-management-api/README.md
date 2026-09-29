# Blog Management System (Backend API)

Users can register, log in (JWT + httpOnly cookie) and manage blog posts.
All blog routes are protected; only the creator can update or delete a blog.

**Stack:** Node.js, Express, MongoDB (Mongoose), JWT, bcryptjs, Multer

## Folder Structure
```
server.js
src/
  app.js
  config/db.js
  controllers/   authController, userController, blogController
  middlewares/   authMiddleware, uploadMiddleware, errorMiddleware
  models/        User, Blog
  routes/        authRoutes, userRoutes, blogRoutes
  utils/         asyncHandler, ApiError, token
uploads/         uploaded blog images
```

## Setup
```bash
npm install
cp .env.example .env     # then edit values
npm run dev              # or: npm start
```

## API Endpoints

### Auth (public)
| Method | Endpoint | Body |
|---|---|---|
| POST | /api/auth/register | name, email, password, phoneNumber |
| POST | /api/auth/login | email, password |
| POST | /api/auth/logout | - |

### User (protected)
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/users/me | Logged-in user profile |
| PUT | /api/users/me | Update name, phoneNumber, password |

### Blogs (protected)
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/blogs | Create blog (multipart/form-data: title, content, authorName, tags, blogImage) |
| GET | /api/blogs | Get all blogs |
| GET | /api/blogs/:id | Get single blog |
| PUT | /api/blogs/:id | Update blog (creator only) |
| DELETE | /api/blogs/:id | Delete blog (creator only) |

`tags` can be sent as comma separated text (`node,express`) or a JSON array.
Authentication works via the `token` cookie or an `Authorization: Bearer <token>` header.
