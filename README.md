# Fullstack React ASP.NET Core Web Application

Portfolio website to showcase working knowledge and implementation of a Vite&React/ASP.NET Core/MongoDB web application deployed on AWS S3, Cloudfront, and Lambda.

# Introduction

This is a small side project for me to put my other projects somewhere on display, while also trying out a new stack that I'm unfamiliar with. Still adding stuff to it. I'm using this project kind of as a sandbox.

# Architecture

## Vite/React Frontend

React 19 with TypeScript, bundled with Vite. React-hook-form for the login/register form.

The frontend talks to the backend through a single axios instance (`apiClient.ts`) rather than the default axios import for authentication and authorization. It's configured with `withCredentials: true` so the auth cookies actually get sent, and it has two interceptors bolted on:

- One that hashes the request body and attaches it as `x-amz-content-sha256`, which CloudFront's Origin Access Control needs to sign requests to the Lambda origin
- One that catches a 401, silently calls `/api/auth/refresh`, and retries the original request, so a short-lived access token doesn't interrupt whatever you're doing

Login state lives in `AuthContext` that checks `/api/auth/me` on load. Logged-out visitors can still see the task board, but they can't use the create/edit/delete controls or drag-and-drop.

The only global use of axios is for fetching the Github repos from Github's own api.

Utilized CSS modules for styling, kept close to plain CSS on purpose for practice. I tied to make it actually usable for screen readers, real semantic tags and aria-label/role attributes on anything that isn't obvious from its text alone. Motion respects prefers-reduced-motion too, though I haven't gotten to every animated element yet.

Sizing leans on clamp() a fair bit so things scale smoothly between mobile and desktop instead of just snapping at a breakpoint, with media queries around 768px for the bigger layout shifts (navbar collapsing to a menu, panels stacking instead of sitting side by side).

Colors, spacing, and type all pull from a shared set of CSS variables in one place instead of getting hardcoded per component, partly to keep things consistent and partly so I'm not fighting myself later if I want to retheme something. Style WIP, not really happy with the theme I went for, will think about that later.

## ASP.NET Core Backend

.NET 10 Web API, running inside Lambda through `Amazon.Lambda.AspNetCoreServer.Hosting`. Two controllers for now: `TasksController` for the basic CRUD task board, and `AuthController` for register/login/refresh/logout.

Auth is JWT-based but the tokens never touch localStorage or JS, issued as HttpOnly cookies:

- `access_token`, short-lived (15 min), sent on every request
- `refresh_token`, longer-lived (7 days), scoped to only `/api/auth/refresh` so it never leaks out on normal API calls, and rotated every time it's used

Passwords are hashed with bcrypt before they go to the database. Users have a `Role` field (`User` or `Admin`) for basic role-based authorization. There's no signup flow for admins, the role is manually assigned in Mongo.

Trying to figure out more backend stuff I can build, so that I can try out more doohickeys in .Net.

## MongoDB

MongoDB Atlas, connected using IAM auth (`MONGODB-AWS`) instead of a normal username/password, so the Lambda's execution role handles authentication instead of a connection string secret. Two collections, `tasks` and `users`, are in the cluster with a unique index on username to stop duplicate accounts.

# AWS Infrastructure & Deployment

## S3 Bucket

Holds the built frontend (`client/dist`). GitHub Actions builds it and syncs it up on every push to master. Not typed as a static website in the AWS console, but essentially acts as one behind CloudFront.

## Lambda Function

Runs the ASP.NET Core backend behind a Lambda Function URL. CloudFront sits in front of it with Origin Access Control (OAC), so the function URL only communicates with it an nothing else. Every request gets SigV4 signed by CloudFront on the way in.

The JWT signing key and allowed CORS origin are set as environment variables on the function (`Jwt__SigningKey`) rather than committed anywhere in the repo.

## Cloudfront

I just have one distribution in front of both the S3 bucket and the Lambda function URL, so the frontend and API are on the same origin as far as the browser is concerned. This allows auth cookies to work without dealing with cross-site cookie headaches.

The `/api/*` behavior has caching disabled (you don't want to cache a login response) and forwards the `Cookie` header to the origin using `AllViewersExceptHostHeader`, so the origin gets the real cookies but CloudFront still sets the right `Host` header for the Lambda function URL.

# Github Action Workflows

Two workflows, both trigger on push/PR to master, both auth to AWS via OIDC (no long-lived access keys sitting in GitHub secrets):

- `awsS3CloudFrontEndDeploy.yaml` - installs npm deps, builds the Vite app, syncs `dist` to the S3 bucket, then invalidates the CloudFront cache so the new build actually shows up instead of a stale cached version
- `awsLambdaBackEndDeploy.yaml` - restores and builds the .NET project, installs the Amazon Lambda Tools CLI, then runs `dotnet lambda deploy-function` to push the new build straight to Lambda

Push to master and both fire off independently, so the frontend and backend can ship on their own without waiting on each other. Eventually, I have to figure out if I can fire off only one at a time based on what parts of the repo are updated.
