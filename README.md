# smolchat

[smolchat.chat](https://smolchat.chat)

**smolchat** is the open-source chat interface for all your models.

![smolchat cover](./public/cover_smolchat.jpg)

## Features

- Multi-model support: OpenAI, Mistral, Claude, Gemini, Ollama (local models)
- Bring your own API key (BYOK) support via OpenRouter
- File uploads
- Clean, responsive UI with light/dark themes
- Built with Tailwind CSS, shadcn/ui, and prompt-kit
- Open-source and self-hostable
- Customizable: user system prompt, multiple layout options
- Local AI with Ollama: Run models locally with automatic model detection
- Full MCP support (wip)

## Quick Start

### Option 1: With OpenAI (Cloud)

```bash
git clone https://github.com/ibelick/smolchat.git
cd smolchat
npm install
echo "OPENAI_API_KEY=your-key" > .env.local
npm run dev
```

### Option 2: With Ollama (Local)

```bash
# Install and start Ollama
curl -fsSL https://ollama.ai/install.sh | sh
ollama pull llama3.2  # or any model you prefer

# Clone and run smolchat
git clone https://github.com/ibelick/smolchat.git
cd smolchat
npm install
npm run dev
```

smolchat will automatically detect your local Ollama models!

### Option 3: Docker with Ollama

```bash
git clone https://github.com/ibelick/smolchat.git
cd smolchat
docker-compose -f docker-compose.ollama.yml up
```

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ibelick/smolchat)

To unlock features like auth, file uploads, see [INSTALL.md](./INSTALL.md).

## Built with

- [prompt-kit](https://prompt-kit.com/) — AI components
- [shadcn/ui](https://ui.shadcn.com) — core components
- [motion-primitives](https://motion-primitives.com) — animated components
- [vercel ai sdk](https://vercel.com/blog/introducing-the-vercel-ai-sdk) — model integration, AI features
- [supabase](https://supabase.com) — auth and storage

## Sponsors

<a href="https://vercel.com/oss">
  <img alt="Vercel OSS Program" src="https://vercel.com/oss/program-badge.svg" />
</a>

## Performance

The application is optimized for performance with comprehensive improvements:

### Core Optimizations
- Server-side rendering with Next.js
- Efficient state management
- Optimized database queries
- Streaming responses for real-time chat

### AI Model Response Optimizations
- **Centralized Performance Configuration**: All timeout and performance settings managed in `lib/performance-config.ts`
- **Optimized Request Timeouts**: 30s for standard providers, 45s for Ollama (local models)
- **HTTP Keep-Alive**: Enabled connection reuse for better performance
- **AbortSignal Integration**: Proper request cancellation and timeout handling
- **Performance Monitoring**: Built-in timing and logging for chat responses
- **Streaming Optimizations**: Enhanced AI SDK configuration with `experimental_continueSteps`
- **Debounce Optimization**: Reduced chat preview debounce to 100ms for better responsiveness

### Environment Variables for Performance
```env
# Enable performance mode for additional logging and optimizations
NEXT_PUBLIC_ENABLE_PERFORMANCE_MODE=true

# Custom timeout configurations (optional)
STREAM_TIMEOUT=30000
AI_REQUEST_TIMEOUT=30000
```

### Performance Features
- **Connection Pooling**: HTTP keep-alive for provider connections
- **Request Retry Logic**: Configurable retry attempts with exponential backoff
- **Memory Management**: Optimized message caching with size limits
- **Concurrent Request Limiting**: Prevents overwhelming AI providers
- **Performance Telemetry**: Optional monitoring and metrics collection

## License

Apache License 2.0

## Notes

This is a beta release. The codebase is evolving and may change.
