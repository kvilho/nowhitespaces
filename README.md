# Hourbook
Hourbook - Work Hour Management System

## About the project
This application is designed to help employers and employees track and manage work hours efficiently. It consists of a Java Spring Boot back-end that handles business logic, database interactions, and APIs, paired with a React front-end for a user-friendly interface. The system aims to streamline time tracking and reporting. 

## Use cases
1. Approve Work Hours

Actors: Employer
Description: Employers can review and approve work hours submitted by employees.

Preconditions:

* Employers are logged in.
Postconditions:
* Work hours are marked as approved or rejected.
Basic Flow:

1. Employer navigates to the "Pending Work Hours" page.
2. Reviews submitted hours by employees.
3. Approves or rejects the submission with optional comments.
4. System updates the status in the database.

Alternate Flows:

* Employers can filter by employee, date, or project for faster review.
## Database

![alt text](./documents/tietokantakaavio.jpg "Relational diagram")

## Team Members
- Vilho Karhu https://github.com/kvilho
- Julius Luhtala https://github.com/juliusluhtala
- Nikolas Kataja https://github.com/bhi049
- Kasperi Kuusanmäki https://github.com/kapseri
- Ville Kotilainen https://github.com/villekotilainen

## Backlog Link
https://app.clickup.com/9012737518/v/l/8ck6xfe-732
