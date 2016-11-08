# Schema + Algolia

Easiest way to import and index [Schema](https://schema.io) products and content into [Algolia](https://www.algolia.com).

## Getting Started

- Clone this repository
- Create `.env` file and set your Schema Client ID and Key
```bash
SCHEMA_CLIENT_ID=my-client-id
SCHEMA_CLIENT_KEY=my-client-key
ALGOLIA_APP_ID=my-app-id
ALGOLIA_API_KEY=my-api-key
ALGOLIA_PREFIX=schema_ // will result in indexes like `schema_products`
ALGOLIA_INDEXES=products,pages,blogs // comma separated list of models to index
```
- Run `nvm install` (make sure you have [nvm installed](https://github.com/creationix/nvm))
- Run `npm install`

### Sync with Algolia

Import new and update existing search indexes according to the environment configuration described above.

```bash
npm run sync
```

### Refine Search Attributes

Login to the Algolia dashboard to customize your search attributes and preferences on a per index basis. See the [Algolia Docs](https://www.algolia.com/doc) for more information.

## Support

Need help with this package? Visit us in Slack at https://slack.schema.io

## Contributing

Pull requests are welcome.

## License

MIT
