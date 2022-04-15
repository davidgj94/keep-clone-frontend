import { paths } from '../types/swagger';
import swaggerClient from './swaggerClient';
import axiosInstance from './axiosInstance';

const requestFactory = swaggerClient<paths>(axiosInstance);

export class NotesAPI {
  static getNotes = requestFactory('/notes', 'get');
  static createNote = requestFactory('/notes', 'post');
  static modifyNote = requestFactory('/notes/{noteId}', 'put');
}

export class LabelsAPI {
  static getLabels = requestFactory('/labels', 'get');
  static createLabel = requestFactory('/labels', 'post');
  static modifyLabel = requestFactory('/labels/{labelId}', 'put');
  static deleteLabel = requestFactory('/labels/{labelId}', 'delete');
}
