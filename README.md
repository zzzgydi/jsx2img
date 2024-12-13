# JSX To Image

`jsx2img` is a tool that converts JSX to image by using puppeteer.

## Features

- [x] Support JSX to image
- [x] Support HTML to image
- [ ] Support Tailwind CSS parser

## Get Started

```
pnpm install
pnpm dev
```

then you can test it by curl or `pnpm run test`

```
curl -X POST http://localhost:3000/convert -d '{
    "jsx": "const App = ({data}) => <div className=\"container\">Hello, {data.world}</div>;",
    "data": { "world": "World!!!" },
    "style": ".container { border: 1px solid red; padding: 30px 10px; border-radius: 10px; text-align: center; background: #f5f5f5; }"
}'
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
