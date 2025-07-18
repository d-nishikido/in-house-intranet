# In-House Intranet Web System Development Project

## Project Overview
Create an in-house intranet web system.

## Technical Requirements

### Frontend
- React Router v7

### Backend  
- Node.js

### Database
- PostgreSQL

### Environment
- Docker

## Functional Requirements

### Header
- Display "[Employee Name]'s page"
- Today's date
- Link to calendar
- Display paid leave promotion day or regular departure recommendation day

### Sub-header
- Links: [Attendees], [Welfare Committee], [Suggestion Box], [Bulletin Board], [Employee Directory], [Audit Page], [Add to Favorites], [Contact Us]

### Content

#### Announcements
- Display list of announcements

#### External System Links
- Health Anshin Connect App (https://app.uconne.jp/) link
- [HENNGE One] (https://console.mo.hdems.com/#/eandm.co.jp/) temporary hold confirmation link
- [HENNGE One] (https://transfer.hennge.com/) secure storage link
- [ANPIC] (https://anpic-v3.jecc.jp/emg/) safety confirmation system link
- [Office365 Page] (https://m365.cloud.microsoft/apps?auth=2) link

#### Document Processing Status
(※Display number of items received for each)
- Applications
- Approvals (excluding attendance reports)
- Approvals (attendance reports)

#### Work Status
- Link to attendance report page
- Link to work schedule setting page

#### Submission Documents

##### Work-related
- Attendance report (monthly data)
- Work-related approval route diagram

##### Application-related
- PC/Device bring-in/take-out/move application
- PC/Device bring-in/take-out/move status list
- Career review form
- Self-assessment/Career review form list

##### Information Registration-related
- Contract/outsourcing information registration
- Contract/outsourcing information list

##### Personal Information
- Extension registration
- PC management ledger
- Career information
- Link to salary statement

### Menu

#### Company
- Company organization
- About "Position System"
- COCO schedule

#### Operations & Rules
- Work regulations
- Operation guidelines
- Substitute holidays

#### Facilities
- Seats/extensions
- Office address & external phone number list
- Management company contacts

#### From Management Division
- Management division business staff
- HR announcements
- Transfer information/Personnel Info.
- General affairs page
- Company car reservation
- EiS announcements

#### Procedures/Applications
- Various notification applications
- Settlement application workflow
- Business card creation request
- Equipment purchase registration
- Auto insurance registration
- SSL-VPN application
- Employee referral application

#### Equipment
- Phone operation procedures
- Video conference system
- HDD data deletion
- PC setup procedures

#### Intranet & Email
- Settings for intranet browsing
- Intranet attendance report operation
- About Office365
- Email settings
- Bulletin board usage
- Software link collection

## Non-functional Requirements
- Create an attractive system

## Items Requiring Decision
The following items need to be decided:

1. **Authentication & Authorization System**
   - Employee authentication method (company AD integration, custom authentication, etc.)
   - Permission management (general employees, administrators, department managers, etc.)

2. **Database Design**
   - Employee master
   - Organization master
   - Application/approval flow
   - Announcements/bulletin board data

3. **External System Integration**
   - Integration methods with each external system
   - SSO implementation availability

4. **Approval Flow**
   - Application approval route setting method
   - Approver permission management

5. **Notification Features**
   - Email notification specifications
   - In-system notification specifications

6. **Calendar Features**
   - Company calendar integration method
   - Paid leave promotion day setting method

7. **File Management**
   - Document upload/download functionality
   - File storage specifications

8. **API Design**
   - RESTful API
   - Data format (JSON)

## Development Environment & Tools
- Implementation: Claude Code
- Version control: Git
- Containers: Docker / Docker Compose