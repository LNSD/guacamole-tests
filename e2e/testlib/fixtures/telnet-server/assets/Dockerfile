FROM alpine:3.19

# Create a non-root user
RUN addgroup -g 1000 alpine \
    && adduser -u 1000 -G alpine -s /bin/sh -D alpine

# Install telnet server (busybox)
RUN apk add --no-cache \
    busybox \
    busybox-extras

CMD ["/bin/busybox-extras", "telnetd", "-F", "-K", "-p", "8023", "-l", "/bin/sh"]
