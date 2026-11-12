# Stage 1: Build
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Limit Maven memory footprint for cloud builders (prevents Out-Of-Memory on Render's 512MB limit)
ENV MAVEN_OPTS="-Xmx384m -XX:+UseSerialGC"

COPY pom.xml .
COPY src ./src
RUN mvn -B package -DskipTests

# Stage 2: Run
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
COPY --from=build /app/target/*.jar app.jar
EXPOSE 5000
ENTRYPOINT ["java", "-jar", "app.jar"]
