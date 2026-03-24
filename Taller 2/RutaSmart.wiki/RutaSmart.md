# 1. Introduction

## 1.1 Product Perspective

RutaSmart is a digital platform for **school transportation management**. It modernizes and optimizes daily operations for **school transport drivers and small fleet owners**, reducing reliance on manual planning and paper-based administration.

At a high level, RutaSmart consists of **client applications** (Driver App, Parents App/Portal, and an Administrative Web Panel) that communicate with a centralized **RutaSmart Backend API**. The backend integrates with external services for **maps (geocoding/routing/navigation)** and **notifications**, and persists operational data in a **cloud database**.

### Relationship to other systems (ecosystem context)

RutaSmart depends on third-party services to deliver core capabilities:

- **Maps API (External Service):** Provides address geocoding and route calculation/optimization support, enabling map-based route visualization and navigation.
- **Notification Service (External Service):** Sends push notifications/reminders to support attendance confirmations, alerts, and operational communication.
- **Cloud Database:** Stores user accounts, roles, student records, attendance confirmations, payments status, maintenance logs, and notifications.

> **Future integration:** A **Payment Gateway** may be incorporated in later versions to support online payments.

### Major elements (high-level block diagram)
<img width="1000" height="650" alt="image" src="https://github.com/user-attachments/assets/16155b53-4350-485c-97d1-f40a8ce4ad6d" />

### Block Diagram more specific in the Backend (White Style)
<img width="1000" height="650" alt="image" src="https://github.com/user-attachments/assets/b47c0799-6021-415b-b3ce-e81a33d2ff19" />

### Block Diagram more specific in the Backend (Black Style)
<img width="1000" height="650" alt="image" src="https://github.com/user-attachments/assets/8466f459-6147-4d0d-b86c-a3bb6dcb43fd" />

### Interfaces and operating constraints

#### a) System interfaces
- **Client Apps → Backend API:** All user actions (registration, authentication, student management, attendance confirmation, route requests) are sent to the backend.
- **Backend API → Cloud Database:** CRUD operations and persistence for system entities.
- **Backend API → Maps API:** Used for **geocoding** (address → coordinates) and **routing/navigation** (route calculation and map display).
- **Backend API → Notification Service:** Used for daily reminders, alerts, and push notifications.

#### b) User interfaces
- **Driver Mobile App:** Route planning/visualization, student management, attendance-based filtered lists, and operational alerts.
- **Parents App / Portal:** Receives reminders and confirms daily attendance; receives route/arrival-related notifications when enabled.
- **Administrative Web Panel:** Role management and administrative configuration.

#### c) Hardware interfaces
- **Mobile devices** (Android/iOS) for driver and parent usage.
- **GPS/location services** from the mobile device for navigation and proximity-triggered notifications (when enabled).
- **Web browser** for administrative functions.

#### d) Software interfaces
- **Maps Provider SDK/API** (e.g., Google Maps / Mapbox) for mapping and routing functions.
- **Push Notifications Provider** (platform push services or third-party notification service).
- Optional: external identity services (if used for authentication in future).

#### e) Communications interfaces
- Internet connectivity (Wi-Fi/mobile data) is required for:
  - syncing attendance confirmations
  - calculating and retrieving routes
  - delivering notifications
  - updating records in real time

#### f) Memory
- Client apps may cache essential information (e.g., student list, last planned route) to reduce repeated requests and improve usability.
- The backend stores operational records in a cloud database with defined retention and integrity policies (detailed in database requirements).

#### g) Operations
- Daily operation depends on:
  - parents confirming attendance (or driver updating attendance status when applicable)
  - backend generating an optimized route based on confirmed students
  - notifications delivering reminders and alerts during peak route times (morning/afternoon)

#### h) Site adaptation requirements
RutaSmart should support variability across contexts such as:
- different city/region address formats (affecting geocoding quality)
- different route schedules (morning/afternoon, multiple routes)
- multiple vehicles and varying capacities per driver/fleet
- configurable notification preferences depending on stakeholder needs

---

## 1.2 Product Functions

