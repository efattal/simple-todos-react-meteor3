export type TaskType = {
    _id: string
    userId: string,
    createdAt: Date,
    text: string
    isChecked?: boolean
}