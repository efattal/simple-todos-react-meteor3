import React, { useState } from "react"
import { useTracker, useSubscribe } from 'meteor/react-meteor-data/suspense'
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

    const user = useTracker("user", () => Meteor.userAsync())

    const [hideCompleted, setHideCompleted] = useState(false);

    const hideCompletedFilter = { isChecked: { $ne: true } };

    const userFilter = user ? { userId: user._id } : {};

    const pendingOnlyFilter = { ...hideCompletedFilter, ...userFilter };

    const { tasks, pendingTasksCount, isLoading } = useTracker<{ tasks: TaskType[], pendingTasksCount: number, isLoading: boolean }>("tasksByUser", async () => {
        const noDataAvailable = { tasks: [], pendingTasksCount: 0 };

        if (!Meteor.user()) {
            return noDataAvailable;
        }

        const handler = Meteor.subscribe('tasks');

        if (!handler.ready()) {
            return { ...noDataAvailable, isLoading: true };
        }

        const tasks = await TasksCollection.find(
            hideCompleted ? pendingOnlyFilter : userFilter,
            {
                sort: { createdAt: -1 },
            }).fetchAsync()

        const pendingTasksCount = TasksCollection.find(pendingOnlyFilter).count();

        return { tasks, pendingTasksCount };
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