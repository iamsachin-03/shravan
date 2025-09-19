# Project Blueprint

## Overview

This is a React application designed for agents and staff to manage user data, payments, and schedules. The application features role-based access control, allowing agents to access all features while restricting staff to only the daily schedule.

## Project Structure

*   `src/`
    *   `components/`
        *   `DenominationCalculator.jsx`: A component for calculating the total amount from different denominations.
        *   `PaymentHistory.jsx`: A component for displaying the history of payments.
        *   `ProtectedRoute.jsx`: A higher-order component for protecting routes based on user roles.
        *   `Sidebar.jsx`: The main navigation component.
    *   `context/`
        *   `DataContext.jsx`: The data context for managing the application's state.
    *   `pages/`
        *   `AdminDashboardPage.jsx`: The main dashboard for agents.
        *   `DailySchedule.jsx`: A page for managing the daily schedule.
        *   `LoginPage.jsx`: The login page.
        *   `UserMonthlySummary.jsx`: A page for viewing the user's monthly summary.
    *   `App.jsx`: The main application component.
    *   `main.jsx`: The entry point of the application.

## Design and Styling

The application uses Material-UI for its components and styling. The design is modern and visually appealing, with a consistent color scheme and layout across all pages. The main color scheme is based on gradients of blue and purple, with a clean and professional look.

## Features

*   **Login:** Users can log in with their email and password.
*   **Role-based access control:** Agents have access to all features, while staff can only view the daily schedule.
*   **Admin Dashboard:** A dashboard for agents to view total users, total amount received, and quick links to other pages.
*   **Daily Schedule:** A page for managing the daily schedule, including adding payments and calculating denominations.
*   **User Monthly Summary:** A page for viewing the user's monthly summary.
*   **Denomination Calculator:** A tool for calculating the total amount from different denominations.
*   **Payment History:** A table for viewing the history of payments.

## Changes Implemented

*   **Modernized UI:** Updated all pages and components with a more modern and visually appealing design.
*   **Improved Layout:** Used Material-UI's `Card` and `Grid` components to create a more organized and structured layout.
*   **Added Icons:** Added icons to buttons and other elements to improve usability.
*   **Gradient Backgrounds:** Used gradient backgrounds to create a more dynamic and visually interesting look.
*   **User Profile in Sidebar:** Added a user profile section to the sidebar with an avatar, email, and role.
*   **Logout Button:** Added a logout button to the sidebar.
*   **Consistent Styling:** Ensured consistent styling across all pages and components.
*   **Improved Readability:** Used typography and spacing to improve the readability of the content.
