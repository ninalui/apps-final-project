# PupScout
## CS5520 Final Project
Team members: Nina Lui, Shuying Du

### Iteration 2
#### Functionalities added
- Location use
- Notification
- Authentication (only partially implemented, will complete during iteration 3)
- Camera Use (added during iteration 1)
- External API Use (added during iteration 1)

#### External API key
```
eyJhbGciOiJSUzI1NiIsInR5cCI6ImF0K2p3dCJ9.eyJuYmYiOjE3MzEyMTUzMTUsImV4cCI6MTczMTIxODkxNSwiaXNzIjoiaHR0cHM6Ly93d3cubnlja2VsLmNvbSIsImNsaWVudF9pZCI6IjI4dTd0dGM0bjZiZXkzb2ZzdjlsZXdrcmxrb25zajk1IiwianRpIjoiOURDOTI3NEEwNkMwODVGMjhDNkExMkFBODYxRkExMDIiLCJpYXQiOjE3MzEyMTUzMTUsInNjb3BlIjpbImFwaSJdfQ.YVR9XKO-eWASv0Rg8zzjB_4tdqKmsZbXPC9Cuak12K_B2yNIediSYcMeuDXfIY8SzmQ1HFCRs24egnXajVW8GhU9UzLPRACM3_ycl6B2yUpQzm8L9UAnGId7V0IDN0zgdYHEnbWOo8WMKyZsZEt53vwIrzvgkzW-pk6PvB7TEEFsEDL72unFdN9mWvUUEaU25_b6r9fhXa7OTO_gkf0VFlTlu4-iAySjZR4XbjFYyO7SNKrUhKqQ6M3gkCs45wZLzkAJwpmZcicfjkjtTA3AiWQhemngq4L893eRifzps6jovVbXhnngsrxTFXsMPcx6GZwyHe3v48TdWZUJUmtPBw
```

#### Current state of the application
##### Post screens (Home and Creating/Editing)
<div align="center">
    <img src="screenshots/iteration2_home.png" width="300"/>
    <img src="screenshots/iteration2_create_post1.png" width="300" /> 
</div>

##### Profile and Breed Collection
<div align="center">
    <img src="screenshots/iteration2_profile.png" width="300" />
    <img src="screenshots/iteration2_breed.png" width="300" />
</div>

##### Leaderboard
<div align="center">
    <img src="screenshots/iteration2_leaderboard.png" width="300" />
</div>

##### Map screen
<div align="center">
    <img src="screenshots/iteration2_map_screen.png" width="300" />
</div>

##### Notification
<div align="center">
    <img src="screenshots/iteration2_setnotification.png" width="300" />
    <img src="screenshots/iteration2_notification.png" width="300" />
</div>

#### Contribution 
Nina:
1. Fixed bug where leaderboard was not updating when users create new posts.
    - Added listeners to posts and breeds subcollections to fetch data when changes happen.
2. Updated profile screen:
    - Added displaying user's email address.
    - Added an edit icon to user's image so it's clear it can be changed.
    - Added a button to log out.
3. Added notification functionality:
    - User can toggle notifications on and off, and schedule the time they want to receive a notification.
    - Daily notification is scheduled to send at the time user specified.
    - Added functionality for user to be navigated to Map screen when tapping on notification.
   
Shuying:
1. Enhanced location functionality in CreatePost screen:
    - Implemented Google Maps API integration for static and interactive maps
    - Created LocationManager component for location permissions and state management
    - Added location selection feature with interactive map markers
    - Integrated location display in PostCard component
2. Developed map screen functionality:
    - Created new MapScreen to display all users' posts using clustered markers
    - Implemented react-native-maps-clustering for efficient marker management
    - Added current location tracking and automatic map centering
    - Integrated distance calculation between user and post locations
    - Added navigation feature using device's default map application
    - Implemented auto-refresh mechanism for real-time map updates
3. Improved code organization:
    - Extracted and centralized posts fetching logic
    - Created reusable location-related components
    - Enhanced PostCard component to support both list and map views 

