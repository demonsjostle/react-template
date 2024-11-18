# react-template

# Tools
- Webpack 5.96.xx
- Babel 7.26.xx
- React 18.3.xx
- Typescript/Javascript

# Starter
Use this command to start your project.
```bash
yarn install
yarn fork
```

# Enable enviroments
Support enviroment files
```bash
touch .env.development .env.production
```
if you want to add more .env files please config in config/webpack 

## How to use env 
```Typescript
process.env.[VARIABLE_NAME]
```

# Project structure
I'd be happy to suggest a starting project structure for you.
``` 
src/
 |--assets/
 |--components/
 |--layouts/
 |--pages/
 |--routes/
 |--services/
```

##### For prepare project structure use this command !!
```bash
yarn make-structure
```

# Supports 
These commands are used to automatically set up and add the necessary components to your project. Have fun!
1. [Styled-components](https://styled-components.com/)\
if you need to use styled components please use this command!
```bash
yarn setup styled-components 
```
2. [tailwindcss](https://tailwindcss.com/)\
automatic script to add tailwindcss!
```
yarn setup tailwindcss
```

# Contact 
<a href="https://demonsjostle.com" target="_blank" rel="noopener noreferrer">demonsjostle.com</a>
