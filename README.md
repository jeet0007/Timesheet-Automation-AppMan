# TimeSheet Automation

This project is for those who don't or forget to write there TimeSheet

## Installation

To install all the required libraries

```bash
nvm install
nvm use
yarn
```

## Usage

I have an yarn dev configured it will just open an browser session ans ask you to login.
You will need to configure the Chrome path yourself in the `index.js` file

```bash
yarn dev
```

### Usage with arguments

```javascript
const optionDefinitions = [
  { name: "task", alias: "t", type: String },
  { name: "date", alias: "d", type: String },
  { name: "manhours", alias: "M", type: Number },
  { name: "module", alias: "m", type: String },
  { name: "subTask", alias: "s", type: String },
  { name: "crNo", alias: "c", type: String },
  { name: "file", alias: "f", type: String },
];
```

#### Usage with an input file

To run with an input file, use `-f $PATH_TO_INPUT_FILE` option.

These are the supported file types + example structure:

- `json`

  ```json
  [
    {
      "date": "02/03/2023",
      "manhours": 1,
      "module": "Not sure what is the value here",
      "task": "Whatever task it was",
      "subTask": "Your subtask",
      "crNo": "Your jira card number"
    }
  ]
  ```

- `yaml`

  ```yaml
  - date: "02/03/2023"
    manhours: 1
    module: Not sure what is the value here
    task: Whatever task it was
    subTask: Your subtask
    crNo: Your jira card number
  ```

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