_________________________________________________________________________

### Iteration 1
#### Current state of the application
##### Post screens (Home and Creating/Editing)
<div align="center">
    <img src="screenshots/posts.PNG" width="300"/>
    <img src="screenshots/create_post.PNG" width="300" /> 
    <img src="screenshots/create_post_2.PNG" width="300" />
</div>

##### Profile and Breed Collection
<div align="center">
    <img src="screenshots/profile.PNG" width="300" />
    <img src="screenshots/breed_collection.PNG" width="300" />
</div>

##### Leaderboard
<div align="center">
    <img src="screenshots/leaderboard.PNG" width="300" />
</div>

#### Contribution 

Nina:
1. Initializing Firebase and Firestore database.
2. Responsible for the Profile screens, which involved:
    - Implementing displaying user's information and components to allow user to edit their notification settings and image.
    - Implementing read operations to fetch user's data (breed collection progress and top breeds).
    - Implementing update operations to update user's data (notification settings and image).  
    - Implementing downloading images from Firebase storage to display.  
3. Responsible for the Breed Collection screen, which involved:
    - Implementing displaying the user's breed collection with breed names and images from their posts. 
    - Implementing read operations to fetch user's collected breeds and images.
4. Responsible for the Leader Board screen, which invovled:
    - Implementing displaying top 3 users 
    - Implementing read operations to fetch data of all users to find the top 3 users and their relevant information.
    - Adding navigation functionality to visit the profiles of top users.  


Shuying: 
1. Setting up the initial framework of the app, including the basic navigation stacks and the sign-in/sign-up pages.
2. Responsible for the CreatePost screen, which involved:
    - Integrated Firebase Storage for image upload and management
    - Implemented Nyckel API integration for automatic dog breed detection
    - Built form validation and error handling for post submissions
    - Created real-time data synchronization with Firestore database
    - Added image preview and breed detection result display
3. Responsible for the Home screen, which involved:
    - Created a scrollable feed of user posts with custom PostCard components
    - Implemented pull-to-refresh functionality for content updates
    - Implemented CRUD operations for post management
    - Developed post-editing navigation with data persistence
    - Implemented real-time post updates using Firestore listeners

#### Data Model and 3 collections
##### Data Model
1. Users Collection (Root collection containing user documents)
   - Document ID: User's UID from Firebase Auth
   - Fields: username, photoURL
2. Posts Subcollection (Nested under each user document)
   - Document ID: Auto-generated
   - Fields:
     imageUrl: URL of uploaded image
     description: Post text
     date: User-selected date
     location: Object containing coordinates
     breed: Detected dog breed
     confidence: Breed detection confidence
     createdAt: Timestamp of post creation
3. Breeds Subcollection (Nested under each user document)
    - Document ID: Breed name
    - Fields:
      breedName: Name of dog breed
      count: Number of posts with this breed
4. Notification Subcollection (Nested under each user document)
   We will implement it in the following iteration

##### CRUD operations
1. Users Collection:
    - Create: writeUserToDB() - Creates new user document with custom ID
    - Read: getDocument() - Fetches user data (used in ProfileScreen)
    - Update: updateDB() - Updates user data (for notification settings and changing image)

2. Posts subcollection:
   - Create: createPost() - Creates new post in user's posts subcollection
   - Read:
     - fetchPosts() in HomeScreen - Fetches all posts for a user
     - Query in MyBreedScreen - Fetches posts filtered by breed
     - getCollectionCount() in Leaderboard - Fetches all posts and gets count
   - Update: updatePost() - Updates existing post
   - Delete: deletePost() - Deletes specific post

3. Breeds subcollection:
   - Create: updateBreedCount() - Creates new breed document if doesn't exist
   - Read:
      - Query in ProfileScreen - Fetches all breeds for top breeds display
      - Query in MyBreedScreen - Fetches breed collection
      - getCollectionCount() in Leaderboard - Fetches all breeds and gets count
   - Update: updateBreedCount() - Updates breed count, increments when new post is made and decrements when post is deleted
