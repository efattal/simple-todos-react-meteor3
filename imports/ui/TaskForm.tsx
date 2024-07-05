import { Button, Spinner, TextInput } from 'flowbite-react';
import React, { useActionState, useState } from 'react';

const submitForm = (formData: FormData) => new Promise<void>((resolve) => {
    const text = formData.get("text")

    if (!text) return;

    try {
        setTimeout(async () => {
            try {
                await Meteor.callAsync('tasks.insert', text);
                resolve()
            }
            catch (e) {
                console.error(e)
            }
        }, 1000)
    }
    catch (e) {
        return {
            message: e.message
        }
    }
})


export const TaskForm = () => {
    const [text, setText] = useState("");

    const [response, dispatch, isPending] = useActionState(async (currentState, formData) => {
        try {
            const result = await submitForm(formData)
            setText("")

            return {
                message: ""
            }
        }
        catch (e) {
            return { message: "Failed to complete action" }
        }
    }, {
        message: ""
    })

    return (
        <form className="flex gap-2 relative" action={dispatch}>
            <TextInput
                type="text"
                name="text"
                placeholder="Type to add new tasks"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full"
            />

            <Button
                type="submit"
                className={"whitespace-nowrap px-1"}
                disabled={!text || isPending}
            >Add Task</Button>

            {isPending && <div className="absolute top-0 bottom-0 left-0 right-0 flex justify-center items-center" style={{ backgroundColor: "#00000022" }}><Spinner /></div>}
        </form>
    );
};