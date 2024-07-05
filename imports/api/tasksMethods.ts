import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { TasksCollection } from '../db/TasksCollection';
import { TaskType } from '/types/TaskType';

Meteor.methods({
  async 'tasks.insert2'(text: string) {
    check(text, String);

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    TasksCollection.insertAsync({
      text,
      createdAt: new Date,
      userId: this.userId,
    })
  },

  async 'tasks.remove'(taskId: string) {
    check(taskId, String);

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    const task = await TasksCollection.findOneAsync({ _id: taskId, userId: this.userId });

    if (!task) {
      throw new Meteor.Error('Access denied.');
    }

    TasksCollection.removeAsync(taskId);
  },

  async 'tasks.update'(newTask: TaskType) {
    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    const task = await TasksCollection.findOneAsync({ _id: newTask._id, userId: this.userId });

    if (!task) {
      throw new Meteor.Error('Access denied.');
    }

    TasksCollection.updateAsync(task._id, {
      $set: {
        text: newTask.text
      }
    });
  },

  async 'tasks.setIsChecked'(taskId: string, isChecked: boolean) {
    check(taskId, String);
    check(isChecked, Boolean);

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    const task = await TasksCollection.findOneAsync({ _id: taskId, userId: this.userId });

    if (!task) {
      throw new Meteor.Error('Access denied.');
    }

    TasksCollection.updateAsync(taskId, {
      $set: {
        isChecked,
      },
    });
  }
});