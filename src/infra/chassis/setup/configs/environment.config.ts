import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager';
import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

const environments = {
  local: 'local',
  dev: 'dev',
  prd: 'prd',
};

export const fetchSecrets = async () => {
  const secretName = 'testesenha';

  const client = new SecretsManagerClient({
    region: 'us-east-2',
  });
  const response = await client.send(
    new GetSecretValueCommand({
      SecretId: secretName,
      VersionStage: 'AWSCURRENT',
    }),
  );
  if (!response.SecretString) {
    throw new Error('SecretString não encontrado');
  }
  return JSON.parse(response.SecretString);
};

const getEnv = (): 'local' | 'dev' | 'prd' => {
  const env = environments[process.env.ENVIRONMENT || ''];

  // if (!env) throw new Error('Ambiente não definido corretamente: ' + env);

  console.log('Ambiente: ' + env);
  return 'local';
};

export const environment = async () => {
  const env = getEnv();

  const envYml = yaml.load(
    readFileSync(join(`config.${env}.yml`), 'utf8'),
  ) as Record<string, unknown>;

  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  // Obtém as credenciais do AWS Secret Manager
  if (env === 'local') {
    const secrets = await fetchSecrets();
    console.log('Obtendo credenciais do AWS Secret Manager...', secrets);
    process.env.DATABASE_HOST = secrets.host;
    process.env.DATABASE_PORT = secrets.port;
    process.env.DATABASE_SCHEMA = secrets.schema;
    process.env.DATABASE_USER = secrets.user;
    process.env.DATABASE_PASS = secrets.pass;

    console.log('==============', process.env.DATABASE_PASS);
  }

  return {
    env,
    port,
    ...envYml,
  };
};
