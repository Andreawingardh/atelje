# Picture Wall Designer - Project To-Do List

**Team Members:** Andrea, Jennie, Josefine  
**Timeline:** 6 weeks  
**Tech Stack:** Next.js, Three.js, C# Web API, Entity Framework, MySQL, Railway, GitHub Actions (CI/CD)

## Project Overview
3D picture wall design application allowing users to digitally design their picture wall layouts and use these as guides for physical setup at home.

---

## 🏗️ FOUNDATION PHASE (Week 1)
**Theme: Infrastructure & Basic Connections**

### API Foundation
- [ ] Initialize .NET Web API project structure
- [ ] Configure Entity Framework with MySQL
- [ ] Create basic health check endpoint (`/api/health`)
- [ ] Set up CORS configuration for local development

### Frontend Foundation
- [ ] Initialize Next.js project with TypeScript
- [ ] Install and configure Three.js dependencies
- [ ] Create basic routing structure (`/login`, `/dashboard`, `/designer`)
- [ ] Set up API client with base configuration (what does this mean?)

### 3D Scene Foundation
- [ ] Create basic Three.js scene with camera and lighting
- [ ] Render simple wall geometry (flat plane)
- [ ] Add mouse/touch camera controls (zoom, pan)

### Database Schema V1
- [ ] Create User table (id, email, password_hash, created_at)
- [ ] Create basic Entity Framework models
- [ ] Run first migration and verify database connection

### Testing Foundation (Learn together)
- [ ] Set up xUnit test project for C# backend
- [ ] Configure test database connection
- [ ] Write first simple unit test (e.g., User model validation)
- [ ] Set up basic GitHub Actions workflow file

**First Deploy Target:** API responds, frontend loads, database connected, first test passes in CI

---

## 🔐 AUTHENTICATION PHASE (Week 2)
**Theme: User Management & Security**

### Backend Auth
- [ ] Implement user registration endpoint
- [ ] Implement login endpoint with JWT tokens
- [ ] Add password hashing and validation
- [ ] Create protected endpoint middleware

### Frontend Auth
- [ ] Build login/register forms
- [ ] Implement JWT token storage and management
- [ ] Create protected route components
- [ ] Add logout functionality

### Integration
- [ ] Connect frontend auth forms to backend API
- [ ] Test full authentication flow
- [ ] Handle auth error states and validation

### Backend Testing
- [ ] Write unit tests for registration endpoint
- [ ] Write unit tests for login endpoint
- [ ] Write unit tests for JWT token generation
- [ ] Test password hashing functionality
- [ ] Add test coverage for validation logic

### CI/CD Setup (Learn together)
- [ ] Configure GitHub Actions to run tests on push
- [ ] Set up test database for CI environment
- [ ] Add build verification for both frontend and backend
- [ ] Configure automated test reporting

**Second Deploy Target:** Complete user registration and login working in production, all tests passing in CI

---

## 🎮 CORE 3D PHASE (Week 3 - MVP TARGET)
**Theme: Basic 3D Scene & Picture Placement**

### 3D Scene Foundation - vecka 2?
- [ ] Create coordinate system for wall placement

### Picture System V1 - vecka 2?
- [ ] Create simple rectangular picture geometry
- [ ] Implement click-to-place pictures on wall
- [ ] Add basic picture removal functionality
- [ ] Store picture positions in component state

### Data Persistence
- [ ] Create WallDesign table (id, user_id, design_data, created_at)
- [ ] Build save design endpoint (POST /api/designs)
- [ ] Build load design endpoint (GET /api/designs/:id)
- [ ] Connect 3D scene state to save/load functionality

### Testing for MVP
- [ ] Write unit tests for save design endpoint
- [ ] Write unit tests for load design endpoint
- [ ] Test design data serialization/deserialization
- [ ] Add integration tests for complete save/load flow
- [ ] Verify GitHub Actions passes with new tests

**MVP Deploy Target:** Users can login, place pictures on 3D wall, save and load their designs, all core features tested

---

## 🪑 FURNITURE PHASE (Week 4)
**Theme: Room Context & Basic Furniture**

### Room Enhancement - vecka 3?
- [ ] Add floor plane to 3D scene
- [ ] Create adjustable wall dimensions (height/width controls)
- [ ] Add room depth visualization
- [ ] Implement wall color customization

### Sofa System - vecka 3=
- [ ] Create basic sofa geometry (rectangular prism)
- [ ] Add sofa placement functionality (floor positioning)
- [ ] Implement sofa size adjustment (width, height, depth)
- [ ] Add sofa color/material options

### Enhanced Persistence
- [ ] Extend design data to include furniture positions
- [ ] Update save/load to handle room + furniture + pictures
- [ ] Add design preview/thumbnail generation

### Testing Expansion
- [ ] Write tests for furniture placement logic
- [ ] Test room dimension calculations
- [ ] Add tests for extended design data schema
- [ ] Integration tests for complete room designs
- [ ] Update GitHub Actions to include coverage reporting

---

