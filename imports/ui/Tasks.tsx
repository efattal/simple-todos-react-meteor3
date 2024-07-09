import React, { useState } from "react"
import { Meteor } from 'meteor/meteor';
import { useTracker, useSubscribe } from '@meteor-vite/react-meteor-data'
import { TaskForm } from "./TaskForm"
import { Button, Spinner } from "flowbite-react"
import { TasksCollection } from "../db/TasksCollection";
import { Task } from "./Task";
import { TaskType } from "../../types/TaskType";

const toggleChecked = ({ _id, isChecked }: TaskType) => {
    Meteor.call('tasks.setIsChecked', _id, !isChecked);
};

const deleteTask = ({ _id }: TaskType) => Meteor.call('tasks.remove', _id);

const updateTask = (task: TaskType) => Meteor.call('tasks.update', task);


const Tasks = () => {
    useSubscribe("tasks")

    const user = useTracker(() => Meteor.user())

    const [hideCompleted, setHideCompleted] = useState(false);

    const hideCompletedFilter = { isChecked: { $ne: true } };

    const userFilter = user ? { userId: user._id } : {};

    const pendingOnlyFilter = { ...hideCompletedFilter, ...userFilter };

    const { tasks, pendingTasksCount, isLoading } = useTracker<{ tasks: TaskType[], pendingTasksCount: number, isLoading: boolean }>(() => {
        const noDataAvailable = { tasks: [], pendingTasksCount: 0, isLoading: false };

        if (!Meteor.user()) {
            return noDataAvailable;
        }

        const handler = Meteor.subscribe('tasks');

        if (!handler.ready()) {
            return { ...noDataAvailable, isLoading: true };
        }

        const tasks = TasksCollection.find(
            hideCompleted ? pendingOnlyFilter : userFilter,
            {
                sort: { createdAt: -1 },
            }).fetch()

        const pendingTasksCount = TasksCollection.find(pendingOnlyFilter).count();

        return { tasks, pendingTasksCount, isLoading: false };
    });


    const pendingTasksTitle = pendingTasksCount ? ` (${pendingTasksCount})` : '';

    return (
        <>
            <TaskForm />

            <div className="mt-2 flex justify-center">
                <Button color="gray" size="xs" className="px-1" onClick={() => setHideCompleted(!hideCompleted)}>
                    {hideCompleted ? 'Show All' : 'Hide Completed'}
                </Button>
            </div>

            {isLoading && <Spinner />}

            <ul>
                {tasks.map((task, i, arr) => (
                    <Task
                        key={task._id}
                        task={task}
                        onCheckboxClick={toggleChecked}
                        onDeleteClick={deleteTask}
                        onUpdate={updateTask}
                        last={i === arr.length - 1}
                    />)
                )}
            </ul>
        </>
    )
}

export default Tasks