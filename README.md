# Bookify — Frontend

Bookify is a book browsing & management app with two roles, **Student** and
**Admin**, each with a fully separate dashboard. The frontend is an Angular
(standalone components + signals) single-page app that talks to the
[Bookify Backend](../bookify-backend) REST API over HTTP, using JWT for
authentication.

This is the **routing version** of the frontend: navigation is handled by
**Angular Router** (routes, child routes, and route guards), not by manual
page-switching.

---

## Tech Stack

- Angular (standalone components, signals, new control-flow syntax `@if`/`@for`)
- Angular Router (routes, child routes, functional guards)
- Angular Reactive Forms / Signal Forms
- RxJS
- `jwt-decode` for reading the JWT on the client
- Plain CSS (no UI framework)

---

## Features

### Student

- Browse books (Home — grid view)
- Search books (Search — list view)
- Filter by category
- View book details
- Add books to Cart
- View/edit profile, logout

### Admin

- Manage books: **View, Add, Edit, Delete**
- View book details (read-only — **no** Add to Cart, Admin doesn't shop)
- View/edit profile, logout

Students can never reach the Admin Dashboard or any book-management route,
and Admins can never reach the Student Dashboard or Cart — this is enforced
both by route guards (frontend) and by middleware on the backend.

There is **no Admin Sign Up**: every new account created through `/signup`
is a `student`. To test the Admin side, change a user's `role` field to
`"admin"` directly in MongoDB.

---

## Project Structure

```
src/app/
├── app.ts / app.html / app.css      # Root shell — just a <router-outlet>
├── app.routes.ts                    # Full route tree (see below)
├── app.config.ts                    # provideRouter, provideHttpClient, interceptors
│
├── guards/
│   ├── root.guard.ts                # On '/': redirects an already-logged-in user
│   │                                 # to their dashboard; lets a guest see Signin
│   ├── student.guard.ts             # Protects /student-dashboard (student only)
│   └── admin.guard.ts               # Protects /admin-dashboard (admin only)
│
├── layout/
│   ├── student-dashboard/           # Sidebar shell (Home/Search/Cart/Profile)
│   │                                 # + <router-outlet> for its children
│   └── admin-dashboard/             # Top-nav shell (Manage Books/Profile/Logout)
│                                     # + <router-outlet> for its children
│
├── pages/
│   ├── signin/ , signup/            # Public auth pages
│   ├── book-list/                   # Book grid/list — reused by both dashboards,
│   │                                 # adapts its buttons based on the user's role
│   ├── book-details/                # Reused by both dashboards; Add to Cart is
│   │                                 # hidden for Admin
│   ├── book-form/                   # Admin only — create/edit a book
│   ├── cart/                        # Student only
│   └── profile/                     # Shared — shows user info + Logout
│
├── components/
│   └── book-card/                   # Single book card, used inside book-list
│
├── services/
│   ├── auth.service.ts              # signin/signup/logout, isLoggedIn(), getRole()
│   ├── book.service.ts              # Book CRUD calls
│   └── cart.service.ts              # In-memory cart state
│
├── interceptors/                    # Attaches JWT to requests; global error handling
└── models/                          # Book / User TypeScript interfaces
```

---

## Routing Architecture

```
/                                  → Signin   (rootGuard redirects if already logged in)
/signin                            → Signin
/signup                            → Signup

/student-dashboard   (studentGuard)
  ├── ''                           → BookList   (Home, grid view)
  ├── 'search'                     → BookList   (Search, list view)
  ├── 'book-details/:id'           → BookDetails
  ├── 'cart'                       → Cart
  └── 'profile'                    → Profile

/admin-dashboard     (adminGuard)
  ├── ''                           → BookList   (Manage Books)
  ├── 'add-book'                   → BookForm   (create)
  ├── 'edit-book/:id'              → BookForm   (edit)
  ├── 'book-details/:id'           → BookDetails (read-only, no Add to Cart)
  └── 'profile'                    → Profile

'**'                               → redirects to /signin
```

`BookList`, `BookDetails` and `Profile` are **reused** across both
dashboards instead of being duplicated — they read the current user's role
via `AuthService.getRole()` and adjust which buttons/actions are shown.

### Guards

| Guard | Applied to | Behavior |
|---|---|---|
| `rootGuard` | `/` | Not logged in → shows Signin. Logged in → redirects to the matching dashboard. |
| `studentGuard` | `/student-dashboard` | Not logged in → `/signin`. Logged in but not a student (i.e. admin) → `/admin-dashboard`. |
| `adminGuard` | `/admin-dashboard` | Not logged in → `/signin`. Logged in but not an admin → `/student-dashboard`. |

All three are implemented as Angular functional guards (`CanActivateFn`)
returning a `UrlTree` for redirects, so the Router itself drives navigation.

> **Note:** these guards are a UX convenience, not the real security
> boundary. The backend independently enforces the same rules with
> `authenticateMiddleware` + `authorizeMiddleware("admin")` on every
> protected endpoint, so a request can't bypass authorization just by
> skipping the frontend.

---

## Authentication Flow

1. `signin` / `signup` call the backend, which returns a JWT containing the
   user's `id` and `role`.
2. `AuthService` stores the token in `localStorage`.
3. `isLoggedIn()` decodes the token (`jwt-decode`) and checks its expiry.
4. `getRole()` reads the `role` claim straight from the decoded token.
5. On successful Sign In, the app redirects based on role:
   - `admin` → `/admin-dashboard`
   - `student` → `/student-dashboard`
6. An HTTP interceptor attaches `Authorization: Bearer <token>` to outgoing
   requests automatically.
7. Logout clears the token and navigates to `/signin`.

---

## Running the Project

1. Install dependencies:
   ```bash
   npm install
   ```
2. Make sure the [Bookify Backend](../bookify-backend) is running (default
   `http://localhost:5000`) — the frontend calls it directly by URL.
3. Start the dev server:
   ```bash
   ng serve
   ```
4. Open `http://localhost:4200`.

To test the Admin flow: sign up a normal account, then in MongoDB open the
`users` collection and change that user's `role` field from `"student"` to
`"admin"`, then sign in again.

---

## Useful Scripts

| Command | Description |
|---|---|
| `ng serve` | Run the dev server |
| `ng build` | Production build |
| `ng test` | Run unit tests |