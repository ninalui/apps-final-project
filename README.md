# PupScout
### CS5520 Final Project
Team members: Nina Lui, Shuying Du

#### Current state of the application:

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

##### explain which of the CRUD operations are implemented on which collections
1. Users Collection:
  - Create: writeUserToDB() - Creates new user document with custom ID
  - Read: getDocument() - Fetches user data (used in ProfileScreen)
  - Update: updateDB() - Updates user data

2. Posts subcollection:
   - Create: createPost() - Creates new post in user's posts subcollection
   - Read:
     fetchPosts() in HomeScreen - Fetches all posts for a user
     Query in MyBreedScreen - Fetches posts filtered by breed
   - Update: updatePost() - Updates existing post
   - Delete: deletePost() - Deletes specific post
3. Breeds subcollection:
   - Create: updateBreedCount() - Creates new breed document if doesn't exist
   - Read:
      Query in ProfileScreen - Fetches all breeds for top breeds display
      Query in MyBreedScreen - Fetches breed collection
   - Update: updateBreedCount() - Increments breed count when new post is created