RutaSmart provides an integrated set of functions to support the operational, administrative, and financial management of school transportation services. The system combines logistics optimization, student management, communication, and vehicle oversight within a unified platform.

At a high level, the product includes the following functional capabilities:

### User and Role Management
- User registration and authentication.
- Role-based access control (driver, guide, parent/guardian, administrator).

### Student Management
- Creation, update, deactivation, and listing of student records.
- Storage of student address and guardian contact information.
- Status management (active/inactive).

### Daily Attendance Confirmation
- Daily attendance confirmation by parents/guardians.
- Visualization of confirmed and non-attending students for drivers.
- Filtered lists based on attendance status.

### Route Planning and Optimization
- Automatic ordering of stops based on confirmed students.
- Calculation of optimized routes using mapping services.
- Map-based visualization of routes and stops.
- Navigation support through integrated mapping tools.

### Boarding and Drop-off Verification
- Registration of student boarding status.
- Registration of student drop-off status.
- Visual indicators of student trip progress.

### Notification and Alerts System
- Daily reminders for attendance confirmation.
- Operational alerts (e.g., route updates, delays).
- Maintenance and payment-related notifications.
- Push notifications for parents and drivers.

### Payments Management (MVP – Manual Registration)
- Manual registration of payment status per student.
- Visualization of paid/unpaid status.
- Payment status filtering.

### Vehicle Maintenance Management
- Maintenance record registration (type, date, mileage).
- Maintenance history tracking.
- Configurable maintenance reminders.

### Financial Tracking (Planned / Iterative)
- Registration of operational expenses (e.g., fuel, tolls).
- Monthly income vs. expense summaries.
- Basic financial reporting visualization.

These functions are designed to operate cohesively, allowing drivers to manage routes, administrative tasks, vehicle maintenance, and communication within a single digital environment tailored specifically for school transportation services.

---

## 1.3 User Characteristics

RutaSmart is designed for multiple stakeholder groups involved in school transportation services. Each group presents different levels of technical expertise, usage patterns, and operational expectations.

### Primary Users

#### School Transport Drivers / Small Fleet Owners
- Typically manage routes manually using paper lists, messaging apps, or spreadsheets.
- Educational level: secondary education or technical training.
- Technical expertise: basic to intermediate smartphone usage.
- Usage context: time-critical environment, especially during morning pickup and afternoon drop-off.
- Key needs:
  - Fast access to route information.
  - Clear student status visualization.
  - Minimal interaction steps during active routes.
  - Reliable and simple administrative tools.

Because drivers operate vehicles, the interface must minimize cognitive load and avoid complex interactions while driving.

---

### Secondary Users

#### Guides / Assistants (for larger buses)
- Support attendance management and student supervision.
- Technical expertise: basic to intermediate smartphone usage.
- Usage context: active supervision of children while updating boarding status.
- Key needs:
  - Clear and quick marking of boarding/drop-off status.
  - Simple visual feedback after each action.

---

#### Parents / Guardians
- Responsible for confirming daily attendance and monitoring service updates.
- Educational level: varies widely.
- Technical expertise: ranges from basic to advanced.
- Usage context: short, quick interactions (e.g., confirming attendance in one or two taps).
- Key needs:
  - Clear daily status of their child.
  - Reliable notifications.
  - Transparent payment information.
  - Simple and intuitive interface.

---

### Administrative Users

#### System Administrators
- Manage user accounts, roles, and configuration settings.
- Technical expertise: intermediate to advanced.
- Usage context: web-based administrative tasks.
- Key needs:
  - Structured data management tools.
  - Access control configuration.
  - Monitoring of system records.

---

### Usability and Accessibility Considerations

Given the diversity of users:

- Interfaces must use clear visual hierarchy and readable typography.
- Color-coded status indicators must be intuitive and consistent.
- Actions must require minimal steps.
- The system should support users with limited technical skills.
- Interaction design should reduce distractions during operational use.

RutaSmart prioritizes clarity, efficiency, and ease of interaction to accommodate users with varying levels of digital literacy while maintaining operational safety and reliability.

---

## 1.4 Limitations

RutaSmart is subject to technical, regulatory, operational, and security constraints that limit design and implementation options.

### Regulatory Policies

