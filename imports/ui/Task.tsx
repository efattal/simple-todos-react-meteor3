import React, { useState } from 'react';
import { Button, Checkbox, Label, TextInput } from 'flowbite-react';
import { MdDelete, MdEdit, MdSave } from "react-icons/md"
import { TaskType } from '../../types/TaskType';

type Props = {
  task: TaskType,
  onCheckboxClick: (task: TaskType) => void
  onDeleteClick: (task: TaskType) => void
  onUpdate: (task: TaskType) => void
  last: boolean
}

export const Task = ({ task, onCheckboxClick, onDeleteClick, onUpdate, last }: Props) => {
  const [editing, setEditing] = useState(false)

  return (
    <li className={`flex items-center justify-between py-4 group ${last ? "" : "border-b border-gray-200"}`}>
      <Label className="flex items-center w-full">
        <Checkbox className="mr-2"
          checked={!!task.isChecked}
          onClick={() => onCheckboxClick(task)}

          readOnly />
        {editing ? (
          <TextInput className="flex-1" style={{ marginLeft: "-8px" }} defaultValue={task.text} sizing="sm" autoFocus onKeyUp={(e) => {
            if (e.key === "Escape") {
              setEditing(false)
            }
            else if (e.key === "Enter") {
              setEditing(false)
              task.text = e.currentTarget.value
              onUpdate(task)
            }
          }} onBlur={e => setEditing(false)} />
        ) : (
          <span className={task.isChecked ? "line-through" : ""}>{task.text}</span>
        )}
      </Label>
      {!editing && (
        <div className="whitespace-nowrap invisible group-hover:visible">
          <button
            className="edit-btn p-2  text-gray-500 hover:text-gray-700 "
            onClick={() => setEditing(true)}><MdEdit /></button>
          <button
            className="p-2 text-red-500 hover:text-red-700 delete-btn"
            onClick={() => onDeleteClick(task)}><MdDelete /></button>
        </div>
      )}
    </li>
  )
};
