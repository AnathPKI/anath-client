FROM nginx:mainline-alpine
COPY docker/docker-entrypoint.sh /
COPY app /usr/share/nginx/html

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]