import compression from 'compression';
import cors from 'cors';
import { config } from 'dotenv';
import express, { json, urlencoded } from 'express';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import swaggerJSDoc from 'swagger-jsdoc';
import { serve, setup } from 'swagger-ui-express';

import { swaggerOptions } from '@config/swagger';
import { errorHandler } from '@middlewares/errorHandler';
import userRoutes from '@routes/userRoutes';
import { logger } from '@utils/logger';

config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(json());
app.use(urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Swagger Documentation
const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', serve, setup(swaggerSpec));

// Routes
app.use('/api/users', userRoutes);

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
