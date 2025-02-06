import { Task } from "@/types/smartsheet";


type Options = {
    query?: string,
}

/**
 * Filters a list of tasks based on the given options.
 * 
 * @param {Task[]} tasks - The list of tasks to filter.
 * @param {Options} options - Filtering options.
 */
export function applyTaskFilter(tasks: Task[], options: Options): Task[] {
    const { query } = options

    if (!query) {
        return tasks
    }

    // Convert the query to lowercase for case-insensitive comparison
    const lowerCaseQuery = query.toLowerCase()

    // Filter tasks based on whether their title includes the search query
    return tasks.filter(({ title }) => title.toLowerCase().includes(lowerCaseQuery));
}
