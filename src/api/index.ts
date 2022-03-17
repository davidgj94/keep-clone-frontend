import axios from 'axios';
import { paths } from '../types/swagger';
import { swaggerClient } from './swaggerClient';

const requestFactory = swaggerClient<paths>(
  axios.create({ baseURL: 'http://localhost:8000' })
);

export class NotesAPI {
  static getNotes = requestFactory('/notes', 'get');
  static createNote = requestFactory('/notes', 'post');
  static modifyNote = requestFactory('/notes/{noteId}', 'put');
}

export class LabelsAPI {
  static getLabels = requestFactory('/labels', 'get');
  static createLabel = requestFactory('/labels', 'post');
  static modifyLabel = requestFactory('/labels/{labelId}', 'put');
}
