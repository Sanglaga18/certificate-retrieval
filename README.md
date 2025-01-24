# certificate-retrieval

Tra cứu chứng chỉ chứng nhận

# certificate-retrieval-backend

## Backend Source Setup Guide

To run the backend source code, follow these steps:

1. **Create a `.env` file**  
   After cloning the project, create a `.env` file in the root directory of the backend project (at the same level as the `appsettings.json` file) and add the following content:

   # Connection strings

   DEFAULT_DB_CONNECTION=Server=YOUR_SERVER_NAME;Database=YOUR_DATABASE_NAME;TrustServerCertificate=True;Trusted_Connection=True;

   # Azure Storage Account (Connection Strings)

   CERTIFICATE_STORAGE_ACCOUNT= YOUR_CERTIFICATE_STORAGE_CONNECTION_STRING
   DIPLOMA_STORAGE_ACCOUNT= YOUR_DIPLOMA_STORAGE_CONNECTION_STRING
   STUDENT_IMAGE_STORAGE_ACCOUNT= YOUR_STUDENT_IMAGE_STORAGE_CONNECTION_STRING
   ID_CARD_STORAGE_ACCOUNT= YOUR_ID_CARD_STORAGE_CONNECTION_STRING

   # API Secret Key

   API_SECRET=YOUR_SECRET_KEY

2. **Notes:**

   - Replace YOUR_SERVER_NAME and YOUR_DATABASE_NAME with your server and database names.
   - Create 4 Azure Storage Accounts and use Connection Strings to configure them as follows:
     - **certificateStorage**: Stores certificate images.
     - **diplomaStorage**: Stores diploma images.
     - **studentImageStorage**: Stores student profile images.
     - **idCardStorage**: Stores ID card or personal document images.
   - Replace YOUR_SECRET_KEY with a strong string to encrypt JWT tokens.

3. **Run the Project**

   - Open a terminal, navigate to the backend source folder, and run the following commands in sequence:

     dotnet restore
     dotnet build
     dotnet run

   - If you are using Visual Studio, open the solution file (.sln) and press F5 to run the project.

# certificate-retrieval-frontend

## Frontend Source Setup Guide

To set up and run the frontend source code, follow these steps:

1. **Install Dependencies**  
   Run the following command in the project directory to install all necessary packages:

   npm install

2. **Start the Development Server**
   Use this command to start the development server:

   npm run dev

   The application should now be running locally. Open your browser and navigate to the URL displayed in the terminal.
