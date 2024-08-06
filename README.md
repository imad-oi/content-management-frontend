# Content Management App

A simple content management application built with Next.js, featuring secure authentication and content protection.

## Features

1. **Authentication with Clerk**
   - Secure user sign-up and login
   - User profile management
   - Session handling

2. **CAPTCHA Verification**
   - Custom CAPTCHA implementation for additional security
   - Session-based CAPTCHA verification to improve user experience

3. **Content Management**
   - Ability to upload and manage text content
   - Support for large text content storage
   - Real-time synchronization across tabs

4. **User Session Management**
   - Support for Writer and Publisher roles
   - Ability to switch between roles within the same browser instance

5. **Security Measures**
   - Encrypted data storage in the browser's IndexedDB
   - Content Security Policy (CSP) implementation
   - Anti-screenshot measures

6. **Responsive Design**
   - Mobile-friendly interface using Tailwind CSS

7. **Toast Notifications**
   - User-friendly notifications for various actions and errors

## Tech Stack

- Next.js 13+ (App Router)
- React
- Clerk for authentication
- IndexedDB for client-side storage
- Tailwind CSS for styling
- Shadcn UI for UI components

## Key Components

1. **Header**
   - Contains navigation and user authentication status
   - Implements Clerk's UserButton for profile management

2. **Captcha**
   - Custom CAPTCHA implementation with canvas for image generation
   - Validates user input against generated CAPTCHA

3. **ContentManager**
   - Handles content upload, storage, and retrieval
   - Implements real-time synchronization across tabs

4. **SessionSwitch**
   - Allows users to switch between Writer and Publisher roles

5. **WelcomeBanner**
   - Displays a welcome message to users

## Utility Functions

- `captchaUtils.js`: Handles CAPTCHA verification status in sessionStorage
- `db.js`: Manages IndexedDB operations for content storage
- `encryption.js`: Provides encryption and decryption functions for data security

## Security Implementations

1. **Data Encryption**
   - All content is encrypted before storage and decrypted upon retrieval

2. **CAPTCHA Verification**
   - Required after login to access content management features
   - Helps prevent automated access and enhances security

3. **Content Security Policy**
   - Implemented to prevent XSS attacks and unauthorized resource loading

4. **Anti-Screenshot Measures**
   - Attempts to prevent easy screen capturing of sensitive content

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up a Clerk account and add your Clerk credentials to `.env.local`
4. Run the development server: `npm run dev`

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

## Deployment

This app can be easily deployed on Vercel or any other platform that supports Next.js applications. Ensure that you set up the environment variables in your deployment environment.

## Future Improvements

- Implement server-side content storage for better scalability
- Add more robust role-based access control
- Enhance the CAPTCHA system with audio options for accessibility
- Implement more sophisticated anti-bot measures