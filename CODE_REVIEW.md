# FurniStore - Pre-Publication Code Review

**Date**: May 16, 2026  
**Status**: ⚠️ **ISSUES FOUND - Review Required Before Publishing**

---

## 📋 Executive Summary

Your FurniStore application is **functionally complete** but has **10+ security and quality issues** that MUST be fixed before production deployment. The most critical issues are **hardcoded secrets and environment configurations**.

---

## 🔴 CRITICAL ISSUES (Must Fix)

### 1. **SECURITY RISK: Hardcoded JWT Secret**

**Severity**: 🔴 CRITICAL  
**Files Affected**:

- `backend/middleware/auth.js` (line 12)
- `backend/controllers/userController.js` (line 78)

**Problem**:

```javascript
process.env.JWT_SECRET || "first.mern.course.encript.password";
```

Your JWT secret is exposed in the code and uses a hardcoded default that anyone can see.

**Risk**: Attackers can forge authentication tokens without needing the actual secret.

**Fix Required**:

- ✅ Create `.env` file in backend root with `JWT_SECRET=<strong-random-secret>`
- ✅ Remove the default fallback from code
- ✅ Never commit `.env` files (add to `.gitignore`)

---

### 2. **SECURITY RISK: Hardcoded API URL (Frontend)**

**Severity**: 🔴 CRITICAL  
**Files Affected**:

- `frontend/src/services/api.js` (line 3)
- `frontend/src/redux/slices/authSlice.jsx` (line 4)

**Problem**:

```javascript
const API_URL = "http://localhost:3000";
```

**Risk**: When you deploy, API still points to localhost. Frontend won't work in production.

**Fix Required**:

- ✅ Create `.env` in frontend with `VITE_API_URL=https://your-api-domain.com`
- ✅ Update code to use `import.meta.env.VITE_API_URL`

---

### 3. **SECURITY RISK: Hardcoded CORS Origin**

**Severity**: 🔴 CRITICAL  
**File**: `backend/index.js` (line 37)

**Problem**:

```javascript
cors({ origin: "http://localhost:3003" });
```

**Risk**: CORS restricted to localhost. Production frontend won't be able to call your API.

**Fix Required**:

- ✅ Add `CORS_ORIGIN` to `.env`
- ✅ Update code to use `process.env.CORS_ORIGIN`

---

### 4. **MISSING ENVIRONMENT FILES**

**Severity**: 🔴 CRITICAL  
**Status**: No `.env` files exist

**Files Needed**:

- `backend/.env` - for database connection, secrets
- `frontend/.env` - for API URL
- `backend/.env.example` - document required variables
- `frontend/.env.example` - document required variables

---

### 5. **Duplicate Code in Backend Server**

**Severity**: 🟡 MEDIUM  
**File**: `backend/index.js`

**Problem**:

```javascript
// Line 31
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Line 62 (DUPLICATE)
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
```

**Issue**: Server listening on TWO ports! This will cause an error.

---

### 6. **Typos in Error Messages**

**Severity**: 🟡 MEDIUM  
**File**: `backend/controllers/userController.js`

**Problem**:

```javascript
"massege": "Error saving user data"  // Should be "message"
"massege": "User not found"           // Should be "message"
```

**Impact**: Inconsistent API responses, confusing clients.

---

## 🟡 HIGH PRIORITY ISSUES

### 7. **Weak Email Validation**

**Severity**: 🟡 HIGH  
**File**: `frontend/src/pages/Register.jsx`

**Current Code**:

```javascript
if (!formData.email.includes("@")) {
  toast.error("Please enter a valid email");
  return false;
}
```

**Issue**: `test@test` passes this check. Need proper regex.

**Fix**:

```javascript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(formData.email)) {
  toast.error("Please enter a valid email");
  return false;
}
```

---

### 8. **No Password Strength Requirements**

**Severity**: 🟡 HIGH  
**File**: `backend/controllers/userController.js` & `frontend/src/pages/Register.jsx`

