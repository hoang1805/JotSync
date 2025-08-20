import webhooksRoutes from './webhooks.routes.js';

export default function route(app) {
    app.use('/api/webhooks', webhooksRoutes);
}