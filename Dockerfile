# Step 1: Choose a lightweight base image
FROM node:20-alpine

# Step 2: Set the internal working directory
WORKDIR /usr/src/app

# Step 3: Copy dependency definitions first to utilize caching
COPY package*.json ./

# Step 4: Install production dependencies only
RUN npm install --omit=dev

# Step 5: Copy the rest of your application code
COPY . .

# Step 6: Inform Northflank which port your service listens on internally
EXPOSE 3000

# Step 7: Command to start the application
# At this point, Northflank automatically boots the container with injected variables
CMD ["node", "server.js"]
