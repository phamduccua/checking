FROM maven:3.9.9-amazoncorretto-21 AS build

WORKDIR /app

COPY pom.xml .

COPY ./src ./src

RUN mvn clean package -DskipTests

FROM amazoncorretto:21-alpine
COPY --from=build /app/target/*.jar app.jar

EXPOSE 9090
ENTRYPOINT ["java", "-jar", "app.jar"]