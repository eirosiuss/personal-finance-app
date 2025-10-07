# Personal Finance App

A modern, full-stack personal finance management application that helps you track your money, set budgets, and save for your future goals.

## 🌐 Live Demo
Check out the live version here: [Personal Finance App](https://personal-finance-app-e2pb.onrender.com/login)

## 🧪 Testing the Application

To test the functionality, you can create a new account using the signup form with any email, and upload the provided [sample statement](./statement.csv) file to explore transactions, budgets, and savings pots.

If you are a **Swedbank** user, you can also upload your own statement to see your personal transactions and budgets in action.

Alternatively, you can use the demo credentials:

**Demo Login:**
- **Email**: `u6226916241@gmail.com`
- **Password**: `Sun4Tree`

**Note**: The demo account comes with sample data including:
- Sample transactions (income and expenses)
- Pre-configured budgets for different categories
- Example savings pots with progress tracking
- Historical data to demonstrate the analytics features

## 🎯 Purpose

This application is designed to give you control over your personal finances. It allows you to:
- Track all your income and expenses
- Set and monitor spending budgets
- Create savings pots for different goals
- View detailed financial overviews and analytics
- Manage your financial data securely

## 🚀 Features

### 💰 Financial Tracking
- **Transaction Management**: Add, edit, and delete income and expense transactions
- **Category Organization**: Organize transactions by custom categories
- **Date Tracking**: Keep track of when transactions occurred
- **Recurring Bills**: Mark transactions as recurring for better planning

### 📊 Budget Management
- **Custom Budgets**: Create budgets for different spending categories
- **Visual Progress**: See budget progress with colorful charts and progress bars
- **Spending Alerts**: Monitor how much you've spent vs. your budget limits
- **Budget Analytics**: View detailed spending summaries and latest transactions

### 🏺 Savings Pots
- **Goal Setting**: Create savings pots with specific target amounts
- **Progress Tracking**: Visual progress bars show how close you are to your goals
- **Deposit/Withdraw**: Easily add or remove money from your savings pots
- **Multiple Pots**: Manage different savings goals simultaneously

### 🔐 User Authentication
- **Secure Login**: Email and password authentication
- **User Registration**: Create new accounts with email verification
- **Password Recovery**: Reset forgotten passwords via email
- **Session Management**: Secure user sessions with JWT tokens

### 📱 Modern Interface
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Clean UI**: Modern, intuitive interface
- **Dark/Light Themes**: Beautiful color schemes for different preferences
- **Interactive Charts**: Visual data representation with conic gradients

## 🛠️ Technologies Used

### Frontend
- **React** - Modern React with latest features
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for styling
- **Framer Motion** - Smooth animations and transitions
- **React Router** - Client-side routing
- **Zustand** - Lightweight state management
- **Axios** - HTTP client for API requests
- **Iconify** - Comprehensive icon library

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database for data storage
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing
- **Cookie Parser** - Cookie parsing middleware

### Email Services
- **Mailgun** - Email delivery service

### Development Tools
- **Nodemon** - Development server auto-restart
- **Cross-env** - Environment variable management

### ## Future Improvements / Planned Features
- Integration with [Fintable](https://fintable.io/) for automated financial data syncing and analysis
- Improve web accessibility 
- Add dark mode option