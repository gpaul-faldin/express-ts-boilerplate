import { swaggerOptions } from '@config/swagger';
import { errorHandler } from '@middlewares/errorHandler';
import userRoutes from '@routes/userRoutes';
import { logger } from '@utils/logger';
import compression from 'compression';
import cors from 'cors';
import { config } from 'dotenv';
import express, { json, urlencoded } from 'express';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import swaggerJSDoc from 'swagger-jsdoc';
import { serve, setup } from 'swagger-ui-express';

config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors()); // To be customized in production
app.use(compression());
app.use(json());
app.use(urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', serve, setup(swaggerSpec));

app.use('/api/users', userRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
