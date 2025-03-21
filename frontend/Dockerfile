# Build stage
FROM node:19-alpine AS build
WORKDIR /app
# Copy package files
COPY package*.json ./
# Install ALL dependencies (including dev dependencies)
RUN npm install
# Copy source
COPY . .
# Build the app
RUN npm run build

# Production stage
FROM nginx:alpine
# Support running as arbitrary user which belongs to the root group
# Note that users are not allowed to listen on privileged ports (< 1024)
RUN chmod g+rwx /var/cache/nginx /var/run /var/log/nginx && \
    chown nginx.root /var/cache/nginx /var/run /var/log/nginx && \
    # Make /etc/nginx/html/ available to use
    mkdir -p /etc/nginx/html/ && chmod 777 /etc/nginx/html/ && \
    # comment user directive as master process is run as user in OpenShift anyhow
    sed -i.bak 's/^user/#user/' /etc/nginx/nginx.conf && \
    # Create directory for s2i scripts
    mkdir -p /usr/libexec/s2i

# Copy built static files
COPY --from=build /app/dist /usr/share/nginx/html/
# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copy s2i scripts
COPY .s2i/bin/ /usr/libexec/s2i/

WORKDIR /usr/share/nginx/html/
EXPOSE 8080

# Set user
USER nginx:root

# Use s2i run script
CMD ["/usr/libexec/s2i/run"]
