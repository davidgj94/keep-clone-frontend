import axios, { AxiosInstance } from 'axios';
import { operations } from '../types/swagger';

type GetNotesOp = operations['getNotes'];
type GetLabelsOp = operations['getLabels'];
type ModifyLabel = operations['modifyLabel'];

export const getNotes = async (params: {
  query: GetNotesOp['parameters']['query'];
}): Promise<GetNotesOp['responses'][200]['schema']> => '';

export const getLabels = async (): Promise<
  GetLabelsOp['responses'][200]['schema']
> => '';
