import { Mongo } from 'meteor/mongo';
import { TaskType } from '../../types/TaskType';

export const TasksCollection = new Mongo.Collection<TaskType>('tasks');