## 🎨 DESIGN TOOLS PHASE (Week 5)
**Theme: User Experience & Design Polish**

### Advanced Picture Tools
- [ ] Implement drag-and-drop picture repositioning
- [ ] Add picture resizing handles
- [ ] Create picture rotation functionality
- [ ] Add snap-to-grid system

### UI/UX Enhancement
- [ ] Build design tools sidebar
- [ ] Add undo/redo functionality
- [ ] Create design templates/presets
- [ ] Implement design sharing (shareable URLs)

### Advanced Testing Concepts (Learn together)
- [ ] Set up React Testing Library for frontend tests
- [ ] Write component tests for key UI elements
- [ ] Add E2E testing with Playwright or Cypress basics
- [ ] Test API error handling and edge cases
- [ ] Mock Three.js components for testing
- [ ] Add performance testing for 3D rendering
- [ ] Configure test coverage thresholds in GitHub Actions

### Testing Documentation
- [ ] Document testing strategy and patterns
- [ ] Create testing guidelines for the team
- [ ] Add README with instructions for running tests locally

---

## 📤 EXPORT & POLISH PHASE (Week 6)
**Theme: Production Features & Deployment**

### Export System
- [ ] Research PDF generation from Three.js
- [ ] Implement scene screenshot functionality
- [ ] Create measurement calculation system
- [ ] Build PDF export with measurements and images

### Production Polish
- [ ] Comprehensive testing (unit tests, integration tests)
- [ ] Performance optimization (3D rendering, API calls)
- [ ] Error handling and user feedback
- [ ] Cross-browser compatibility testing

### Final Deployment
- [ ] Production environment setup on Railway
- [ ] Environment variables and security configuration
- [ ] User documentation and onboarding flow
- [ ] Final deployment and monitoring setup

---

## 🔄 CROSS-TEAM ROTATION SCHEDULE

**Week 1:** Everyone learns infrastructure setup together
**Week 2:** Primary assignments but cross-pair on complex setup
**Week 3:** Rotate every 2 days (Mon-Tue: 3D, Wed-Thu: Backend, Fri: Frontend)
**Week 4:** Continue rotation, focus on integration points
**Week 5-6:** Work in pairs on complex features, rotate pairs daily

---

## 📋 Key Decisions Made

- **MVP Definition:** Login + 3D wall + picture placement + save/load (Week 3 target)
- **Deployment Strategy:** Early and often (Week 1, 2, 3, then continuous)
- **Testing Strategy:** Continuous testing from Week 1, GitHub Actions CI/CD from Week 2
- **PDF Export:** Moved to Week 6 (not part of MVP)
- **Team Approach:** Cross-functional with rotation to ensure everyone learns all parts
- **Database:** MySQL with Entity Framework
- **Deployment:** Railway for both frontend and backend
- **CI/CD:** GitHub Actions for automated testing and deployment

---

## 🚨 Risk Management

- **Week 1:** Focus on getting deployment pipeline working early to avoid late-stage integration issues
- **Week 2:** Ensure authentication works end-to-end before building dependent features  
- **Week 3:** MVP deadline - prioritize core functionality over polish
- **Week 4-6:** Regular team check-ins to ensure work isn't blocking each other

---

## 📚 Learning Objectives

- **Andrea, Jennie, Josefine:** All gain experience with Three.js, Next.js, and C# Web API
- **Cross-functional skills:** Everyone understands full-stack architecture
- **Testing:** Unit testing with xUnit (C#), integration testing, frontend testing with React Testing Library
- **CI/CD:** GitHub Actions for automated testing and deployment pipelines
- **Deployment:** Production deployment with Railway
- **Project Management:** Agile/iterative development practices
- **Test-Driven Development:** Writing tests alongside features, maintaining test coverage

---

## 🧪 Testing Strategy

### Week-by-Week Testing Focus

**Week 1: Testing Foundations**
- Learn xUnit basics
- Set up test projects
- Write first simple tests
- Create GitHub Actions workflow

**Week 2: Authentication Testing & CI/CD**
- Unit tests for all auth endpoints
- Learn mocking and test databases
- Configure CI pipeline
- Automated test running on every push

**Week 3: Core Feature Testing**
- Test save/load endpoints
- Integration testing basics
- Test data serialization
- Ensure MVP has solid test coverage

**Week 4: Expanded Testing**
- Test new furniture features
- Learn test coverage reporting
- Add coverage thresholds to CI

**Week 5: Advanced Testing (Learn together)**
- Frontend component testing with React Testing Library
- Introduction to E2E testing
- Mocking Three.js for tests
- Performance testing basics

**Week 6: Final Testing & Quality**
- Comprehensive test suite review
- Edge case and error handling tests
- Final CI/CD pipeline refinements

### Testing Types to Learn

- **Unit Tests:** Testing individual functions and methods (C# with xUnit)
- **Integration Tests:** Testing API endpoints and database interactions
- **Component Tests:** Testing React components (React Testing Library)
- **E2E Tests:** Basic end-to-end user flow testing (optional, time permitting)
- **CI/CD:** Automated testing with GitHub Actions
