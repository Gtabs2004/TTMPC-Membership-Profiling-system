# System Development Life Cycle

The System Development Life Cycle (SDLC) defines the stages involved in developing a system from conceptualization to deployment. The development of the TTMPC Membership Profiling System integrates the Agile development approach and data-driven optimization techniques to ensure that the system addresses the operational needs of the Tubungan Teachers Multi-Purpose Cooperative (TTMPC). The model consists of seven phases namely: business understanding, data selection, data collection, data preparation, modeling, evaluation, and deployment.

**Figure X. System Development Life Cycle**

<!-- Replace with actual SDLC diagram -->
<!-- Suggested: A flowchart showing the 7 phases connected in sequence with feedback loops -->
<!--
  ┌─────────────────────┐
  │ Business Understanding│
  └──────────┬──────────┘
             ▼
  ┌─────────────────────┐
  │   Data Selection     │
  └──────────┬──────────┘
             ▼
  ┌─────────────────────┐
  │   Data Collection    │
  └──────────┬──────────┘
             ▼
  ┌─────────────────────┐
  │   Data Preparation   │
  └──────────┬──────────┘
             ▼
  ┌─────────────────────┐
  │      Modeling        │
  └──────────┬──────────┘
             ▼
  ┌─────────────────────┐
  │     Evaluation       │
  └──────────┬──────────┘
             ▼
  ┌─────────────────────┐
  │     Deployment       │
  └──────────┘
-->

## Phase 1: Business Understanding

Figure X shows the System Development Life Cycle of the TTMPC Membership Profiling System. The researchers identified and analyzed the operational processes of the Tubungan Teachers Multi-Purpose Cooperative (TTMPC), particularly the administrative staff responsible for managing cooperative membership registration, profiling, and record-keeping. The primary users of the system include the Cooperative Administrator (Admin) and the Cooperative Members. Through observation and consultation with these stakeholders, the researchers gained a deeper understanding of the existing workflow for member registration, application review, profile management, and data retrieval. This phase allowed the researchers to identify inefficiencies in the manual profiling process — such as slow record retrieval, data redundancy, and error-prone paper-based registration — and determine the necessary functionalities of the proposed system.

## Phase 2: Data Selection

In the Data Selection phase, the researchers identified the relevant datasets necessary for the development of the membership profiling system. These datasets include member personal information (full name, date of birth, contact details, address), cooperative-related details (membership ID, membership date, membership status), and administrative records (application status, approval history). The researchers also identified the need for user authentication data to support secure login functionality for both administrators and members. These data categories were selected based on the cooperative's existing registration forms and operational requirements.

## Phase 3: Data Collection

In the Data Collection phase, the researchers gathered data from the cooperative's existing manual records and registration forms. New members submit their personal and cooperative-related information through the online registration form built into the system. The Cooperative Administrator is responsible for reviewing submitted applications, conducting background checks, and verifying the accuracy of the collected information. The gathered data serve as the primary inputs for the system's membership profiling, reporting, and record management functionalities. Data collection also included consultation with TTMPC staff to understand the specific fields and validation rules required for the membership registration process.

## Phase 4: Data Preparation

In the Data Preparation phase, the collected information is organized and structured to ensure efficient system processing. The researchers categorized member data based on membership status (active, pending, past), application status (approved, rejected, under review), and other relevant classifications to support accurate record management. Data validation and formatting were performed to maintain consistency and reliability within the Firebase cloud database. Input validation rules were implemented on the registration forms to ensure that required fields are properly filled and formatted (e.g., valid email addresses, contact numbers, and dates). This phase ensures that the data inputs are accurate, standardized, and suitable for storage and retrieval within the system.

## Phase 5: Modeling

In the Modeling phase, the system architecture and database schema were designed and implemented to serve as the technical foundation of the TTMPC Membership Profiling System. The researchers utilized a web-based architecture comprising a frontend built with JavaScript, React.js, HTML, and CSS for a dynamic and responsive user interface; a backend using PHP for server-side logic and CRUD (Create, Read, Update, Delete) operations; and Firebase as the cloud-based database for secure and real-time data storage. The system implements role-based access control to differentiate between Admin and Member functionalities. Key system modules include the member registration module, application review panel, member management dashboard, and search and filter functionality. The data models were designed to efficiently store, query, and retrieve member profiles while maintaining data integrity and security.

## Phase 6: Evaluation

During the Evaluation phase, the researchers assessed the performance, reliability, and usability of the developed system. Testing procedures were conducted to verify the accuracy of the member registration process, the correctness of CRUD operations on member profiles, the reliability of the authentication and authorization mechanisms, and the responsiveness of the user interface across different devices. Feedback from potential users such as the TTMPC administrative staff and cooperative members was also gathered to determine whether the system meets operational needs and supports efficient membership management. The researchers evaluated the system against the project objectives to ensure that it successfully automates and streamlines the cooperative's member application and profiling process.

## Phase 7: Deployment

Finally, in the Deployment phase, the TTMPC Membership Profiling System is implemented as a web-based platform accessible to authorized personnel of the Tubungan Teachers Multi-Purpose Cooperative. User access is controlled through role-based permissions assigned to the Cooperative Administrator and Cooperative Members. Once deployed, the system enables members to register online by submitting their personal and cooperative-related information, while the administrator can review applications, manage member profiles, and access the dashboard for an overview of cooperative membership statistics — including total members, pending applications, and past members. All data is stored securely in Firebase, ensuring data integrity and real-time synchronization through a centralized digital platform.
