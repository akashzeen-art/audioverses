## How to run this project on a new laptop

### 1. Install Node.js

1. Open your browser.
2. Go to the Node.js website.
3. Download the LTS version for your system.
4. Install it with the default options.
5. After install, open PowerShell and type:
   - `node -v`
   - `npm -v`
6. If both commands show a version, Node.js is ready.

### 2. Put the project folder on your laptop

1. Copy the whole `audio-book` folder to your laptop.
2. Remember the path where you put it, for example on the Desktop.
3. Inside it you should see `audio-book/audio/technology`.

### 3. Open the project in PowerShell

1. Open PowerShell.
2. Go to the project folder (change the path to match your machine):
   - `cd C:\Users\your-user-name\Desktop\audio-book\audio\technology`
3. Type `dir` and make sure you see files like `package.json`, `app`, `components`.

### 4. Install project packages

1. In the same PowerShell window, run:
   - `npm install`
2. Wait until it finishes and the prompt appears again.

### 5. Start the site

1. Still in the same folder, run:
   - `npm run dev`
2. Wait until you see a line like:
   - `Local: http://localhost:3000`
   or
   - `Local: http://localhost:3001`
3. Leave this PowerShell window open. Closing it will stop the site.

### 6. Open the site in the browser

1. Open Chrome, Edge, or any browser.
2. In the address bar, type the address you saw in PowerShell, for example:
   - `http://localhost:3000`
3. Press Enter.
4. You should now see the audiobook home page.

### 7. Stop the site

1. Go back to the PowerShell window where `npm run dev` is running.
2. Press `Ctrl + C` on your keyboard.
3. If it asks a question, type `Y` and press Enter.

To start the site again later, repeat steps 3, 4, and 5.