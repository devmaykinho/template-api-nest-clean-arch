import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

export const root = () => {
  return yaml.load(readFileSync(join(`config.yml`), 'utf8'));
};
