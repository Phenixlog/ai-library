import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import handler from 'serve-handler';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = process.env.PORT || 3000;

const server = http.createServer((request, response) => {
    return handler(request, response, {
        public: join(__dirname, 'dist'),
        rewrites: [
            { source: '**', destination: '/index.html' }
        ]
    });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 PromptOzer running at http://0.0.0.0:${PORT}`);
});