- The system handles personal data of minors (students) and guardians.
- Data processing must comply with applicable data protection and privacy regulations.
- Location-related data must be managed with appropriate consent and access control.

---

### Hardware Limitations

- The system depends on mobile devices (Android/iOS) with GPS capabilities.
- Performance may vary on low-end or older smartphones.
- GPS accuracy may be affected by environmental factors (urban density, signal interference).
- Battery consumption may increase due to map usage and notifications.

---

### Interfaces to Other Applications

- Route optimization and geocoding depend on third-party Maps API services.
- Notification delivery depends on external push notification providers.
- Future payment gateway integration may introduce additional regulatory and technical constraints.

Service disruptions in third-party systems may impact RutaSmart functionality.

---

### Parallel Operation

- The system must support concurrent access by multiple users (drivers, parents, administrators).
- Peak usage periods (morning and afternoon routes) may increase system load.
- Performance depends on backend scalability and network conditions.

---

### Audit Functions

- The system must store historical records of:
  - Attendance confirmations.
  - Payment registrations.
  - Maintenance logs.
- Data integrity must be preserved to allow traceability and operational review.

---

### Control Functions

- Role-based access control restricts access to sensitive information.
- Parents may only access their own child’s information.
- Drivers may only access students assigned to their routes.
- Administrative users have elevated configuration permissions.

---

### Quality Requirements

- The system must provide reliable route information.
- Notifications should be delivered within acceptable operational timeframes.
- Data persistence must prevent accidental loss of operational records.
- System availability is especially critical during peak route hours.

---

### Criticality of the Application

- While RutaSmart is not a life-critical system, it supports transportation of minors.
- Operational errors (e.g., incorrect attendance status) may impact safety and trust.
- Therefore, reliability and data consistency are essential.

---

### Safety and Security Considerations

- Authentication mechanisms are required to prevent unauthorized access.
- Sensitive data must be transmitted using secure communication protocols.
- The interface must minimize driver distraction during route execution.
- Boarding and drop-off verification must be clear to reduce operational mistakes.

---

### Physical and Mental Considerations

- Drivers operate vehicles while interacting with the system; therefore:
  - Interactions must be simple and limited during active driving.
  - Visual elements must be clearly distinguishable.
- The system should reduce cognitive load by presenting only relevant information at each stage of operation.

These limitations define boundaries within which RutaSmart must be designed and implemented.

---

# 2. References

This section provides additional supporting information for the Software Requirements Specification (SRS). The items described below serve as contextual material to support understanding, validation, and traceability of the requirements.

Unless explicitly stated, the information contained in this section is **not considered formal requirements**, but rather supporting documentation.

---

## 2.1 Examples of Inputs and Outputs

### Example Inputs
- Student registration data:
  - Name
  - Home address
  - Guardian contact information
- Daily attendance confirmation:
  - Student ID
  - Date
  - Attendance status (Confirmed / Not Attending)
- Maintenance record:
  - Vehicle ID
  - Maintenance type
  - Date
  - Mileage
- Payment record:
  - Student ID
  - Payment date
  - Amount
  - Status

### Example Outputs
- Optimized route displayed on a map with ordered stops.
- Filtered list of students based on daily confirmation.
- Monthly payment status report.
- Maintenance alert notification.
- Summary of monthly income vs. expenses.

These examples illustrate expected system behavior but do not constitute requirements by themselves. Formal requirements are defined in Section 3.

---

## 2.2 Supporting and Background Information

The following documents and artifacts were used as input for defining this SRS:

- Product Vision Board.
- Prioritized Product Backlog (MoSCoW method).
- MVP prototype and interface mockups.
- System block diagram.
- Business objectives and adoption goals.

These materials provide strategic and operational context and are used for traceability purposes.

---

## 2.3 Description of the Problems to be Solved

RutaSmart addresses the following identified problems in school transportation services:

- Inefficient manual route planning that does not adapt to daily attendance changes.
- Paper-based administrative management of payments and service records.
- Lack of preventive vehicle maintenance tracking.
- Limited visibility of operational expenses and profitability.
- Inefficient communication between drivers and parents.

