# Use the official AWS Lambda Node.js 22 base image
FROM public.ecr.aws/lambda/nodejs:22

# Copy source code
COPY . .

# Install dependencies
RUN npm install
