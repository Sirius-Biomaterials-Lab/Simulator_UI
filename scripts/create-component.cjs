const fs = require('fs');
const path = require('path');

const componentName = process.argv[2];

if (!componentName) {
    console.error('❌  Please provide a component name.');
    process.exit(1);
}

const componentDir = path.join(__dirname, '..', 'src', 'components', componentName);

if (fs.existsSync(componentDir)) {
    console.error('❌  Component already exists.');
    process.exit(1);
}

// Создаём папку
fs.mkdirSync(componentDir, { recursive: true });

// Создаём .tsx файл
const componentTsx = `
import styles from "./${componentName}.module.scss";

interface ${componentName}Props {}

export function ${componentName}(props: ${componentName}Props) {
  return (
    <div className={styles.${componentName.toLowerCase()}}>
      ${componentName} component
    </div>
  );
}
`.trim();

fs.writeFileSync(
    path.join(componentDir, `${componentName}.tsx`),
    componentTsx
);

// Создаём .module.scss файл
const componentScss = `
.${componentName.toLowerCase()} {
  
}
`.trim();

fs.writeFileSync(
    path.join(componentDir, `${componentName}.module.scss`),
    componentScss
);

console.log(`✅  Component ${componentName} created successfully.`);
