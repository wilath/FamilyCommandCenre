
export interface Task {
    id: number
    name: string;
    created: Date;
    end?: Date;
    isDone: boolean;
    member: string;
    deadline: Date;
    assignedBy: string;
    importance: string;
}