The software aims to digitalize and integrate these processes into a centralized platform.

---

## 2.4 Cost Considerations (Contextual Information)

The system is designed to reduce operational costs for drivers by:

- Reducing fuel consumption through route optimization.
- Reducing paper usage through digital records.
- Preventing costly vehicle repairs via maintenance alerts.

No formal cost analysis study is included in this SRS. Cost reduction objectives are considered business goals and not enforceable software requirements unless explicitly defined in Section 3.

---

## 2.5 Special Packaging and Security Instructions

At this stage:

- No special export restrictions are identified.
- Source code will be managed in a version-controlled repository (GitHub).
- Deployment is expected to follow secure cloud hosting practices.
- Communication between client and backend must use secure protocols (e.g., HTTPS).

Unless explicitly defined in Section 3 as constraints, these practices are considered operational guidelines and not standalone requirements.

---

## 2.6 Inclusion Statement

Only the requirements defined in Section 3 (Specific Requirements) are considered binding and verifiable software requirements.

All information in this section is provided as supporting material and does not, by itself, constitute mandatory requirements unless explicitly referenced in Section 3.

---

# 3. Specific Requirements

This section defines the formal functional requirements of RutaSmart.  
Each requirement in this section is:

- Necessary  
- Implementation-free (describes *what*, not *how*)  
- Unambiguous  
- Consistent  
- Complete  
- Singular  
- Feasible  
- Traceable to stakeholder needs and backlog items  
- Verifiable  

All requirements are uniquely identified using the prefix **FR** (Functional Requirement).

---

## 3.1 Functional Requirements

### User and Access Management

**FR01.** The system shall allow a driver to create a user account by providing name, phone number, email address, and password.

**FR02.** The system shall authenticate registered users before granting access to protected functionalities.

**FR03.** The system shall assign a role to each user account.

**FR04.** The system shall restrict access to functionalities based on the user’s assigned role.

---

### Student Management

**FR05.** The system shall allow a driver to create a student record including name, address, and guardian contact information.

**FR06.** The system shall allow a driver to update a student record.

**FR07.** The system shall allow a driver to deactivate a student record.

**FR08.** The system shall display a list of all active students assigned to a driver.

---

### Daily Attendance Confirmation

**FR09.** The system shall allow a parent to confirm whether a student will use the service for a specific date.

**FR10.** The system shall store the attendance status of each student for each operational date.

**FR11.** The system shall display to the driver a list of students filtered by confirmed attendance status for a specific date.

---

### Route Planning and Visualization

**FR12.** The system shall generate a route based on the addresses of students confirmed for a specific date.

**FR13.** The system shall display the generated route on a map interface.

**FR14.** The system shall display the ordered list of stops included in a generated route.

**FR15.** The system shall allow the driver to initiate navigation for a generated route.

---

### Boarding and Drop-off Verification

**FR16.** The system shall allow the driver or guide to register that a student has boarded the vehicle.

**FR17.** The system shall allow the driver or guide to register that a student has been dropped off at the destination.

**FR18.** The system shall display the boarding and drop-off status of each student for a specific route.

---

### Payments Management (MVP)

**FR19.** The system shall allow the driver to register the payment status of a student for a defined billing period.

**FR20.** The system shall display the payment status of each student.

**FR21.** The system shall allow the management/registration of expenses.

---

### Vehicle Maintenance Management

**FR22.** The system shall allow the driver to register a vehicle maintenance record including date, maintenance type, and mileage.

**FR23.** The system shall store historical maintenance records associated with a vehicle.

**FR24.** The system shall generate a maintenance alert when a predefined maintenance condition is reached.

---

### Notifications

**FR24.** The system shall send a notification to parents requesting daily attendance confirmation.

**FR25.** The system shall notify the driver of pending maintenance alerts.

**FR26.** The system shall record notification delivery events.

---

All functional requirements defined above are traceable to stakeholder needs identified in the Product Vision Board and prioritized backlog items.

---

## 3.2 Usability Requirements

The following usability requirements define measurable criteria related to effectiveness, efficiency, and user satisfaction within specific contexts of use. Each requirement is uniquely identified using the prefix **UR** (Usability Requirement).