**Issue**: Users can register with password like "123" or "a"

**Required Checks**:

- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 number
- At least 1 special character

---

### 9. **No Rate Limiting on Auth Endpoints**

**Severity**: 🟡 HIGH  
**Affected Routes**: `/users/login`, `/users`, `/users/forgot-password`

**Issue**: No protection against brute force attacks.

**Fix Required**: Install and use `express-rate-limit`

```bash
npm install express-rate-limit --save
```

---

### 10. **Inconsistent Error Handling**

**Severity**: 🟡 MEDIUM  
**File**: `backend/controllers/userController.js`

**Problem**:

```javascript
// Some errors missing status code
res.json({ massege: "Error saving user data" }); // No status!

// Some have status
res.status(401).json({ message: "Invalid password" });
```

**Fix**: All error responses should have appropriate HTTP status codes.

---

## 🟢 RECOMMENDED IMPROVEMENTS

### 11. **Add Environment Variable for Database**

**File**: `backend/index.js`

**Current**:

```javascript
const MONGODB_URI = process.env.MONGODB_URI;
```

**Issue**: Will fail silently if `MONGODB_URI` not set.

**Fix**:

```javascript
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("MONGODB_URI not set in .env file");
  process.exit(1);
}
```

---

### 12. **Add Input Sanitization**

**Recommendation**: Install `express-validator` for request validation

```bash
npm install express-validator
```

---

### 13. **Remove Console Logs in Production**

**Current State**: Development console logs present but acceptable for debugging.

**Recommendation**: Remove or convert to logger in production.

---

### 14. **Add .env to .gitignore**

**File**: `backend/.gitignore`

**Add these lines**:

```
.env
.env.local
.env.*.local
```

---

## 📋 BEFORE PUBLISHING CHECKLIST

### Backend Setup

- [ ] Create `backend/.env` with required variables
- [ ] Create `backend/.env.example` as template
- [ ] Remove duplicate `app.listen()` call
- [ ] Fix typos "massege" → "message"
- [ ] Add error handling for missing env vars
- [ ] Install and configure `express-rate-limit`
- [ ] Add input validation with `express-validator`
- [ ] Test with `.env` variables

### Frontend Setup

- [ ] Create `frontend/.env` with API URL
- [ ] Create `frontend/.env.example`
- [ ] Update `api.js` to use `import.meta.env.VITE_API_URL`
- [ ] Update `authSlice.jsx` to use `import.meta.env.VITE_API_URL`
- [ ] Verify email validation regex
- [ ] Add password strength requirements
- [ ] Test with production API URL

### Database & Deployment

- [ ] Verify MongoDB connection string
- [ ] Test all auth flows (login, register, forgot password)
- [ ] Test admin routes (verify they require token)
- [ ] Test product and order CRUD operations
- [ ] Verify CORS settings work with production domain
- [ ] Add HTTPS to all endpoints
- [ ] Set up MongoDB Atlas or production database

### Final Verification

- [ ] Run `npm run build` successfully
- [ ] No console errors in browser
- [ ] No unhandled promise rejections
- [ ] All API endpoints tested
- [ ] All routes protected where needed
- [ ] No secrets in code/logs

---

## 📦 Required Environment Variables

### Backend (.env)

```
PORT=3000
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/furnistore
JWT_SECRET=your-super-secret-key-here-min-32-chars
CORS_ORIGIN=https://yourdomain.com
NODE_ENV=production
```

### Frontend (.env)

```
VITE_API_URL=https://api.yourdomain.com
VITE_APP_NAME=FurniStore
```

---

## 🚀 Next Steps

1. **Immediate**: Fix all 🔴 CRITICAL issues (1-5)
2. **High Priority**: Fix all 🟡 HIGH issues (6-10)
3. **Before Deploy**: Complete the checklist
4. **Testing**: Do full testing with environment variables
5. **Deploy**: Deploy to staging first, then production

---

## 📞 Questions?

Make sure to test thoroughly with your production configuration before going live.

**Generated**: May 16, 2026
