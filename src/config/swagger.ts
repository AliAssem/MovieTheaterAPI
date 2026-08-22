import { Application } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Movie Theater API",
      version: "1.0.0",
      description: "API Project for OSC Backend Development"
    },
    servers: [
      {
        url: "/"
        // or "/" for the current API
      }
    ]
  },
  apis: ["./src/routes/*.ts",
         "./src/server.ts"
  ]
};


const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Application) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};