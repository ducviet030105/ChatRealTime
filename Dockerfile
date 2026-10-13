# Sử dụng image chính thức của Node.js (phiên bản 18 Alpine gọn nhẹ)
FROM node:20-alpine

WORKDIR /app

# --- 1. Build phần Frontend (Web) ---
WORKDIR /app/web
COPY web/package.json web/package-lock.json* web/bun.lock* ./
RUN npm install
COPY web/ ./

ARG VITE_CLERK_PUBLISHABLE_KEY
ENV VITE_CLERK_PUBLISHABLE_KEY=$VITE_CLERK_PUBLISHABLE_KEY
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# --- 2. Cài đặt và chuẩn bị phần Backend ---
WORKDIR /app/backend
COPY backend/package.json backend/package-lock.json* backend/bun.lock* ./
RUN npm install
COPY backend/ ./

# --- 3. Cấu hình Port và Khởi chạy ---
# Sevalla cấp port động qua biến môi trường PORT, đồng thời mở cổng 5000 khớp với app của bạn
EXPOSE 5000
ENV PORT=5000
ENV NODE_ENV=production

# Lệnh khởi chạy trỏ đúng vào thư mục src/index.js như khi chạy npm run dev
CMD ["node", "src/index.js"]