---

### Effectiveness

**UR01.** The system shall enable a parent to confirm a student’s daily attendance in no more than three user interactions from the main screen.

**UR02.** The system shall allow a driver to access the list of confirmed students for a specific date in no more than three user interactions after authentication.

---

### Efficiency

**UR03.** The system shall display the generated route on the map within five seconds after the driver requests route generation, under normal network conditions.

**UR04.** The system shall register a boarding or drop-off action and update the student’s status on the screen within two seconds after user confirmation.

---

### Satisfaction and Learnability

**UR05.** The system shall present status information (attendance, payment, maintenance) using consistent visual indicators across all relevant interfaces.

**UR06.** The system shall provide immediate visual feedback after a user action that modifies operational data (e.g., attendance confirmation, boarding registration, payment status update).

---

All usability requirements defined above are measurable and verifiable through usability testing and performance observation in real operational contexts.

---

## 3.3 Logical Database Requirements

The following requirements define the logical data model characteristics of RutaSmart.  
Each requirement is identified with the prefix **DR** (Database Requirement) and specifies constraints related to data types, access, relationships, integrity, and retention.

---

### Data Types and Storage

**DR01.** The system shall store user information including unique user identifier, name, contact information, authentication credentials, and assigned role.

**DR02.** The system shall store student information including unique student identifier, name, address, guardian contact information, and operational status.

**DR03.** The system shall store attendance records including student identifier, date, and attendance status.

**DR04.** The system shall store vehicle maintenance records including vehicle identifier, maintenance type, date, and mileage.

**DR05.** The system shall store payment records including student identifier, billing period, payment amount, payment date, and payment status.

---

### Frequency of Use

**DR06.** The system shall allow daily read and write operations for attendance records during operational route hours.

**DR07.** The system shall support frequent read operations of student records by drivers during route execution.

---

### Access Capabilities

**DR08.** The system shall restrict access to student records to authorized users based on role.

**DR09.** The system shall allow parents to access only the records associated with their linked student identifiers.

---

### Entities and Relationships

**DR10.** The system shall maintain a relationship between drivers and assigned students.

**DR11.** The system shall maintain a relationship between vehicles and their associated maintenance records.

**DR12.** The system shall maintain a relationship between students and their attendance records.

---

### Integrity Constraints

**DR13.** The system shall ensure that each stored entity has a unique identifier.

**DR14.** The system shall prevent the creation of attendance records for non-existent student identifiers.

**DR15.** The system shall prevent the deletion of a vehicle record if maintenance records are associated with it.

---

### Data Retention

**DR16.** The system shall retain attendance records for a minimum of one operational year.

**DR17.** The system shall retain maintenance and payment records for a minimum of two operational years.

---

All logical database requirements defined above are verifiable through database schema inspection, access control validation, and data lifecycle testing.

---

## 3.4 Constraints

The following constraints limit the design and implementation options of RutaSmart due to external standards, regulatory requirements, and project limitations.  
Each constraint is identified with the prefix **CR** (Constraint Requirement).

---

### Regulatory and Legal Constraints

**CR01.** The system shall comply with applicable data protection and privacy regulations related to the processing of personal data of minors and guardians.

**CR02.** The system shall restrict access to personal and location-related data according to defined user roles.

---

### Technology Constraints

**CR03.** The system shall operate on mobile devices running supported Android or iOS versions.

**CR04.** The system shall rely on an external Maps API service for geocoding and route visualization.

**CR05.** The system shall use secure communication protocols for data transmission between client applications and backend services.

---

### Project Scope Constraints

**CR06.** The initial version (MVP) shall include manual payment registration and shall not include integrated electronic payment processing.

**CR07.** The initial version (MVP) shall support one primary route per driver per operational schedule (e.g., morning and afternoon).

---

### Operational Constraints

**CR08.** The system shall require internet connectivity to generate routes and synchronize attendance data.

**CR09.** The system shall support concurrent access by multiple users during peak operational periods.

---

### Security Constraints

**CR10.** The system shall require user authentication before granting access to protected system functionalities.

**CR11.** The system shall enforce role-based authorization for access to operational and administrative data.

