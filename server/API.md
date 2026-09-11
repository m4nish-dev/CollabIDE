# CollabIDE Backend API Documentation

This document serves as a lightweight reference for the CollabIDE API. All endpoints are prefixed with `/api/v1`.

---

## 1. Authentication
Handles user registration, login, logout, and token refresh.

### `POST /auth/signup`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "securepassword123"
  }
  ```
- **Success Response**: `201 Created`
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": { "user": { ... }, "accessToken": "..." }
  }
  ```
- **Error Codes**: `400 Bad Request`, `409 Conflict` (Email already in use)

### `POST /auth/login`
- **Auth Required**: No
- **Request Body**: `{ "email": "...", "password": "..." }`
- **Success Response**: `200 OK` (Set-Cookie `refreshToken`)
- **cURL Example**:
  ```bash
  curl -X POST http://localhost:4000/api/v1/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"jane@example.com", "password":"securepassword123"}'
  ```

### `POST /auth/logout`
- **Auth Required**: Yes
- **Success Response**: `200 OK` (Clears `refreshToken` cookie)

### `POST /auth/refresh`
- **Auth Required**: No (Uses `refreshToken` HTTP-only cookie)
- **Success Response**: `200 OK` (Returns new `accessToken`)

### `GET /auth/me`
- **Auth Required**: Yes
- **Success Response**: `200 OK` (Returns current user object)

---

## 2. Workspaces
Workspaces are the top-level container for projects.

### `GET /workspaces`
- **Auth Required**: Yes
- **Success Response**: `200 OK` (Array of user's workspaces)

### `POST /workspaces`
- **Auth Required**: Yes
- **Request Body**: `{ "name": "Personal", "description": "My projects" }`
- **Success Response**: `201 Created`

### `GET /workspaces/:id`
- **Auth Required**: Yes
- **Success Response**: `200 OK`

### `PATCH /workspaces/:id`
- **Auth Required**: Yes
- **Request Body**: `{ "name": "Updated Name" }`

### `DELETE /workspaces/:id`
- **Auth Required**: Yes

---

## 3. Projects
Projects belong to a workspace and contain the actual code files.

### `GET /projects`
- **Auth Required**: Yes
- **Success Response**: `200 OK` (Array of projects the user is a member of)

### `POST /projects`
- **Auth Required**: Yes
- **Request Body**: `{ "name": "React App", "workspaceId": "..." }`
- **Success Response**: `201 Created`
- **cURL Example**:
  ```bash
  curl -X POST http://localhost:4000/api/v1/projects \
    -H "Authorization: Bearer <token>" \
    -H "Content-Type: application/json" \
    -d '{"name":"React App", "workspaceId":"60d21b4667d0d8992e610c85"}'
  ```

### `GET /projects/:id`
- **Auth Required**: Yes
- **Success Response**: `200 OK`

### `PATCH /projects/:id`
- **Auth Required**: Yes (owner/admin/editor)

### `DELETE /projects/:id`
- **Auth Required**: Yes (owner only)

---

## 4. Files
File operations inside a project. Base URL: `/projects/:projectId/files`

### `GET /projects/:projectId/files/tree`
- **Auth Required**: Yes (owner/admin/editor/viewer)
- **Success Response**: `200 OK` (Hierarchical tree of files)

### `GET /projects/:projectId/files?path=src/index.js`
- **Auth Required**: Yes
- **Success Response**: `200 OK` (File content)

### `PUT /projects/:projectId/files`
- **Auth Required**: Yes (owner/admin/editor)
- **Request Body**: `{ "path": "src/index.js", "content": "console.log('hi');" }`

### `POST /projects/:projectId/files`
- **Auth Required**: Yes (owner/admin/editor)
- **Request Body**: `{ "path": "src/newfile.js", "content": "", "isDirectory": false }`

### `DELETE /projects/:projectId/files?path=src/old.js`
- **Auth Required**: Yes (owner/admin/editor)

---

## 5. Members & Invitations
Manage who has access to the project. Base URL: `/projects/:projectId/members` & `/projects/:projectId/invitations`

### `GET /projects/:projectId/members`
- **Auth Required**: Yes
- **Success Response**: `200 OK`

### `PATCH /projects/:projectId/members/:memberId/role`
- **Auth Required**: Yes (owner/admin)
- **Request Body**: `{ "role": "editor" }`

### `DELETE /projects/:projectId/members/:memberId`
- **Auth Required**: Yes (owner/admin)

### `POST /projects/:projectId/invitations`
- **Auth Required**: Yes (owner/admin)
- **Request Body**: `{ "email": "friend@example.com", "role": "viewer" }`

### `GET /invitations/me`
- **Auth Required**: Yes
- **Description**: List all pending invitations for the current logged-in user.

### `POST /invitations/accept`
- **Auth Required**: Yes
- **Request Body**: `{ "token": "..." }`

---

## 6. Git (Simplified Versioning)
Simulated branching and committing. Base URL: `/projects/:projectId/git`

### `GET /projects/:projectId/git/status`
- **Auth Required**: Yes
- **Success Response**: `200 OK` (Lists modified/untracked files)

### `GET /projects/:projectId/git/branches`
- **Auth Required**: Yes

### `POST /projects/:projectId/git/branches`
- **Auth Required**: Yes (owner/admin/editor)
- **Request Body**: `{ "name": "feature-auth" }`

### `POST /projects/:projectId/git/commits`
- **Auth Required**: Yes (owner/admin/editor)
- **Request Body**: `{ "message": "Initial commit" }`

---

## 7. Sessions
View and manage active login sessions.

### `GET /sessions`
- **Auth Required**: Yes
- **Success Response**: `200 OK` (Array of sessions: OS, browser, IP)

### `DELETE /sessions/:id`
- **Auth Required**: Yes
- **Description**: Revoke a specific session.

### `DELETE /sessions/all`
- **Auth Required**: Yes
- **Description**: Revoke all sessions except the current one.

---

## 8. Notifications
In-app notifications for the current user.

### `GET /notifications`
- **Auth Required**: Yes
- **Success Response**: `200 OK`

### `PATCH /notifications/:id/read`
- **Auth Required**: Yes

### `POST /notifications/read-all`
- **Auth Required**: Yes
