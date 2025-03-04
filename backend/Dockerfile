FROM maven:3.9.8-eclipse-temurin-21 AS build
COPY . .
RUN mvn clean package -DskipTests

FROM openjdk:21-jdk-slim
COPY --from=build /target/quizzer-0.0.1-SNAPSHOT.jar quizzer.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","quizzer.jar"]