---

These constraints define mandatory boundaries for the system architecture and implementation and must be considered during design and development phases.

---

# 4. Video

[Project Explanation Video](https://youtu.be/-Zv2KQbAlSs?si=titOZXKUJkxCe1b9)

---

# 5. Project Management

This section describes how RutaSmart is managed throughout its development lifecycle, including requirement tracking, weekly progress monitoring, retrospective analysis, and class deliverables documentation.

---

## 5.1 GitHub Project and Top 10 Requirements

The project is managed using a GitHub repository and a GitHub Project Board (Kanban format) to track progress, issues, and requirement implementation.

The following represent the **Top 10 prioritized requirements** aligned with the MVP scope and SRS functional requirements:

### TR-01 (Linked to FR01)
**User Account Creation**  
The system shall allow a driver to register and create an account.

### TR-02 (Linked to FR02)
**User Authentication**  
The system shall authenticate registered users before granting access.

### TR-03 (Linked to FR05)  
**Student Registration**  
The system shall allow a driver to create student records.

### TR-04 (Linked to FR09)  
**Daily Attendance Confirmation**  
The system shall allow parents to confirm daily student attendance.

### TR-05 (Linked to FR11)  
**Confirmed Students View**  
The system shall allow drivers to view students filtered by attendance status.

### TR-06 (Linked to FR12)  
**Route Generation**  
The system shall generate routes based on confirmed students.

### TR-07 (Linked to FR13)  
**Route Visualization**  
The system shall display generated routes on a map interface.

### TR-08 (Linked to FR16)  
**Boarding Registration**  
The system shall allow drivers to register boarding events.

### TR-09 (Linked to FR19)  
**Manual Payment Registration**  
The system shall allow drivers to register student payment status.

### TR-10 (Linked to FR21)  
**Maintenance Record Registration**  
The system shall allow drivers to register vehicle maintenance records.

These requirements are tracked as GitHub Issues and linked to development tasks and commits to ensure traceability.

---

## 5.2 Weekly Meetings Log

Weekly meetings are conducted to ensure alignment, task distribution, and progress tracking. Each team member answers:

- What did I do last week?
- What will I do this week?
- Are there any obstacles?

---

### Week 1

**Activities**
- Conducted interviews with school transport providers.
- Identified operational pain points and inefficiencies.
- Validated the initial problem statement.

**Obstacles**
- None identified.

---

### Week 2

**Completed**
- Market and competitor research.
- Defined high-level system scope.
- Created GitHub repository and initial structure.

**Next Steps**
- Role distribution among team members.
- Initial backlog creation.

**Obstacles**
- None identified.

---

### Week 3

**Completed**
- Created GitHub Project Board.
- Defined and prioritized Top 10 requirements.
- Started drafting the SRS document.

**Next Steps**
- Continue SRS development.
- Define system architecture and block diagram.

**Obstacles**
- None identified.

---

### Week 4

**Completed**
- Developed UI mockups using Figma.
- Refined dashboard and route visualization concepts.
- Continued SRS documentation.

**Next Steps**
- Validate usability flows.
- Align UI design with functional requirements.

**Obstacles**
- Initial disagreements regarding visual design direction were resolved through team discussion and consensus.

---

### Week 5

**Completed**
- Finalized functional requirements.
- Developed requirements diagrams.
- Recorded explanatory project video.

**Next Steps**
- Review and refine documentation.
- Improve presentation quality.

**Obstacles**
- Audio inconsistencies in the video recording required re-editing for clarity.

---

## 5.3 Sprint Retrospective

At the end of the development cycle, the team conducted a retrospective analysis.

### What should we continue doing?

- Using GitHub Issues for clear task tracking.
- Defining acceptance criteria before implementation.
- Maintaining version control discipline.
- Conducting structured weekly meetings.

### What should we start doing?

- Assigning clear ownership of each major module (Routes, Finance, Maintenance).
- Improving early alignment on UI/UX decisions.
- Increasing intermediate documentation updates instead of batching changes.

### What should we stop doing?

- Advancing tasks without notifying the team.
- Delaying documentation updates.
- Leaving integration tasks for the final stages.

---



