import { promisify } from 'node:util';
import { pipeline } from 'node:stream';
import pino from 'pino';

export const pipelineAsync = promisify(pipeline);

export const logger = pino({ prettyPrint: { ignore: 'pid,hostname'  }})
