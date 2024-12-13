# JSX To Image

`jsx2img` is a powerful tool that converts JSX and HTML to images using Puppeteer, providing an easy way to generate visual representations of your components.

## 🌟 Features

- [x] Convert JSX to image
- [x] Convert HTML to image
- [x] Support custom styling
- [x] Flexible data injection
- [ ] Support Tailwind CSS parser (Upcoming)
- [ ] Supports build-in templates (Upcoming)

## 💡 Quick Start

### Local Development

```
# Clone the repository
git clone https://github.com/zzzgydi/jsx2img.git

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Test
pnpm run test
```

### Usage Example

```
curl -X POST http://localhost:3000/convert -d '{
    "jsx": "const App = ({data}) => <div className=\"container\">Hello, {data.world}</div>;",
    "data": { "world": "World!!!" },
    "style": ".container { border: 1px solid red; padding: 30px 10px; border-radius: 10px; text-align: center; background: #f5f5f5; }"
}'
```

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
