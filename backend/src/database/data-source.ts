import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { createDatabaseOptions } from './database.options';

const appDataSource = new DataSource(createDatabaseOptions());
export default appDataSource;
